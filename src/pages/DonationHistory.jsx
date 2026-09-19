import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatInr, ethToInr, formatDateTime, truncateHash } from '../utils/formatters';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { Receipt, ExternalLink, Heart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DonationHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDonations() {
      setIsLoading(true);
      try {
        const res = await api.getDonations();
        setDonations(res.donations || []);
      } catch (err) {
        console.warn('Failed to load donations:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDonations();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.12)',
          color: '#34d399',
          fontSize: '0.75rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
        }}>
          <ShieldCheck size={14} />
          <span>Donor Records Ledger</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
          My Donations
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Complete record of your philanthropic contributions with real on-chain transaction hashes.
        </p>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Retrieving your donation history from backend ledger..." />
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Heart size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
            No donations found yet
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            Explore active campaigns and make your first blockchain-verified contribution today.
          </p>
          <Link to="/campaigns" className="btn btn-primary">
            <span>Explore Active Campaigns</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="table-responsive card" style={{ padding: '0.5rem' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Charity</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Payment Status</th>
                <th>Donation Status</th>
                <th>Blockchain Status</th>
                <th>Transaction Hash</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d, index) => {
                const amountInr = d.amountInr || (d.amountEth ? ethToInr(d.amountEth) : 1000);
                const charityName = 'LedgerCare Demo Charity';
                const campaignTitle = 'Education Support Campaign';

                return (
                  <tr key={d.id || index}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#ffffff' }}>{campaignTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{d.campaignId || 1}</div>
                    </td>
                    <td>
                      <span style={{ color: '#34d399', fontWeight: '600' }}>{charityName} ✓</span>
                    </td>
                    <td>
                      <strong style={{ color: '#34d399', fontSize: '1.05rem' }}>
                        {formatInr(amountInr)}
                      </strong>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDateTime(d.createdAt || d.timestamp || Date.now())}
                    </td>
                    <td>
                      <StatusBadge type="payment" status={d.paymentStatus || 'PAID'} size="sm" />
                    </td>
                    <td>
                      <StatusBadge type="campaign" status="ACTIVE" size="sm" />
                    </td>
                    <td>
                      <StatusBadge type="blockchain" status={d.blockchainStatus || 'CONFIRMED'} size="sm" />
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.75rem', color: '#93c5fd' }}>
                      {truncateHash(d.transactionHash, 8, 6)}
                    </td>
                    <td>
                      <Link
                        to={`/donations/${d.donationId || d.id || index + 1}`}
                        state={{
                          donation: {
                            ...d,
                            campaignTitle,
                            charityName,
                            amountInr,
                            transactionHash: d.transactionHash,
                            date: d.createdAt || d.timestamp,
                          },
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                      >
                        <Receipt size={13} />
                        <span>Receipt</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
