import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, CheckSquare, Users } from 'lucide-react';
import { SecurityBanner } from '../components/dashboard/SecurityBanner';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentDocuments } from '../components/dashboard/RecentDocuments';
import { ActivityTimeline } from '../components/dashboard/ActivityTimeline';
import { QuickActionGrid } from '../components/dashboard/QuickActionGrid';
import { UploadModal } from '../components/modals/UploadModal';
import { NewCaseModal } from '../components/modals/NewCaseModal';
import { useModal } from '../hooks/useModal';
import { documentService } from '../services/documentService';
import { MOCK_METRICS, MOCK_RECENT_ACTIVITY } from '../utils/constants';

export const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [activities, setActivities] = useState(MOCK_RECENT_ACTIVITY);

  const { isOpen: isUploadOpen, openModal: openUpload, closeModal: closeUpload } = useModal();
  const { isOpen: isNewCaseOpen, openModal: openNewCase, closeModal: closeNewCase } = useModal();

  useEffect(() => {
    const loadData = async () => {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    };
    loadData();
  }, []);

  const handleDocumentUploaded = (newDoc) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setMetrics((prev) => ({ ...prev, documents: prev.documents + 1 }));
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        action: 'Document uploaded',
        target: newDoc.name,
        date: newDoc.date,
        time: newDoc.time,
        iconType: 'blue',
        icon: 'Upload'
      },
      ...prev
    ]);
  };

  const handleCaseCreated = (caseData) => {
    setMetrics((prev) => ({ ...prev, activeCases: prev.activeCases + 1 }));
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        action: 'New case docket initialized',
        target: caseData.caseCode,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        iconType: 'gold',
        icon: 'Eye'
      },
      ...prev
    ]);
  };

  return (
    <>
      {/* 1. Security & Welcome Banner */}
      <SecurityBanner />

      {/* 2. Four Metric Stats Grid */}
      <div className="metrics-grid">
        <StatCard
          title="Active Cases"
          count={metrics.activeCases}
          linkText="View all cases"
          linkTo="/cases"
          icon={Briefcase}
        />
        <StatCard
          title="Documents"
          count={metrics.documents}
          linkText="View all documents"
          linkTo="/documents"
          icon={FileText}
        />
        <StatCard
          title="Pending Approvals"
          count={metrics.pendingApprovals}
          linkText="Review now"
          linkTo="/approvals"
          icon={CheckSquare}
        />
        <StatCard
          title="Total Users"
          count={metrics.totalUsers}
          linkText="Manage users"
          linkTo="/settings"
          icon={Users}
        />
      </div>

      {/* 3. Recent Documents & Activity Grid */}
      <div className="dashboard-grid-2col">
        <RecentDocuments documents={documents.slice(0, 5)} />
        <ActivityTimeline activities={activities.slice(0, 5)} />
      </div>

      {/* 4. Bottom Quick Actions Bar */}
      <QuickActionGrid
        onOpenUpload={openUpload}
        onOpenNewCase={openNewCase}
      />

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={closeUpload}
        onUploaded={handleDocumentUploaded}
      />
      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={closeNewCase}
        onCreated={handleCaseCreated}
      />
    </>
  );
};

