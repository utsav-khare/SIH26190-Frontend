import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
      <ShieldAlert size={64} color="#f5b726" />
      <h1 style={{ fontSize: '2.5rem', color: '#fff' }}>404 - Section Restricted or Not Found</h1>
      <p style={{ color: '#94a3b8', maxWidth: '460px' }}>
        The requested digital vault sector does not exist or has been classified under higher security clearance.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: '12px' }}>
        <ArrowLeft size={16} /> Return to Homepage
      </Link>
    </div>
  );
};

