// Single API entry point. The mock/real swap is controlled ENTIRELY by the
// VITE_USE_MOCK env var — components import this default export and never know
// (or care) which implementation is active.
//
// When the ML models go live: set VITE_USE_MOCK=false and the real client is
// used. No component changes required.
import * as mock from './mockClient'
import * as real from './client'

const api = import.meta.env.VITE_USE_MOCK === 'true' ? mock : real

export default api
