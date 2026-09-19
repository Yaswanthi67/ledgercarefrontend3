import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Heart,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  User,
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { role, loginAs } = useAuth();

  const [selectedRole, setSelectedRole] = useState(role || 'donor');
  const [name, setName] = useState('Priya Patel');
  const [email, setEmail] = useState('priya@example.com');

  const handleRoleSelect = (r) => {
    setSelectedRole(r);
    if (r === 'donor') {
      setName('Priya Patel');
      setEmail('priya@example.com');
    } else if (r === 'charity') {
      setName('LedgerCare Demo Charity');
      setEmail('demo@ledgercare.org');
    } else if (r === 'admin') {
      setName('System Auditor');
      setEmail('auditor@ledgercare.org');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginAs(selectedRole, { name, email, phone: '9820098200' });

    if (selectedRole === 'donor') {
      navigate('/dashboard');
    } else if (selectedRole === 'charity') {
      navigate('/charity/dashboard');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div style={{ maxWidth: '540px', margin: '2rem auto 4rem', padding: '0 1rem' }}>
      <div className="card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <Shield size={24} color="#ffffff" />
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.35rem' }}>
            LedgerCare Portal Login
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Choose your portal perspective to navigate and evaluate LedgerCare.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Role Tiles */}
          <div>
            <label className="form-label" style={{ marginBottom: '0.65rem', display: 'block' }}>
              Select Portal Perspective
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleRoleSelect('donor')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '1rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedRole === 'donor'
                    ? '2px solid #3b82f6'
                    : '1px solid var(--border-subtle)',
                  background: selectedRole === 'donor'
                    ? 'rgba(59, 130, 246, 0.18)'
                    : 'rgba(15, 23, 42, 0.6)',
                  color: selectedRole === 'donor' ? '#60a5fa' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Heart size={20} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Donor Hub</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('charity')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '1rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedRole === 'charity'
                    ? '2px solid #10b981'
                    : '1px solid var(--border-subtle)',
                  background: selectedRole === 'charity'
                    ? 'rgba(16, 185, 129, 0.18)'
                    : 'rgba(15, 23, 42, 0.6)',
                  color: selectedRole === 'charity' ? '#34d399' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Building2 size={20} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Charity Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('admin')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '1rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: selectedRole === 'admin'
                    ? '2px solid #a855f7'
                    : '1px solid var(--border-subtle)',
                  background: selectedRole === 'admin'
                    ? 'rgba(168, 85, 247, 0.18)'
                    : 'rgba(15, 23, 42, 0.6)',
                  color: selectedRole === 'admin' ? '#c084fc' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Lock size={20} />
                <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Admin Auditor</span>
              </button>
            </div>
          </div>

          {/* User Fields */}
          <div className="form-group">
            <label className="form-label">Full Name / Organization</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              marginTop: '0.5rem',
            }}
          >
            <span>Enter as {selectedRole.toUpperCase()}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}>
          New non-profit organization?{' '}
          <Link to="/charity/register" style={{ color: '#60a5fa', fontWeight: '600' }}>
            Register as Charity →
          </Link>
        </div>
      </div>
    </div>
  );
}
