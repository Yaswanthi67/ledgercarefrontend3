import { computeFileKeccak256 } from '../utils/hash';
import api from './api';

const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';

/**
 * Uploads an evidence file (invoice, receipt, document) to IPFS via the LedgerCare Backend.
 * Securely pins to IPFS without exposing Pinata or IPFS secrets to the frontend.
 * Computes the Keccak-256 evidence hash required by FundEvidenceTracker.sol.
 */
export async function uploadEvidenceToIPFS(file) {
  if (!file) throw new Error('No file provided for upload');

  // Compute immutable local keccak256 hash
  const evidenceHash = await computeFileKeccak256(file);

  try {
    // Send to backend IPFS endpoint
    const res = await api.uploadEvidence(file);
    if (res && res.success && res.cid) {
      return {
        success: true,
        cid: res.cid,
        url: res.url || `${IPFS_GATEWAY}${res.cid}`,
        evidenceHash: res.evidenceHash || evidenceHash,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };
    }
    throw new Error(res.message || 'IPFS upload failed.');
  } catch (err) {
    console.error('Backend IPFS upload error:', err);
    throw new Error(`Evidence upload failed: ${err.message}. Please try again.`);
  }
}
