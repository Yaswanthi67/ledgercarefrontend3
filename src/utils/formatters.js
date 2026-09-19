/**
 * LedgerCare Formatting Utilities
 * Standardized Indian Rupee (₹) presentation, Date, and Hash formatters.
 * Strictly decoupled from blockchain libraries.
 */

// Exchange rate matching backend config (1 ETH = ₹250,000)
export const ETH_TO_INR_RATE = 250000;

/**
 * Formats any number into Indian Rupee format (e.g., ₹10,00,000)
 * @param {number|string} amount 
 * @param {boolean} showSymbol 
 * @returns {string}
 */
export function formatInr(amount, showSymbol = true) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return showSymbol ? '₹0' : '0';
  }
  const num = Math.round(Number(amount));
  const formatted = num.toLocaleString('en-IN');
  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Converts ETH value to INR and formats it
 * Used when reading raw smart contract values from backend
 * @param {number|string} ethAmount 
 * @returns {number}
 */
export function ethToInr(ethAmount) {
  if (!ethAmount) return 0;
  const num = parseFloat(ethAmount);
  if (isNaN(num)) return 0;
  return Math.round(num * ETH_TO_INR_RATE);
}

/**
 * Formats a campaign amount that could be in ETH or INR
 * @param {number|string} amount 
 * @param {boolean} isEth 
 * @returns {string}
 */
export function formatCampaignAmount(amount, isEth = false) {
  if (isEth) {
    return formatInr(ethToInr(amount));
  }
  return formatInr(amount);
}

/**
 * Calculates progress percentage safely between 0 and 100
 * @param {number|string} raised 
 * @param {number|string} target 
 * @returns {number}
 */
export function calculateProgress(raised, target) {
  const r = parseFloat(raised) || 0;
  const t = parseFloat(target) || 0;
  if (t <= 0) return 0;
  const percent = Math.round((r / t) * 1000) / 10;
  return Math.min(Math.max(percent, 0), 100);
}

/**
 * Formats Unix timestamp or ISO string into readable Indian format
 * @param {number|string} timestamp 
 * @returns {string}
 */
export function formatDate(timestamp) {
  if (!timestamp) return 'N/A';
  try {
    let date;
    if (typeof timestamp === 'number' && timestamp < 10000000000) {
      date = new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Formats Unix timestamp with time
 * @param {number|string} timestamp 
 * @returns {string}
 */
export function formatDateTime(timestamp) {
  if (!timestamp) return 'N/A';
  try {
    let date;
    if (typeof timestamp === 'number' && timestamp < 10000000000) {
      date = new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'N/A';
  }
}

/**
 * Calculates days remaining for an end timestamp
 * @param {number|string} endDate 
 * @returns {number}
 */
export function getDaysRemaining(endDate) {
  if (!endDate) return 0;
  try {
    const endMs = typeof endDate === 'number' && endDate < 10000000000 ? endDate * 1000 : new Date(endDate).getTime();
    const now = Date.now();
    const diff = endMs - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Truncates a cryptographic hash or CID for readable UI display
 * @param {string} hash 
 * @param {number} start 
 * @param {number} end 
 * @returns {string}
 */
export function truncateHash(hash, start = 8, end = 6) {
  if (!hash) return 'N/A';
  if (hash.length <= start + end) return hash;
  return `${hash.substring(0, start)}...${hash.substring(hash.length - end)}`;
}

/**
 * Generates an IPFS Gateway URL from CID
 * @param {string} cid 
 * @returns {string}
 */
export function getIpfsUrl(cid) {
  if (!cid) return '#';
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
