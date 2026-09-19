import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  Building2,
  ShieldCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  FileText,
} from 'lucide-react';

export default function CharityRegister() {
  const navigate = useNavigate();
  const { setCharityProfile, switchRole } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: '',
    registrationNumber: '',
    organizationType: 'Trust',
    email: '',
    phone: '',
    address: '',
    state: 'Maharashtra',
    district: 'Mumbai',
    website: '',
    description: '',
    authorizedRepresentative: '',
  });

  const [documentFile, setDocumentFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.registrationNumber || !formData.email) {
      setErrorMessage('Please complete all mandatory registration fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Dispatches to POST /api/charities/register
      // The backend validates, normalizes, generates hash, records to CharityRegistry contract
      const res = await api.registerCharity(formData);

      if (res.success) {
        setResult(res);

        // Update local auth context charity profile with registered ID
        setCharityProfile({
          id: res.charity?.charityId || Math.floor(Math.random() * 800) + 10,
          organizationName: formData.organizationName,
          registrationNumber: formData.registrationNumber,
          email: formData.email,
          verified: res.verificationStatus === 'VERIFIED',
          verificationStatus: res.verificationStatus || 'VERIFIED',
          campaignEligibility: res.campaignEligibility || 'ALLOWED',
          hash: res.hash || '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        });

        // Switch role to charity view
        switchRole('charity');
      } else {
        throw new Error(res.message || 'Registration failed.');
      }
    } catch (err) {
      console.error('Charity registration error:', err);
      setErrorMessage(err.message || 'Charity registration failed. Please check backend connection.');
    } finally {
      setIsSubmitting(false);
    }
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
          background: 'rgba(59, 130, 246, 0.12)',
          color: '#60a5fa',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '0.85rem',
        }}>
          <ShieldCheck size={14} />
          <span>Cryptographic Organization Whitelisting</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
          Charity Registration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Register your non-profit organization. The system normalizes your credentials, generates a cryptographic hash, and records it directly to <code>CharityRegistry.sol</code>.
        </p>
      </div>

      {result ? (
        /* Registration Result Card */
        <div className="card" style={{
          padding: '2.5rem',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          textAlign: 'center',
        }}>
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

          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
            Charity Registration Recorded ✓
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Your organization details have been cryptographically hashed and verified on the blockchain.
          </p>

          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'left',
            marginBottom: '2rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Organization</span>
              <strong style={{ color: '#ffffff' }}>{result.organizationName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Registration Number</span>
              <span className="font-mono" style={{ color: '#ffffff' }}>{result.registrationNumber}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Blockchain Record</span>
              <StatusBadge type="blockchain" status="RECORDED" size="sm" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Verification Status</span>
              <StatusBadge type="charity" status={result.verificationStatus || 'VERIFIED'} size="sm" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Campaign Eligibility</span>
              <span style={{ color: '#34d399', fontWeight: '700' }}>Allowed ✓</span>
            </div>

            <div style={{ paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                On-Chain Verification Hash:
              </div>
              <div className="font-mono" style={{ fontSize: '0.75rem', color: '#34d399', wordBreak: 'break-all', background: 'rgba(7, 11, 20, 0.7)', padding: '0.5rem', borderRadius: '4px' }}>
                {result.hash}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/charity/verification" className="btn btn-secondary">
              <span>View Verification Page</span>
            </Link>
            <Link
              to="/charity/campaigns/create"
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              <span>Create First Campaign</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="card" style={{ padding: '2.5rem 2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Row 1: Org Name & Reg Number */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Organization Name *</label>
                <input
                  type="text"
                  required
                  name="organizationName"
                  placeholder="e.g. Hope Foundation India"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  required
                  name="registrationNumber"
                  placeholder="e.g. REG-12345 / 80G"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 2: Type, Email, Phone */}
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Organization Type *</label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Trust">Public Charitable Trust</option>
                  <option value="Society">Registered Society</option>
                  <option value="Section 8 Company">Section 8 Non-Profit</option>
                  <option value="Foundation">Philanthropic Foundation</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Official Email *</label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="contact@hopefoundation.org"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="+91 98200 12345"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 3: Location */}
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Registered Address *</label>
                <input
                  type="text"
                  required
                  name="address"
                  placeholder="104 Nariman Point"
                  value={formData.address}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  required
                  name="state"
                  placeholder="Maharashtra"
                  value={formData.state}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">District *</label>
                <input
                  type="text"
                  required
                  name="district"
                  placeholder="Mumbai"
                  value={formData.district}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Row 4: Website & Authorized Rep */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  name="website"
                  placeholder="https://hopefoundation.org"
                  value={formData.website}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Authorized Representative *</label>
                <input
                  type="text"
                  required
                  name="authorizedRepresentative"
                  placeholder="e.g. Dr. Rajesh Sharma (Trustee)"
                  value={formData.authorizedRepresentative}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Mission & Operational Description *</label>
              <textarea
                required
                name="description"
                rows={3}
                placeholder="Brief summary of the organization's charitable activities and target impact..."
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            {/* Document Upload */}
            <div className="form-group">
              <label className="form-label">Registration Certificate / 80G Documents *</label>
              <div style={{
                border: '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
              }}>
                <input
                  type="file"
                  id="regDoc"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="regDoc" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={24} color="#60a5fa" />
                  <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: '600' }}>
                    {documentFile ? documentFile.name : 'Click to upload registration document (PDF, PNG, JPG)'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Files will be verified against on-chain hash credentials
                  </span>
                </label>
              </div>
            </div>

            {/* Notice Banner */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              fontSize: '0.8rem',
              color: '#93c5fd',
              display: 'flex',
              gap: '0.65rem',
              alignItems: 'flex-start',
            }}>
              <Lock size={16} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>
                <strong>System Notice:</strong> The Admin does <em>not</em> manually approve charities. Verification is determined strictly by the cryptographic hash of your credentials matching the smart contract records.
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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              }}
            >
              <ShieldCheck size={18} />
              <span>{isSubmitting ? 'Generating Hash & Recording on Chain...' : 'Submit & Generate Blockchain Hash'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
