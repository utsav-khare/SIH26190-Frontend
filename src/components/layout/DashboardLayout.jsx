import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import '../../styles/dashboard.css';

export const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Topbar />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

