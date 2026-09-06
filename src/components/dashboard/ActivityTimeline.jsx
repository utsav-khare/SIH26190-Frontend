import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Upload,
  Eye,
  CheckCircle,
  UserCheck,
  Lock,
  ArrowRight
} from 'lucide-react';

const ICON_MAP = {
  Upload: Upload,
  Eye: Eye,
  CheckCircle: CheckCircle,
  UserCheck: UserCheck,
  Lock: Lock
};

export const ActivityTimeline = ({ activities = [] }) => {
  return (
    <div className="section-box">
      <div className="section-box-header">
        <div className="section-box-title">
          <TrendingUp size={18} color="var(--accent-gold)" />
          <span>Recent Activity</span>
        </div>
        <Link to="/audit-log" className="section-box-viewall">
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="activity-timeline">
        {activities.map((item) => {
          const IconComponent = ICON_MAP[item.icon] || TrendingUp;
          return (
            <div key={item.id} className="activity-item">
              <div className={`activity-icon-node icon-node-${item.iconType}`}>
                <IconComponent size={15} />
              </div>
              <div className="activity-text">
                <div className="activity-title">{item.action}</div>
                <div className="activity-target">{item.target}</div>
              </div>
              <div className="activity-time">
                <div>{item.date}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

