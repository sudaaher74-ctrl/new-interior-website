import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = window.API_CONFIG?.BASE_URL || '/api';

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/v2/notifications/my`, { headers });
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      // Quiet fail on polling
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // 20s polling
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_URL}/v2/notifications/read/${id}`, {}, { headers });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`${API_URL}/v2/notifications/read-all`, {}, { headers });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      setIsOpen(false);
      navigate(notif.link);
    }
  };

  const getNotifIcon = (type) => {
    if (!type) return '🔔';
    if (type.includes('leave_approved')) return '✅';
    if (type.includes('leave_rejected')) return '❌';
    if (type.includes('leave')) return '🏖️';
    if (type.includes('expense_approved')) return '💰';
    if (type.includes('expense_rejected')) return '❌';
    if (type.includes('expense')) return '💵';
    if (type.includes('site_visit')) return '📍';
    return '🔔';
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div style={{ position: 'relative', zIndex: 1000 }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(203, 213, 225, 0.8)',
          borderRadius: '12px',
          padding: '8px 12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontSize: '1.2rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        }}
        title="Notifications"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              lineHeight: 1,
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.5)',
              animation: 'pulse 2s infinite'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0',
            zIndex: 999999,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              background: '#0f172a',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '-0.2px' }}>Notifications</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontWeight: '700'
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#93c5fd',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div
            style={{
              maxHeight: '380px',
              overflowY: 'auto'
            }}
          >
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#94a3b8' }}>
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>🔕</div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>No notifications yet</div>
                <div style={{ fontSize: '0.78rem', marginTop: '2px' }}>We'll notify you on leave & expense updates</div>
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.is_read;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isUnread ? 'rgba(59, 130, 246, 0.06)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = isUnread ? 'rgba(59, 130, 246, 0.1)' : '#f8fafc';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = isUnread ? 'rgba(59, 130, 246, 0.06)' : '#ffffff';
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.25rem',
                        lineHeight: 1,
                        paddingTop: '2px'
                      }}
                    >
                      {getNotifIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: '#0f172a',
                          fontWeight: isUnread ? '600' : '400',
                          lineHeight: 1.4
                        }}
                      >
                        {notif.message}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          marginTop: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span style={{ fontWeight: '500' }}>{formatTime(notif.created_at)}</span>
                        {isUnread && (
                          <span
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              backgroundColor: '#3b82f6',
                              display: 'inline-block'
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
