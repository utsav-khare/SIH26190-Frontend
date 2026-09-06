import React from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Lock, Award, Users } from 'lucide-react';

export const AboutModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="About Digilegal Vault" maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#94a3b8', fontSize: '0.925rem' }}>
        <p>
          <strong style={{ color: '#f8fafc' }}>Digilegal Vault</strong> is built under Problem Statement <strong style={{ color: '#f5b726' }}>SIH26190</strong> to solve critical digital chain-of-custody, document security, and access control challenges faced by law enforcement, legal authorities, and judiciary workflows.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
          <div style={{ padding: '12px', background: '#0b1525', border: '1px solid #17273f', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f5b726', fontWeight: '700', marginBottom: '4px' }}>
              <ShieldCheck size={18} />
              <span>Chain of Custody</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cryptographic verification of FIRs, evidence logs, and forensic artifacts.</p>
          </div>

          <div style={{ padding: '12px', background: '#0b1525', border: '1px solid #17273f', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f5b726', fontWeight: '700', marginBottom: '4px' }}>
              <Lock size={18} />
              <span>Granular RBAC</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Strict permission boundaries between Officers, Prosecutors, and Admins.</p>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', borderTop: '1px solid #17273f', paddingTop: '12px', color: '#64748b' }}>
          National e-Governance & Smart India Hackathon 2026 Initiative.
        </p>
      </div>
    </Modal>
  );
};

