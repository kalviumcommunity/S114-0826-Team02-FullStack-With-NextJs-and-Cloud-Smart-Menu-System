import React from 'react';

export function AuditSummary({ data }) {
  if (!data || !data.summary) return null;

  const { totalLogsCount, actionBreakdown, userActivityBreakdown } = data.summary;

  const maxActionCount = actionBreakdown.length > 0 ? Math.max(...actionBreakdown.map(a => a.count)) : 1;
  const maxUserCount = userActivityBreakdown.length > 0 ? Math.max(...userActivityBreakdown.map(u => u.totalActions)) : 1;

  // Format action text for clean presentation
  const formatActionName = (action) => {
    return action.replace(/_/g, ' ').toLowerCase();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Stat Boxes */}
      <div className="summary-grid">
        <div className="summary-block">
          <div className="summary-block-label">Total Logs</div>
          <div className="summary-block-value">{totalLogsCount}</div>
        </div>
        <div className="summary-block">
          <div className="summary-block-label">Unique Actions</div>
          <div className="summary-block-value">{actionBreakdown.length}</div>
        </div>
        <div className="summary-block">
          <div className="summary-block-label">Active Users</div>
          <div className="summary-block-value">{userActivityBreakdown.length}</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        
        {/* Action Breakdown Panel */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Activity Breakdown by Action Type
          </h3>
          {actionBreakdown.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No logs recorded yet.</p>
          ) : (
            actionBreakdown.map((action) => {
              const pct = (action.count / maxActionCount) * 100;
              return (
                <div key={action._id} className="progress-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.2rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{formatActionName(action._id)}</span>
                    <span style={{ fontWeight: 600 }}>{action.count}</span>
                  </div>
                  <div className="progress-track" style={{ height: '5px', marginTop: '0.15rem' }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User Activity Panel */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 className="form-label" style={{ fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Modifications per Operator
          </h3>
          {userActivityBreakdown.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No operators active yet.</p>
          ) : (
            userActivityBreakdown.map((user) => {
              const pct = (user.totalActions / maxUserCount) * 100;
              return (
                <div key={user._id} className="progress-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '0.2rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {user._id} <span className="role-badge" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>{user.userRole}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>{user.totalActions}</span>
                  </div>
                  <div className="progress-track" style={{ height: '5px', marginTop: '0.15rem' }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
export default AuditSummary;
