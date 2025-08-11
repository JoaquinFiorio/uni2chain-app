/**
 * API URLs
 */

export const API_URL = 'https://uni2chainback-production.up.railway.app/api'; // URL base de la API
//export const API_URL = 'http://localhost:5000/api'; // URL base de la API
/**
 * Endpoints específicos
 */
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  VERIFY_TOKEN: `${API_URL}/auth/verify-token`,
  UPDATE_WALLET: `${API_URL}/auth/update-wallet`,
};

/**
 * Otros endpoints pueden ser agregados aquí en el futuro
 */
export const ENDPOINTS = {
  // Ejemplo: NODES: `${API_URL}/nodes`,
  PURCHASE_VERIFY: `${API_URL}/purchase/verify`,
};

/**
 * Blockchain Contract Addresses
 */
export const CONTRACT_ADDRESSES = {
  // Token contracts (BSC Testnet)
  //USDT: '0x304aCc5F7475518d102A0faB2cc2437355242a4D',
  //UNI2: '0x393A6034D02C3b20dEc41C9e216A13E510bef582',
  
  // Node related contracts (BSC Testnet)
  //MEMBERSHIP_TOKEN: '0x9A7292C4415448c6f4C1f2E0F3c5763Fdba3a419',
  //NODE_PURCHASE: '0x1A1638aE7A6F8c38606034f00fD430ecBF5C8376'

  // token contracts (BSC Mainnet)
  USDT: '0x55d398326f99059fF775485246999027B3197955',
  UNI2: '0x9Cd3fFB31C0BAe5D0771Ef48e735dc1ca2333275',

  // Node related contracts (BSC Mainnet)
  MEMBERSHIP_TOKEN: '0x02207A5458697E3c824867f46C477553A36F6237',
  NODE_PURCHASE: '0x40a02a54b08bDF20E779aCAF724974859501c02B'
};