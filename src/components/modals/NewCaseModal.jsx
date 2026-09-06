import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export const NewCaseModal = ({ isOpen, onClose, onCreated }) => {
  const [caseTitle, setCaseTitle] = useState('');
  const [caseCode, setCaseCode] = useState(`CASE-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [leadOfficer, setLeadOfficer] = useState('Officer Khare');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    if (onCreated) {
      onCreated({ caseTitle, caseCode, leadOfficer });
    }
    setTimeout(() => {
      setSuccess(false);
      setCaseTitle('');
      onClose();
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Open New Legal Case Record">
      {success ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Case Docket Initialized</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{caseCode} has been logged in custody registry.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Docket Case Code</label>
            <input
              type="text"
              className="form-input no-icon"
              value={caseCode}
              onChange={(e) => setCaseCode(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Case Title / Reference</label>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. Cyber Fraud Investigation - Alpha"
              value={caseTitle}
              onChange={(e) => setCaseTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Assigned Lead Officer</label>
            <input
              type="text"
              className="form-input no-icon"
              value={leadOfficer}
              onChange={(e) => setLeadOfficer(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" block icon={Briefcase}>
            Create Case File
          </Button>
        </form>
      )}
    </Modal>
  );
};

