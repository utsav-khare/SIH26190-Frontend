import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Mail, Send, CheckCircle2 } from 'lucide-react';

export const ContactModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Contact Legal Support">
      {submitted ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Message Dispatched</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>The designated department supervisor has been alerted.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Direct inquiry to the Digilegal Security Operations Centre (SIH26190).
          </p>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Official Email</label>
            <input
              type="email"
              className="form-input no-icon"
              placeholder="officer@department.gov"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Inquiry / Dispatch Note</label>
            <textarea
              className="form-textarea no-icon"
              rows={4}
              placeholder="Specify case reference or clearance issue..."
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" variant="primary" block icon={Send}>
            Submit Inquiry
          </Button>
        </form>
      )}
    </Modal>
  );
};

