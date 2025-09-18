const Purchase = require('../models/Purchase')
const Dealer = require('../models/Dealer')
const Mobile = require('../models/Mobile')
const BrandModel = require('../models/BrandModel')
const Accessory = require('../models/Accessory')
const ProductCounter = require('../models/ProductCounter')

function generatePurchaseId() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const ms = String(now.getTime()).slice(-5)
  return `PUR-${yy}${mm}${dd}-${ms}`
}

exports.listPurchases = async (req, res) => {
  try {
    const { dealerId, from, to } = req.query
    const q = {}
    if (dealerId) q.dealerId = dealerId
    const list = await Purchase.find(q).sort({ createdAt: -1 }).lean()
    const filtered = list.filter(p => {
      if (!from && !to) return true
      const d = new Date(p.purchaseDate)
      const okFrom = from ? d >= new Date(from) : true
      const okTo = to ? d <= new Date(to) : true
      return okFrom && okTo
    })
    res.json(filtered)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: String(err?.message || err) })
  }
}

exports.createPurchase = async (req, res) => {
  try {
    const body = req.body || {}
    if (!body.dealerId || !body.purchaseDate || !Array.isArray(body.items)) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const id = generatePurchaseId()
    const invoiceNumber = body.invoiceNumber && String(body.invoiceNumber).trim() ? body.invoiceNumber : `INV-${id.slice(4)}`

    const totalAmount = (body.items || []).reduce((sum, it) => sum + (Number(it.totalPrice) || (Number(it.purchasePrice) || 0) * (Number(it.quantity) || 0)), 0)
    const gstEnabled = !!body.gstEnabled
    const gstPercentage = Number(body.gstPercentage) || 0
    const gstAmount = gstEnabled ? (totalAmount * gstPercentage) / 100 : 0
    const grandTotal = totalAmount + gstAmount

    const purchase = await Purchase.create({
      ...body,
      id,
      invoiceNumber,
      totalAmount,
      gstAmount,
      grandTotal,
      gstEnabled,
      gstPercentage,
    })
    res.status(201).json(purchase)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: String(err?.message || err) })
  }
}

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body || {}
    if (!['Pending','Received'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const purchase = await Purchase.findOne({ id })
    if (!purchase) return res.status(404).json({ error: 'Not found' })
    purchase.status = status
    if (status === 'Received') purchase.receivedAt = new Date()
    await purchase.save()
    res.json(purchase)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: String(err?.message || err) })
  }
}

exports.receivePurchase = async (req, res) => {
  try {
    console.log('=== RECEIVE PURCHASE DEBUG ===')
    const { id } = req.params
    console.log('Purchase ID:', id)
    const purchase = await Purchase.findOne({ id })
    if (!purchase) {
      console.log('Purchase not found')
      return res.status(404).json({ error: 'Not found' })
    }
    console.log('Purchase found:', purchase.id, 'Status:', purchase.status)
    const alreadyReceived = purchase.status === 'Received'

    // Helper: build codes
    const toCode = (str) => String(str || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    const dealer = await Dealer.findOne({ id: purchase.dealerId })
    const dealerName = dealer ? dealer.name : 'Unknown'
    const dealerCode = toCode(dealerName).slice(0, 3)
    console.log('Dealer:', dealerName, 'DealerCode:', dealerCode)
    const getCategoryCode = (category) => {
      const c = String(category || '').toLowerCase()
      if (c === 'mobile' || c === 'mobiles') return 'MOB'
      if (c === 'accessories' || c === 'accessory') return 'ACC'
      return 'OTH'
    }
    const productCodeFromName = (name) => {
      const up = toCode(name)
      if (!up) return 'XXX'
      // Try to preserve numbers like Y21; if name starts with brand then model, pick model chunk
      return up.slice(0, 3)
    }
    const nextCounter = async (key) => {
      const doc = await ProductCounter.findOneAndUpdate(
        { key },
        { $inc: { lastCounter: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      return doc.lastCounter
    }

    // Create/update inventory records per item
    console.log('Processing', purchase.items?.length || 0, 'items')
    for (const item of (purchase.items || [])) {
      const category = (item.category || '').toLowerCase()
      const categoryCode = getCategoryCode(category)
      console.log('Processing item:', item.productName, 'Category:', category, 'Code:', categoryCode)
      if (category === 'mobile' || category === 'mobiles') {
        console.log('Processing mobile item')
        const query = {
          dealerId: purchase.dealerId,
          mobileName: item.productName || 'Mobile',
        }
        // Only add modelNumber to query if it's provided
        if (item.model && item.model.trim()) {
          query.modelNumber = item.model.trim()
        }
        console.log('Mobile query:', query)
        const existing = await Mobile.findOne(query)
        console.log('Existing mobile found:', !!existing)
        const modelCode = productCodeFromName(item.model || item.productName)
        const key = `${dealerCode}-${categoryCode}-${modelCode}`
        // Build IMEI list from fields provided in the Add Purchase form
        const imeisFromList = Array.isArray(item.imeiList) ? item.imeiList : []
        const imeisRaw = [
          item.imeiNumber1,
          item.imeiNumber2,
          ...imeisFromList,
        ]
        const imeis = imeisRaw
          .map(s => (s == null ? '' : String(s)).trim())
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i) // unique
        const qty = Math.max(0, Number(item.quantity) || 0)

        // Resolve brand from input, BrandModel by model, or product name as fallback
        let brandResolved = String(item.brand || '').trim()
        if (!brandResolved) {
          try {
            if (item.model && String(item.model).trim()) {
              const bm = await BrandModel.findOne({ $or: [{ model: item.model }, { aliases: item.model }] })
              if (bm && bm.brand) brandResolved = bm.brand
            }
          } catch {}
        }
        if (!brandResolved) {
          const words = String(item.productName || '').trim().split(/\s+/)
          brandResolved = words.length > 0 ? words[0] : ''
        }

        // 1) Create mobile docs for provided IMEIs.
        // If exactly two IMEIs provided and quantity is 1, store both IMEIs on a single record.
        if (qty === 1 && imeis.length === 2) {
          const counter = await nextCounter(key)
          const pid = `${dealerCode}-${categoryCode}-${modelCode}-${String(counter).padStart(4, '0')}`
          const dualImei = {
            id: `MOB-${String(Date.now())}-${Math.floor(Math.random()*1000)}-${Math.floor(Math.random()*1000)}`,
            mobileName: item.productName || 'Mobile',
            brand: brandResolved,
            modelNumber: item.model && item.model.trim() ? item.model.trim() : 'Unknown',
            imeiNumber1: String(imeis[0]),
            imeiNumber2: String(imeis[1]),
            dealerId: purchase.dealerId,
            dealerName,
            pricePerProduct: Number(item.purchasePrice) || 0,
            sellingPrice: Number(item.sellingPrice) || Number(item.purchasePrice) || 0,
            totalQuantity: 1,
            productIds: [pid],
            color: item.color || '',
            ram: item.ram || '',
            storage: item.storage || '',
            simSlot: item.simSlot || '',
            processor: item.processor || '',
            displaySize: item.displaySize || '',
            camera: item.camera || '',
            battery: item.battery || '',
            operatingSystem: item.operatingSystem || '',
            networkType: item.networkType || '',
          }
          try {
            await Mobile.create(dualImei)
          } catch (err) {
            if (!(err && err.code === 11000)) throw err
            // fallback without IMEIs if uniqueness conflicts
            dualImei.imeiNumber1 = undefined
            dualImei.imeiNumber2 = undefined
            await Mobile.create(dualImei)
          }
        } else {
          // Otherwise, one record per IMEI (or none if not provided)
          for (const im of imeis) {
            const counter = await nextCounter(key)
            const pid = `${dealerCode}-${categoryCode}-${modelCode}-${String(counter).padStart(4, '0')}`
            const perImei = {
              id: `MOB-${String(Date.now())}-${Math.floor(Math.random()*1000)}-${Math.floor(Math.random()*1000)}`,
              mobileName: item.productName || 'Mobile',
              brand: brandResolved,
              modelNumber: item.model && item.model.trim() ? item.model.trim() : 'Unknown',
              imeiNumber1: String(im),
              imeiNumber2: undefined,
              dealerId: purchase.dealerId,
              dealerName,
              pricePerProduct: Number(item.purchasePrice) || 0,
              sellingPrice: Number(item.sellingPrice) || Number(item.purchasePrice) || 0,
              totalQuantity: 1,
              productIds: [pid],
              color: item.color || '',
              ram: item.ram || '',
              storage: item.storage || '',
              simSlot: item.simSlot || '',
              processor: item.processor || '',
              displaySize: item.displaySize || '',
              camera: item.camera || '',
              battery: item.battery || '',
              operatingSystem: item.operatingSystem || '',
              networkType: item.networkType || '',
            }
            try {
              await Mobile.create(perImei)
            } catch (err) {
              if (!(err && err.code === 11000)) throw err
              // In case IMEI duplicates, store without IMEIs
              perImei.imeiNumber1 = undefined
              perImei.imeiNumber2 = undefined
              await Mobile.create(perImei)
            }
          }
        }

        // 2) For any remainder units without explicit IMEIs, aggregate into existing or create batch
        const remaining = Math.max(0, qty - imeis.length)
        if (remaining > 0) {
          if (existing) {
            if (!Array.isArray(existing.productIds)) existing.productIds = []
            if (item.productId) {
              const providedPid = String(item.productId).trim()
              if (providedPid && !existing.productIds.includes(providedPid)) existing.productIds.push(providedPid)
            }
            for (let i = 0; i < remaining; i++) {
              const counter = await nextCounter(key)
              const pid = `${dealerCode}-${categoryCode}-${modelCode}-${String(counter).padStart(4, '0')}`
              existing.productIds.push(pid)
            }
            existing.totalQuantity = (Number(existing.totalQuantity)||0) + remaining
            if (brandResolved) existing.brand = brandResolved
            if (item.color) existing.color = item.color
            if (item.ram) existing.ram = item.ram
            if (item.storage) existing.storage = item.storage
            if (item.purchasePrice != null) existing.pricePerProduct = Number(item.purchasePrice) || 0
            if (item.sellingPrice != null) existing.sellingPrice = Number(item.sellingPrice) || Number(item.purchasePrice) || 0
            await existing.save()
          } else {
            const productIds = []
            if (item.productId) {
              const providedPid = String(item.productId).trim()
              if (providedPid) productIds.push(providedPid)
            }
            for (let i = 0; i < remaining; i++) {
              const counter = await nextCounter(key)
              const pid = `${dealerCode}-${categoryCode}-${modelCode}-${String(counter).padStart(4, '0')}`
              productIds.push(pid)
            }
            const payload = {
              id: `MOB-${String(Date.now())}-${Math.floor(Math.random()*1000)}`,
              mobileName: item.productName || 'Mobile',
              brand: brandResolved,
              modelNumber: item.model && item.model.trim() ? item.model.trim() : 'Unknown',
              dealerId: purchase.dealerId,
              dealerName,
              pricePerProduct: Number(item.purchasePrice) || 0,
              sellingPrice: Number(item.sellingPrice) || Number(item.purchasePrice) || 0,
              totalQuantity: remaining,
              productIds,
              color: item.color || '',
              ram: item.ram || '',
              storage: item.storage || '',
              simSlot: item.simSlot || '',
              processor: item.processor || '',
              displaySize: item.displaySize || '',
              camera: item.camera || '',
              battery: item.battery || '',
              operatingSystem: item.operatingSystem || '',
              networkType: item.networkType || '',
            }
            await Mobile.create(payload)
          }
        }
      } else if (category === 'accessories' || category === 'accessory') {
        const modelCode = productCodeFromName(item.productName)
        const prefix = `${dealerCode}-${categoryCode}-${modelCode}`
        const existingAcc = await Accessory.findOne({ dealerId: purchase.dealerId, productId: prefix })
        if (existingAcc) {
          existingAcc.productName = item.productName || existingAcc.productName
          if (item.brand) existingAcc.brand = item.brand
          if (item.accessoryCategory) existingAcc.category = item.accessoryCategory
          existingAcc.quantity = (Number(existingAcc.quantity)||0) + (Number(item.quantity)||0)
          if (!Array.isArray(existingAcc.productIds)) existingAcc.productIds = []
          // generate item IDs
          const addQty = Math.max(0, Number(item.quantity) || 0)
          for (let i = 0; i < addQty; i++) {
            const counter = await nextCounter(prefix)
            const pid = `${prefix}-${String(counter).padStart(4, '0')}`
            existingAcc.productIds.push(pid)
          }
          if (item.purchasePrice != null) existingAcc.unitPrice = Number(item.purchasePrice) || existingAcc.unitPrice
          if (item.sellingPrice != null) existingAcc.sellingPrice = Number(item.sellingPrice) || existingAcc.sellingPrice
          await existingAcc.save()
        } else {
          const productIds = []
          const addQty = Math.max(0, Number(item.quantity) || 0)
          for (let i = 0; i < addQty; i++) {
            const counter = await nextCounter(prefix)
            productIds.push(`${prefix}-${String(counter).padStart(4, '0')}`)
          }
          await Accessory.create({
            id: `ACC-${String(Date.now())}-${Math.floor(Math.random()*1000)}`,
            dealerId: purchase.dealerId,
            dealerName,
            productId: prefix,
            productIds,
            productName: item.productName || 'Accessory',
            brand: item.brand || '',
            category: item.accessoryCategory || '',
            quantity: Number(item.quantity) || 0,
            unitPrice: Number(item.purchasePrice) || 0,
            sellingPrice: Number(item.sellingPrice) || Number(item.purchasePrice) || 0,
          })
        }
      } else {
        // ignore other categories for inventory movement
      }
    }

    purchase.status = 'Received'
    purchase.receivedAt = new Date()
    await purchase.save()
    console.log('=== RECEIVE PURCHASE SUCCESS ===')
    res.json({ ok: true, alreadyReceived })
  } catch (err) {
    console.error('=== RECEIVE PURCHASE ERROR ===')
    console.error('Error:', err)
    console.error('Stack:', err.stack)
    res.status(500).json({ error: 'Internal Server Error', details: String(err?.message || err) })
  }
}


