import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatInr } from '../utils/formatters';
import StatusBadge from '../components/StatusBadge';
import {
  Upload,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Lock,
  Layers,
  FileText,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export default function CharityEvidenceUpload() {
  const [searchParams] = useSearchParams();
  const defaultCampaignId = searchParams.get('campaignId') || '1';

  const [selectedFile, setSelectedFile] = useState(null);
  const [campaignId, setCampaignId] = useState(defaultCampaignId);
  const [purpose, setPurpose] = useState('Purchase of educational materials');
  const [amount, setAmount] = useState('50000');
  const [documentType, setDocumentType] = useState('Bill / Receipt');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select an evidence document to upload.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      // Dispatches file to POST /api/evidence/upload
      // The backend uploads to IPFS, computes ONE original Keccak-256 hash, and pins CID
      const res = await api.uploadEvidence(selectedFile, {
        campaignId,
        purpose,
        amount,
      });

      if (res.success && res.cid && res.evidenceHash) {
        setUploadedData({
          fileName: res.fileName || selectedFile.name,
          fileSize: res.fileSize || selectedFile.size,
          cid: res.cid,
          evidenceHash: res.evidenceHash,
          url: res.url || `https://gateway.pinata.cloud/ipfs/${res.cid}`,
          campaignId,
          purpose,
          amount,
        });
      } else {
        throw new Error(res.message || 'Evidence upload failed.');
      }
    } catch (err) {
      console.error('Evidence upload failed:', err);
      setErrorMessage(err.message || 'Failed to pin evidence to IPFS. Please verify backend service.');
    } finally {
      setIsUploading(false);
    }
  };

  const copyHash = () => {
    navigator.clipboard.writeText(uploadedData.evidenceHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div style={{ maxWidth: '820px', margin: '1rem auto 3rem', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          background: 'rgba(6, 182, 212, 0.12)',
          color: '#22d3ee',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '0.85rem',
        }}>
          <FileCheck2 size={14} />
          <span>IPFS Decentralized Storage & Cryptographic Hashing</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
          Upload Expenditure Evidence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
          Upload bills, receipts, photos, or audit certificates. The backend pins the file to IPFS, calculates the original Keccak-256 evidence hash, and stores the record on <code>FundEvidenceTracker.sol</code>.
        </p>
      </div>

      {uploadedData ? (
        /* Upload Success View (Section 18) */
        <div className="card" style={{
          padding: '2.5rem 2rem',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckCircle2 size={36} color="#34d399" />
            </div>

            <span style={{
              fontSize: '0.8rem',
              fontWeight: '700',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
            }}>
              Evidence Uploaded ✓
            </span>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff', marginTop: '0.85rem' }}>
              Proof Cryptographically Anchored
            </h2>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Evidence File</span>
              <strong style={{ color: '#ffffff' }}>{uploadedData.fileName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Purpose</span>
              <span style={{ color: '#ffffff' }}>{uploadedData.purpose}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount (₹)</span>
              <strong style={{ color: '#34d399' }}>{formatInr(uploadedData.amount)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>IPFS CID</span>
              <a
                href={uploadedData.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#60a5fa', textDecoration: 'underline', fontSize: '0.82rem' }}
                className="font-mono"
              >
                {uploadedData.cid} ↗
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Blockchain Record</span>
              <StatusBadge type="blockchain" status="RECORDED" size="sm" />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Original Evidence Hash (Keccak-256):
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(7, 11, 20, 0.75)',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: '#34d399', wordBreak: 'break-all' }}>
                  {uploadedData.evidenceHash}
                </span>
                <button
                  onClick={copyHash}
                  style={{ background: 'transparent', border: 'none', color: copiedHash ? '#34d399' : '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
                >
                  {copiedHash ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to={`/evidence/1`}
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}
            >
              <ShieldCheck size={16} />
              <span>Test Hash Verification</span>
            </Link>

            <button
              onClick={() => { setUploadedData(null); setSelectedFile(null); }}
              className="btn btn-secondary"
            >
              Upload Another Document
            </button>
          </div>
        </div>
      ) : (
        /* Upload Form */
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Campaign & Doc Type */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Associate with Campaign *</label>
                <select
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  className="form-select"
                >
                  <option value="1">#1: Education Support Campaign</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Evidence Document Type *</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="form-select"
                >
                  <option value="Bill / Receipt">Official Bill / Invoice</option>
                  <option value="Vendor Receipt">Vendor Payment Receipt</option>
                  <option value="Beneficiary Photo">On-Ground Photo Evidence</option>
                  <option value="Audited Report">Chartered Accountant Audit Report</option>
                  <option value="Completion Certificate">Project Completion Certificate</option>
                </select>
              </div>
            </div>

            {/* Purpose & Amount */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Expenditure Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Purchase of 250 school kits and bags"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Amount Spent in Rupees (₹) *</label>
                <input
                  type="number"
                  required
                  min="100"
                  placeholder="50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {/* File Dropzone */}
            <div className="form-group">
              <label className="form-label">Supporting Evidence File *</label>
              <div style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '2rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
              }}>
                <input
                  type="file"
                  id="evidenceFile"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="evidenceFile" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                  <Upload size={28} color="#22d3ee" />
                  <span style={{ fontSize: '0.95rem', color: '#ffffff', fontWeight: '600' }}>
                    {selectedFile ? selectedFile.name : 'Click to select invoice, bill, photo or report'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    PDF, JPG, PNG, TXT supported (Uploaded directly to IPFS)
                  </span>
                </label>
              </div>
            </div>

            {/* Architectural Explanation */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              fontSize: '0.78rem',
              color: '#a5f3fc',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
            }}>
              <ShieldCheck size={18} color="#22d3ee" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>Evidence Hash Logic:</strong> This submission triggers <em>one</em> initial Keccak-256 hash generation on the backend. The document is pinned to IPFS and the resulting CID + hash are permanently recorded on the blockchain.
              </span>
            </div>

            {errorMessage && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.85rem',
              }}>
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-primary btn-lg"
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              }}
            >
              <Upload size={18} />
              <span>{isUploading ? 'Uploading to IPFS & Computing Hash...' : 'Upload & Anchor to Blockchain'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
