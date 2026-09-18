import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { fetchAllCampaigns } from '../services/blockchain';
import { useWallet } from '../context/WalletContext';
import { formatEth, formatDate, shortenAddress } from '../utils/formatters';
import CampaignCard from '../components/CampaignCard';
import DonationModal from '../components/DonationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Heart,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Building2,
  Smartphone,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function DonorDashboard() {
  const { activeProvider } = useWallet();

  const [emailSearch, setEmailSearch] = useState('');
  const [donations, setDonations] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState(null);
  const [stats, setStats] = useState({
    totalDonatedInr: 0,
    totalDonatedEth: '0',
    campaignsCount: 0,
    totalCount: 0,
  });

  const loadDonorData = async (emailFilter = '') => {
    setIsLoading(true);
    try {
      // 1. Fetch campaigns
      let campaigns = [];
      try {
        const campRes = await api.getCampaigns();
        if (campRes && campRes.campaigns) campaigns = campRes.campaigns;
      } catch {
        if (activeProvider) campaigns = await fetchAllCampaigns(activeProvider);
      }
      setActiveCampaigns(campaigns.filter((c) => c.status === 0).slice(0, 3));

      // 2. Fetch donations from backend DB
      const query = emailFilter ? { donorEmail: emailFilter } : {};
      const donRes = await api.getDonations(query);
      const list = donRes && donRes.donations ? donRes.donations : [];
      setDonations(list);

      // Compute statistics
      let inrSum = 0;
      let ethSum = 0;
      const cIds = new Set();

      list.forEach((d) => {
        if (d.amountInr) inrSum += Number(d.amountInr);
        if (d.amountEth) ethSum += Number(d.amountEth);
        cIds.add(d.campaignId);
      });

      setStats({
        totalDonatedInr: inrSum,
        totalDonatedEth: ethSum.toFixed(4),
        campaignsCount: cIds.size,
        totalCount: list.length,
      });
    } catch (err) {
      console.error('Error loading donor dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonorData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDonorData(emailSearch.trim());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff' }}>
              Donor Hub
            </h1>
            <span
              className="badge badge-verified"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '0.75rem' }}
            >
              Zero Wallet Required
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Track your UPI contributions, monitor fund usage, and inspect immutable smart-contract records.
          </p>
        </div>

        <button onClick={() => loadDonorData(emailSearch)} className="btn btn-secondary" title="Refresh">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399',
            }}
          >
            <Smartphone size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Donated (UPI)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399' }}>
              ₹{stats.totalDonatedInr.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              ≈ {stats.totalDonatedEth} ETH Sealed
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#60a5fa',
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campaigns Backed</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>
              {stats.campaignsCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>Verified Causes</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ec4899',
            }}
          >
            <Heart size={24} fill="currentColor" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Contributions</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#ffffff' }}>
              {stats.totalCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399' }}>Confirmed on Blockchain</div>
          </div>
        </div>
      </div>

      {/* Lookup by Email */}
      <div className="card" style={{ padding: '1.25rem 1.5rem' }}>
        <form onSubmit={handleSearchSubmit}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                placeholder="Search donations by your donor email (e.g. aarav@example.com)..."
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                className="form-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Filter Receipts
            </button>
            {emailSearch && (
              <button
                type="button"
                onClick={() => {
                  setEmailSearch('');
                  loadDonorData('');
                }}
                className="btn btn-secondary"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Donation Records */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '1.25rem' }}>
          {emailSearch ? `Donations for ${emailSearch}` : 'Recent Verified Contributions'}
        </h3>

        {isLoading ? (
          <LoadingSpinner message="Querying verified UPI payments and smart-contract ledger..." />
        ) : donations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {emailSearch
                ? `No donations found matching "${emailSearch}".`
                : 'No donations recorded yet. Be the first to back a transparent charity campaign!'}
            </p>
            <Link to="/campaigns" className="btn btn-primary">
              Explore Active Campaigns
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Campaign</th>
                  <th>Amount (₹ INR)</th>
                  <th>On-Chain Value</th>
                  <th>Payment</th>
                  <th>Blockchain Status</th>
                  <th>Transaction Hash</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id || d.orderId}>
                    <td className="font-mono" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {d.orderId}
                    </td>
                    <td>
                      <Link
                        to={`/campaign/${d.campaignId}`}
                        style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        Campaign #{d.campaignId}
                      </Link>
                    </td>
                    <td style={{ fontWeight: '800', color: '#34d399' }}>
                      ₹{Number(d.amountInr).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: '600', color: '#e2e8f0' }}>
                      {d.amountEth} ETH
                    </td>
                    <td>
                      <span className="badge badge-verified" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                        {d.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-verified">
                        {d.blockchainStatus}
                      </span>
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                      {d.transactionHash ? shortenAddress(d.transactionHash) : 'Pending...'}
                    </td>
                    <td>
                      <Link to={`/campaign/${d.campaignId}`} className="btn btn-secondary btn-sm">
                        Audit Trail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suggested Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
              Active Campaigns to Support
            </h3>
            <Link to="/campaigns" style={{ color: '#60a5fa', fontSize: '0.85rem' }}>
              View All Campaigns
            </Link>
          </div>

          <div className="grid-3">
            {activeCampaigns.map((camp) => (
              <CampaignCard
                key={camp.campaignId}
                campaign={camp}
                onDonateClick={(c) => setSelectedCampaignForDonation(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* UPI Donation Modal */}
      {selectedCampaignForDonation && (
        <DonationModal
          campaign={selectedCampaignForDonation}
          isOpen={true}
          onClose={() => setSelectedCampaignForDonation(null)}
          onDonationSuccess={() => loadDonorData(emailSearch)}
        />
      )}
    </div>
  );
}
