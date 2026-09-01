import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { auditService } from '../services/auditService';
import AuditSummary from '../components/AuditSummary';

export function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  
  // Filter state
  const [selectedAction, setSelectedAction] = useState('All');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAuditData = async () => {
    try {
      const summary = await auditService.getAuditSummary();
      setSummaryData(summary);

      const params = selectedAction !== 'All' ? { action: selectedAction } : {};
      const logData = await auditService.getAuditLogs(params);
      setLogs(logData.logs);
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditData();
  }, [selectedAction]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'CREATE_MENU_ITEM': return 'alert-info';
      case 'UPDATE_MENU_ITEM': return 'alert-warning';
      case 'DELETE_MENU_ITEM': return 'alert-error';
      case 'RESTOCK_INVENTORY': return 'alert-success';
      case 'UPDATE_PRICING': return 'alert-info';
      default: return '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="container page">
        <div className="page-header">
          <div>
            <h1 className="page-title">System Audit Logs</h1>
            <p className="page-subtitle">Track modifications, status changes, and configurations made to the menu system.</p>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

        {loading ? (
          <div className="spinner">
            <div className="spin"></div>
            <span className="loading-text">&nbsp;Loading audit logs...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* MongoDB Aggregation Summary Component */}
            {summaryData && <AuditSummary data={summaryData} />}

            {/* Logs List Section */}
            <div>
              <div className="page-header" style={{ margin: 0, paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
                <h2 style={{ fontSelf: 'start', fontSize: '0.95rem', fontWeight: 600 }}>Modification History</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter Action:</span>
                  <select
                    className="form-control"
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: '180px' }}
                  >
                    <option value="All">All Actions</option>
                    <option value="CREATE_MENU_ITEM">CREATE_MENU_ITEM</option>
                    <option value="UPDATE_MENU_ITEM">UPDATE_MENU_ITEM</option>
                    <option value="DELETE_MENU_ITEM">DELETE_MENU_ITEM</option>
                    <option value="RESTOCK_INVENTORY">RESTOCK_INVENTORY</option>
                    <option value="UPDATE_PRICING">UPDATE_PRICING</option>
                  </select>
                </div>
              </div>

              {logs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-muted)' }}>
                  No audit log records match the chosen filter.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {logs.map((log) => (
                    <div key={log._id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            className="role-badge"
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.45rem',
                              background: 'var(--bg)',
                              border: '1px solid var(--border)',
                              color: 'var(--text)'
                            }}
                          >
                            {log.action}
                          </span>
                          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                            {log.userEmail} <span className="role-badge" style={{ fontSize: '0.55rem', padding: '0.05rem 0.25rem' }}>{log.userRole}</span>
                          </span>
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{formatDate(log.timestamp)}</span>
                      </div>
                      
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span>Target: <strong>{log.targetId}</strong></span>
                        {log.details?.previousValues && (
                          <span>
                            | Modified fields: <strong>
                              {Object.keys(log.details.previousValues).join(', ')}
                            </strong>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </>
  );
}
export default AuditLogPage;
