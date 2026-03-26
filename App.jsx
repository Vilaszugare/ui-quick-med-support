import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Badge } from '@capawesome/capacitor-badge';
import { AnimatePresence } from 'framer-motion';

import Phase10_11 from './MedShift_Phase10_11.jsx';
import Phase12_15 from './MedShift_Phase12_15.jsx';
import Phase16 from './MedShift_Phase16.jsx';
import MedShift from './MedShift.jsx';
import InAppToast from './components/InAppToast.jsx';

// Read the API base from env (mirrors the logic in Phase12_15)
const rawApiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#phase12-15');
  const [foregroundNotification, setForegroundNotification] = useState(null);
  const globalWsRef = useRef(null);
  const wsReconnectRef = useRef(null);
  const wsDestroyedRef = useRef(false);

  // ── Global WebSocket: show toast for messages when NOT in active thread ────
  useEffect(() => {
    wsDestroyedRef.current = false;

    const connectGlobalWs = () => {
      if (wsDestroyedRef.current) return;

      const user = JSON.parse(localStorage.getItem('medshift_user') || 'null');
      if (!user?.id) {
        // User not logged in yet — retry after 5s
        wsReconnectRef.current = setTimeout(connectGlobalWs, 5000);
        return;
      }

      const wsProtocol = API_BASE.startsWith('https') ? 'wss:' : 'ws:';
      const host = API_BASE.replace(/^https?:\/\//, '');
      const wsUrl = `${wsProtocol}//${host}/ws/notifications/${user.id}`;

      const socket = new WebSocket(wsUrl);
      globalWsRef.current = socket;

      socket.onopen = () => console.log('[GlobalWS] Connected for user', user.id);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'notification') {
            // Show toast for push-style notifications
            setForegroundNotification({ title: data.title, body: data.body });
          } else if (data.type === 'new_message' && data.message) {
            // Show toast for messages with sender info
            setForegroundNotification({
              title: '💬 New Message',
              body: data.message.content || 'You have a new message.',
            });
          }

          // Dispatch for child components (inbox refresh, thread append)
          window.dispatchEvent(
            new CustomEvent('medshift-notification-received', {
              detail: { payload: data },
            })
          );
        } catch (e) {
          // ignore malformed frames
        }
      };

      socket.onclose = () => {
        console.log('[GlobalWS] Disconnected — reconnecting in 3s');
        if (!wsDestroyedRef.current) {
          wsReconnectRef.current = setTimeout(connectGlobalWs, 3000);
        }
      };

      socket.onerror = () => socket.close();
    };

    connectGlobalWs();

    return () => {
      wsDestroyedRef.current = true;
      clearTimeout(wsReconnectRef.current);
      globalWsRef.current?.close();
    };
  }, []);

  // ── Hash routing ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);

    // ── Capacitor Push Notifications (native only) ────────────────────────
    if (Capacitor.getPlatform() !== 'web') {
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') PushNotifications.register();
      });

      PushNotifications.addListener('registration', (token) => {
        console.log('Push token:', token.value);
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        setForegroundNotification({
          title: notification.title || 'New Notification',
          body: notification.body || '',
        });
        window.dispatchEvent(
          new CustomEvent('medshift-notification-received', {
            detail: {
              payload: notification.data || notification,
            },
          })
        );
        Badge.set({ count: 1 });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push action performed:', notification);
      });
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderComponent = () => {
    switch (currentRoute) {
      case '#phase10-11': return <Phase10_11 />;
      case '#phase16':    return <Phase16 />;
      case '#medshift':   return <MedShift />;
      case '#phase12-15':
      default:            return <Phase12_15 />;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AnimatePresence>
        {foregroundNotification && (
          <InAppToast
            title={foregroundNotification.title}
            body={foregroundNotification.body}
            onClose={() => setForegroundNotification(null)}
          />
        )}
      </AnimatePresence>
      {renderComponent()}
    </div>
  );
}

