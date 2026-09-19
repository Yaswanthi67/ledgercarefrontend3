import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { formatInr, ethToInr, formatDateTime, formatDate, truncateHash } from '../utils/formatters';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Activity,
  ShieldCheck,
  Building2,
  PlusCircle,
  Heart,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export default function TransparencyTimeline() {
  const { campaignId } = useParams();
  const targetId = campaignId || '1';

  const [timelineData, setTimelineData] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      setIsLoading(true);
      try {
        const [timeRes, campRes] = await Promise.all([
          api.getTransparencyTimeline(targetId),
          api.getCampaign(targetId).catch(() => null),
        ]);

        setTimelineData(timeRes?.timeline || []);
        if (campRes?.campaign) {
          setCampaign(campRes.campaign);
        }
      } catch (err) {
        console.warn('Error fetching transparency timeline:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTimeline();
  }, [targetId]);

  if (isLoading) {
    return <LoadingSpinner message="Aggregating blockchain events and IPFS audit logs..." />;
  }

  return (
    <div style={{ maxWidth: '820px', margin: '1rem auto 3rem', padding: '0 1rem' }}>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/campaigns/${targetId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Campaign #{targetId}</span>
        </Link>
      </div>

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
          <Activity size={14} />
          <span>Full Public Audit Trail</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' }}>
          Transparency Timeline
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          End-to-end chronological verification log for {campaign?.title || `Campaign #${targetId}`}.
        </p>
      </div>

      {/* Timeline Stream */}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Glowing Timeline Line */}
        <div style={{
          position: 'absolute',
          top: '15px',
          bottom: '15px',
          left: '12px',
          width: '2px',
          background: 'linear-gradient(180deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
          opacity: 0.4,
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {timelineData.map((event, idx) => (
            <div key={event.id || idx} style={{ position: 'relative' }}>
              {/* Event Circle Dot */}
              <div style={{
                position: 'absolute',
                left: '-2rem',
                top: '0',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#0f172a',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                zIndex: 2,
              }}>
                <CheckCircle2 size={14} color="#34d399" />
              </div>

              {/* Event Card */}
              <div className="card" style={{ padding: '1.25rem 1.5rem', background: 'rgba(15, 23, 42, 0.75)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#ffffff' }}>
                      {event.title}
                    </h3>
                    {event.idRef && (
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: '#60a5fa' }}>
                        {event.idRef}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StatusBadge type="blockchain" status={event.status || 'CONFIRMED'} size="sm" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatDateTime(event.timestamp)}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {event.description}
                </p>

                {/* Cryptographic Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
                  {event.hash && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 11, 20, 0.7)', padding: '0.4rem 0.65rem', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Keccak-256 Hash:</span>
                      <span className="font-mono" style={{ color: '#34d399', wordBreak: 'break-all' }}>{event.hash}</span>
                    </div>
                  )}

                  {event.cid && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 11, 20, 0.7)', padding: '0.4rem 0.65rem', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>IPFS CID:</span>
                      <span className="font-mono" style={{ color: '#60a5fa', wordBreak: 'break-all' }}>{event.cid}</span>
                    </div>
                  )}

                  {event.txHash && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(7, 11, 20, 0.7)', padding: '0.4rem 0.65rem', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Transaction Hash:</span>
                      <span className="font-mono" style={{ color: '#93c5fd', wordBreak: 'break-all' }}>{event.txHash}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
