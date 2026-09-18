import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { fetchAllCampaigns, fetchCampaignDonations } from '../services/blockchain';
import api from '../services/api';
import { formatEth, formatDate, shortenAddress, getExplorerAddressLink } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, Search, Filter, ExternalLink, RefreshCw, Smartphone, ShieldCheck, Check, Copy } from 'lucide-react';

export default function DonationHistory() {
  const { activeProvider } = useWallet();

  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState(null);

  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const loadGlobalDonations = async () => {
    setIsLoading(true);
    try {
      let allDons = [];

      // 1. First attempt to load via Backend API
      try {
        const campRes = await api.getCampaigns();
        if (campRes && campRes.campaigns) {
          for (const camp of campRes.campaigns) {
            try {
              const dRes = await api.getCampaignDonations(camp.campaignId);
              if (dRes && dRes.donations) {
                dRes.donations.forEach((d) => {
                  allDons.push({
                    ...d,
                    campaignTitle: camp.title,
                    charityName: camp.charityName,
                  });
                });
              }
            } catch {}
          }
        }
      } catch (backendErr) {
        console.warn('Backend donation fetch fallback to blockchain provider:', backendErr);
        if (activeProvider) {
          const allCampaigns = await fetchAllCampaigns(activeProvider);
          for (const camp of allCampaigns) {
            const cDons = await fetchCampaignDonations(camp.campaignId, activeProvider);
            cDons.forEach((d) => {
              allDons.push({
                ...d,
                campaignTitle: camp.title,
                charityName: camp.charityName,
              });
            });
          }
        }
      }

      // Sort newest first
      allDons.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      setDonations(allDons);
    } catch (err) {
      console.error('Error loading global donations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGlobalDonations();
  }, [activeProvider]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDonations(donations);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredDonations(
      donations.filter(
        (d) =>
          (d.donor && d.donor.toLowerCase().includes(q)) ||
          (d.donorName && d.donorName.toLowerCase().includes(q)) ||
          (d.campaignTitle && d.campaignTitle.toLowerCase().includes(q)) ||
          d.donationId.toString().includes(q)
      )
    );
  }, [donations, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff' }}>
              Public Donation Ledger
            </h1>
            <span className="badge badge-verified" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              UPI & Blockchain Verified
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Transparent UPI payments converted and sealed permanently on Ethereum in <code>DonationLedger.sol</code>.
          </p>
        </div>

        <button onClick={loadGlobalDonations} className="btn btn-secondary">
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search filter */}
      <div className="card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Filter by donor name, donor address, campaign title, or donation ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {isLoading ? (
          <LoadingSpinner message="Querying DonationLedger records and verified payments..." />
        ) : filteredDonations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No donations recorded yet on this network.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Campaign</th>
                  <th>Donation Amount</th>
                  <th>Donor</th>
                  <th>Payment (UPI)</th>
                  <th>Blockchain Status</th>
                  <th>Date Recorded</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((d) => (
                  <tr key={`${d.campaignId}-${d.donationId}`}>
                    <td style={{ fontWeight: '600' }}>#{d.donationId}</td>
                    <td>
                      <Link
                        to={`/campaign/${d.campaignId}`}
                        style={{ color: '#60a5fa', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        {d.campaignTitle} (#{d.campaignId})
                      </Link>
                    </td>
                    <td>
                      {d.amountInr && (
                        <div style={{ fontWeight: '800', color: '#34d399', fontSize: '1rem' }}>
                          ₹{d.amountInr.toLocaleString('en-IN')} INR
                        </div>
                      )}
                      <div style={{ fontSize: '0.78rem', color: d.amountInr ? '#94a3b8' : '#34d399', fontWeight: '600' }}>
                        {formatEth(d.amount)} ETH
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#ffffff' }}>
                        {d.donorName || 'Direct Donor'}
                      </div>
                      <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Relayer: {shortenAddress(d.donor)}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-verified" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                        {d.paymentStatus || 'PAID'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span className="badge badge-verified">
                          {d.blockchainStatus || 'CONFIRMED'}
                        </span>
                      </div>
                    </td>
                    <td>{formatDate(d.timestamp)}</td>
                    <td>
                      <Link to={`/campaign/${d.campaignId}`} className="btn btn-secondary btn-sm">
                        View Audit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
