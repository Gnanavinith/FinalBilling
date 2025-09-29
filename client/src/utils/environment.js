export const isElectron = (typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent))
export const apiBase = isElectron ? 'http://127.0.0.1:5000' : (import.meta?.env?.VITE_API_BASE || '')
export const agentsBase = (import.meta?.env?.VITE_AGENTS_BASE || 'http://localhost:3001')