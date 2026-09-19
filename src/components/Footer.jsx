import React, { useState } from 'react';
import { truncateHash } from '../utils/formatters';
import { Shield, Copy, Check, Activity, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONTRACTS = {
  CharityRegistry: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  CampaignManager: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
  DonationLedger: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  FundEvidenceTracker: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
};

export default function Footer() {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <footer style={{
      background: '#060a12',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 1.5rem 2rem',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '2.5rem',
        marginBottom: '2.5rem',
      }}>
        {/* Brand & Mission */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={18} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
              Ledger<span style={{ color: '#10b981' }}>Care</span>
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            LedgerCare is a blockchain-based transparent charity management system. Every charity is cryptographically verified, every ₹ donation is recorded immutably on smart contracts, and fund usage is backed by IPFS evidence.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.75rem',
            color: '#34d399',
          }}>
            <Activity size={14} />
            <span>Backend Relayer: Online (Port 5000)</span>
          </div>
        </div>

        {/* Quick Navigation */}
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '1rem' }}>
            Platform Portals
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem' }}>
            <li>
              <Link to="/campaigns" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}>
                Explore All Campaigns
              </Link>
            </li>
            <li>
              <Link to="/charities" style={{ color: 'var(--text-secondary)' }}>
                Verified Charities Directory
              </Link>
            </li>
            <li>
              <Link to="/charity/register" style={{ color: 'var(--text-secondary)' }}>
                Register as Charity
              </Link>
            </li>
            <li>
              <Link to="/charity/verification" style={{ color: 'var(--text-secondary)' }}>
                Charity Verification Status
              </Link>
            </li>
            <li>
              <Link to="/transparency/blockchain" style={{ color: 'var(--text-secondary)' }}>
                Blockchain Audit Records
              </Link>
            </li>
            <li>
              <Link to="/admin" style={{ color: 'var(--text-secondary)' }}>
                System Monitoring Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Verified Smart Contracts */}
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '1rem' }}>
            Deployed Smart Contracts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {Object.entries(CONTRACTS).map(([name, addr]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#e2e8f0' }}>{name}</div>
                  <div className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    {truncateHash(addr, 8, 6)}
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(addr, name)}
                  title="Copy Address"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: copiedKey === name ? '#34d399' : 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                  }}
                >
                  {copiedKey === name ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Disclosures */}
        <div>
          <h4 style={{ fontSize: '0.88rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffffff', marginBottom: '1rem' }}>
            Transparent Architecture
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            LedgerCare connects to existing smart contracts via the secure backend relayer.
          </p>
          <ul style={{ listStyle: 'none', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>✓ No crypto wallet needed for donors</li>
            <li>✓ All donations in Indian Rupees (₹)</li>
            <li>✓ Automatic hash verification (No admin approval)</li>
            <li>✓ IPFS tamper-evident evidence storage</li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
      }}>
        <div>
          © {new Date().getFullYear()} LedgerCare. Final-Year Blockchain Project. All rights reserved.
        </div>
        <div>
          Source Repository:{' '}
          <a
            href="https://github.com/Yaswanthi67/LedgerCareBlockchain"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#60a5fa', textDecoration: 'underline' }}
          >
            LedgerCareBlockchain
          </a>
        </div>
      </div>
    </footer>
  );
}
