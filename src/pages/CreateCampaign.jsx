import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { formatInr } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Calendar,
  IndianRupee,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function CreateCampaign() {
  const navigate = useNavigate();
  const { charityProfile } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState('CHECKING');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Education',
    targetAmount: 500000, // ₹5,00,000 default
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    imageUrl: '',
    location: 'Mumbai, Maharashtra',
    beneficiaryInfo: '250 underprivileged students in municipal schools',
    expectedImpact: 'Supply school kits, textbooks, and provide winter uniforms',
  });

  // Check verification before displaying form
  useEffect(() => {
    async function checkVerification() {
      try {
        const res = await api.getCharityVerification(charityProfile.id || 1);
        if (res.success && res.verificationStatus) {
          setVerificationStatus(res.verificationStatus);
        } else {
          setVerificationStatus(charityProfile.verificationStatus || 'VERIFIED');
        }
      } catch (err) {
        console.warn('Could not check verification:', err);
        setVerificationStatus(charityProfile.verificationStatus || 'VERIFIED');
      }
    }
    checkVerification();
  }, [charityProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (verificationStatus !== 'VERIFIED') {
      setErrorMessage('Only verified charities are permitted to launch campaigns.');
      return;
    }

    if (!formData.title.trim() || formData.targetAmount <= 0) {
      setErrorMessage('Please fill in valid campaign details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Dispatches to POST /api/campaigns
      // Backend handles blockchain CampaignManager.sol createCampaign transaction
      const res = await api.createCampaign({
        ...formData,
        charityId: charityProfile.id,
        charityName: charityProfile.organizationName,
      });

      if (res.success) {
        navigate('/charity/campaigns');
      } else {
        throw new Error(res.message || 'Campaign creation failed.');
      }
    } catch (err) {
      console.error('Failed to create campaign:', err);
      setErrorMessage(err.message || 'Could not deploy campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationStatus === 'CHECKING') {
    return <LoadingSpinner message="Checking charity blockchain verification credentials..." />;
  }

  // If NOT verified, show block screen
  if (verificationStatus === 'PENDING_VERIFICATION') {
    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <AlertTriangle size={48} color="#fbbf24" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
            Verification Pending
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your charity must complete blockchain hash verification before creating campaigns. The system is currently validating your credential hash against the <code>CharityRegistry</code> contract.
          </p>
          <Link to="/charity/verification" className="btn btn-primary">
            <span>Check Verification Page</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'VERIFICATION_FAILED') {
    return (
      <div style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
          <Lock size={48} color="#fb7185" style={{ margin: '0 auto 1.25rem' }} />
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.75rem' }}>
            Campaign Creation Blocked
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Charity verification has failed cryptographic hash checks. Only whitelisted, authenticated organizations can launch public campaigns on LedgerCare.
          </p>
          <Link to="/charity/register" className="btn btn-secondary">
            <span>Re-Register Charity Credentials</span>
          </Link>
        </div>
      </div>
    );
  }

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
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#34d399',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '0.85rem',
        }}>
          <ShieldCheck size={14} />
          <span>Verified Charity: {charityProfile.organizationName} ✓</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
          Create Fundraising Campaign
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
          Deploy an immutable, audited fundraising campaign. The backend relayer submits the campaign parameters directly to <code>CampaignManager.sol</code>.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Campaign Title *</label>
            <input
              type="text"
              required
              name="title"
              placeholder="e.g. Rural Children Education & Digital Literacy Project"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Category & Target Amount in ₹ */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Education">Education & Literacy</option>
                <option value="Healthcare">Healthcare & Medicine</option>
                <option value="Disaster Relief">Disaster Relief & Aid</option>
                <option value="Hunger">Hunger & Food Distribution</option>
                <option value="Women Empowerment">Women & Child Welfare</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Amount in Indian Rupees (₹) *</label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="form-input"
              />
              <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600', marginTop: '0.2rem' }}>
                Goal: {formatInr(formData.targetAmount)}
              </span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                required
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                required
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Location & Image URL */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Beneficiary Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Pune, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Campaign Banner Image URL</label>
              <input
                type="url"
                name="imageUrl"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Campaign Description *</label>
            <textarea
              required
              rows={4}
              name="description"
              placeholder="Explain why these funds are needed and how they will be deployed..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            />
          </div>

          {/* Beneficiary & Impact */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Beneficiary Information</label>
              <textarea
                rows={2}
                name="beneficiaryInfo"
                value={formData.beneficiaryInfo}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Expected Humanitarian Impact</label>
              <textarea
                rows={2}
                name="expectedImpact"
                value={formData.expectedImpact}
                onChange={handleChange}
                className="form-textarea"
              />
            </div>
          </div>

          {/* System Assurance Banner */}
          <div style={{
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.78rem',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}>
            <ShieldCheck size={18} color="#34d399" />
            <span>
              Your campaign will be deployed with strict financial caps and immutable start/end date constraints on Ethereum smart contracts.
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
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            <Sparkles size={18} />
            <span>{isSubmitting ? 'Deploying Campaign to Blockchain...' : 'Deploy Verified Campaign'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
