'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'error' | 'not_configured'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setStatus(data.error === 'not_configured' ? 'not_configured' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">אורי · ניהול לידים</div>
        <p className="admin-login__sub">כניסה לאזור הניהול</p>

        {status === 'not_configured' ? (
          <div className="admin-login__notice">
            הכניסה לא הוגדרה עדיין. יש להגדיר את משתני הסביבה <code>ADMIN_PASSWORD</code> ו־
            <code>ADMIN_SESSION_SECRET</code> בפרויקט ולפרוס מחדש.
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="admin-login__field">
              <label htmlFor="password">סיסמה</label>
              <input
                id="password"
                type="password"
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {status === 'error' && <div className="admin-login__error">סיסמה שגויה. נסו שוב.</div>}
            <button type="submit" className="btn-admin" style={{ width: '100%' }} disabled={status === 'sending'}>
              {status === 'sending' ? 'מתחבר…' : 'התחברות'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
