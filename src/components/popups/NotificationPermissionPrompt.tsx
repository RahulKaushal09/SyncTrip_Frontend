'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import apiClient from '@/utils/apiClient';
import { requestFcmToken, requestNotificationPermissionOnly } from '@/utils/firebaseClient';

export default function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    async function checkPermission() {
      if (Notification.permission === 'granted') {
        // Optionally auto-register token if already granted
        const token = await requestFcmToken();
        if (token) {
          try {
            await apiClient.post('/user/fcm-token', { token });
          } catch (err) {
            console.error('Failed to save existing FCM token', err);
          }
        }
        return;
      }

      const dismissed = localStorage.getItem('synctrip_notif_dismissed');
      if (dismissed) return;

      setShowPrompt(true);
    }

    checkPermission();
  }, []);

  async function handleEnable() {
    setShowPrompt(false);

    const granted = await requestNotificationPermissionOnly();
    if (!granted) {
      setShowGuide(true);
      return;
    }

    const token = await requestFcmToken();
    if (token) {
      try {
        await apiClient.post('/user/fcm-token', { token });
        toast.success('Notifications enabled! You’ll get match & message alerts.');
      } catch (err) {
        console.error('Failed to save token', err);
        toast.error('Enabled, but failed to save settings. Try again later.');
      }
    } else {
      toast.error('Failed to enable notifications. Please try again.');
    }
  }

  function handleDismiss() {
    localStorage.setItem('synctrip_notif_dismissed', 'true');
    setShowPrompt(false);
  }

  function closeGuide() {
    setShowGuide(false);
  }
  console.log("showPrompt",showPrompt);
  console.log("showGuide",showGuide);
  if (!showPrompt && !showGuide) return null;

  return (
    <>
      {true && (
        <div className="notif-prompt-overlay">
          <div className="notif-prompt-card">
            <h3>🔔 Stay Updated!</h3>
            <p>
              Enable notifications to get instant alerts for new matches and messages — even when the app is closed.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn btn-primary" onClick={handleEnable}>
                Enable Notifications
              </button>
              <button className="btn btn-secondary" onClick={handleDismiss}>
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="notif-prompt-overlay">
          <div className="notif-prompt-card">
            <h3>Enable Notifications Manually</h3>
            <p>
              {/iPhone|iPad|iPod/i.test(navigator.userAgent)
                ? 'Go to Settings → Safari → synctrip.in → Allow Notifications'
                : 'Tap the lock/icon in the address bar → Site settings → Notifications → Allow → Refresh'}
            </p>
            <button className="btn btn-primary" onClick={closeGuide}>
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}