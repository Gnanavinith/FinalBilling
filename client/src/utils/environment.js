export const isElectron = (typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent))
export const apiBase = isElectron ? 'http://127.0.0.1:5000' : (import.meta?.env?.VITE_API_BASE || 'https://finalbilling-1.onrender.com')
export const agentsBase = (import.meta?.env?.VITE_AGENTS_BASE || 'https://finalbilling-1.onrender.com')