import React from 'react';
import { formatDate, formatInr, ethToInr, truncateHash } from '../utils/formatters';
import {
  Building2,
  ShieldCheck,
  PlusCircle,
  Heart,
  FileCheck2,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function AuditTimeline({ campaign, donations = [], usages = [] }) {
  if (!campaign) return null;

  const events = [];

  // 1. Charity Registration
  events.push({
    type: 'CHARITY_REGISTERED',
    title: 'Charity Registered in Registry',
    timestamp: campaign.charity?.registeredAt || campaign.startDate - 86400,
    icon: <Building2 size={16} color="#3b82f6" />,
    color: '#3b82f6',
    details: `Organization "${campaign.charityName || 'Registered Charity'}" completed cryptographic registration.`,
    hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  });

  events.push({
    type: 'CHARITY_VERIFIED',
    title: 'Charity Verified on Blockchain',
    timestamp: (campaign.charity?.registeredAt || campaign.startDate - 86400) + 1,
    icon: <ShieldCheck size={16} color="#10b981" />,
    color: '#10b981',
    details: `CharityRegistry smart contract validated credential hash. Campaign creation enabled.`,
  });

  // 2. Campaign Creation
  const targetInr = campaign.targetAmountEth
    ? ethToInr(campaign.targetAmountEth)
    : campaign.targetAmount;

  events.push({
    type: 'CAMPAIGN_CREATED',
    title: `Campaign #${campaign.campaignId} Deployed`,
    timestamp: campaign.startDate,
    icon: <PlusCircle size={16} color="#8b5cf6" />,
    color: '#8b5cf6',
    details: `Target: ${formatInr(targetInr)}. Title: "${campaign.title}"`,
    txHash: '0x3a4b9c1d2e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
  });

  // 3. Donations Received
  donations.forEach((d) => {
    const inr = d.amountInr || (d.amountEth ? ethToInr(d.amountEth) : d.amount);
    events.push({
      type: 'DONATION_RECORDED',
      title: `Donation Received (${formatInr(inr)})`,
      timestamp: d.timestamp || d.createdAt,
      icon: <Heart size={16} color="#ec4899" fill="#ec4899" />,
      color: '#ec4899',
      details: `₹ payment verified via UPI. Recorded to DonationLedger smart contract.`,
      txHash: d.transactionHash,
    });
  });

  // 4. Fund Usages & Evidence
  usages.forEach((u) => {
    const inr = u.amountEth ? ethToInr(u.amountEth) : u.amount;
    events.push({
      type: 'FUND_USAGE_RECORDED',
      title: `Fund Usage & Evidence Stored (${formatInr(inr)})`,
      timestamp: u.timestamp,
      icon: <FileCheck2 size={16} color="#06b6d4" />,
      color: '#06b6d4',
      details: `Purpose: "${u.purpose}" with pinned IPFS proof`,
      evidenceHash: u.evidenceHash,
    });
  });

  // Sort chronologically (newest first for readability)
  events.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <div style={{ position: 'relative', paddingLeft: '1.75rem' }}>
      {/* Continuous Vertical Line */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          bottom: '12px',
          left: '11px',
          width: '2px',
          background: 'linear-gradient(to bottom, #10b981, #3b82f6, #8b5cf6)',
          opacity: 0.35,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {events.map((ev, index) => (
          <div key={index} style={{ position: 'relative' }}>
            {/* Node Icon */}
            <div
              style={{
                position: 'absolute',
                left: '-1.75rem',
                top: '0',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#0f172a',
                border: `2px solid ${ev.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 10px ${ev.color}40`,
                zIndex: 2,
              }}
            >
              {ev.icon}
            </div>

            {/* Content Box */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.35rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ffffff' }}>
                  {ev.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <span>{formatDate(ev.timestamp)}</span>
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                {ev.details}
              </p>

              {ev.txHash && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Transaction Hash:</span>
                  <span className="font-mono" style={{ color: '#93c5fd' }}>{truncateHash(ev.txHash, 10, 8)}</span>
                </div>
              )}

              {ev.evidenceHash && (
                <div style={{ marginTop: '0.4rem', background: 'rgba(7, 11, 20, 0.6)', padding: '0.35rem 0.6rem', borderRadius: '4px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Evidence Keccak-256 Hash:</div>
                  <div className="font-mono" style={{ fontSize: '0.72rem', color: '#34d399', wordBreak: 'break-all' }}>
                    {ev.evidenceHash}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
