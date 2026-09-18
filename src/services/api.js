const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper for API requests with clean error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = options.headers || {};

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Health & Stats
  getHealth: () => apiRequest('/health'),
  getStats: () => apiRequest('/stats'),

  // Campaigns
  getCampaigns: () => apiRequest('/campaigns'),
  getCampaign: (id) => apiRequest(`/campaigns/${id}`),
  getCampaignDonations: (id) => apiRequest(`/campaigns/${id}/donations`),
  getCampaignUsages: (id) => apiRequest(`/campaigns/${id}/usages`),

  // Payments & UPI Donations
  createPaymentOrder: (payload) =>
    apiRequest('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyPayment: (payload) =>
    apiRequest('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Donations List
  getDonations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/donations${query ? `?${query}` : ''}`);
  },
  getDonation: (id) => apiRequest(`/donations/${id}`),
  retryDonation: (id) =>
    apiRequest(`/donations/${id}/retry`, {
      method: 'POST',
    }),

  // IPFS & Evidence
  uploadEvidence: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/evidence/upload', {
      method: 'POST',
      body: formData,
    });
  },

  verifyEvidence: (file, usageId = null, expectedHash = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (usageId) formData.append('usageId', usageId);
    if (expectedHash) formData.append('expectedHash', expectedHash);
    return apiRequest('/evidence/verify', {
      method: 'POST',
      body: formData,
    });
  },

  // Charities
  getCharities: () => apiRequest('/charities'),
};

export default api;
