import React from 'react';
import { formatCampaignAmount, calculateProgress } from '../utils/formatters';

export default function CampaignProgress({ raisedAmount, targetAmount, isEth = true, showLabels = true }) {
  const percent = calculateProgress(raisedAmount, targetAmount);

  return (
    <div style={{ width: '100%' }}>
      {showLabels && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '0.45rem',
          fontSize: '0.85rem',
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Raised: </span>
            <strong style={{ color: '#34d399', fontWeight: '700' }}>
              {formatCampaignAmount(raisedAmount, isEth)}
            </strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Goal: </span>
            <span style={{ color: '#f8fafc', fontWeight: '600' }}>
              {formatCampaignAmount(targetAmount, isEth)}
            </span>
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div style={{
        width: '100%',
        height: '8px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: percent >= 100
              ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
              : 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '9999px',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
          }}
        />
      </div>

      {showLabels && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.35rem',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          <span style={{ color: percent >= 100 ? '#34d399' : '#60a5fa', fontWeight: '700' }}>
            {percent}% Funded
          </span>
          {percent >= 100 && (
            <span style={{ color: '#34d399', fontWeight: '600' }}>Goal Met ✓</span>
          )}
        </div>
      )}
    </div>
  );
}
