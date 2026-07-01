'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function NoteForm({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [text, setText] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      if (!res.ok) {
        setError('שגיאה בשמירת ההערה');
        return;
      }
      setText('');
      router.refresh();
    } catch {
      setError('שגיאה בשמירת ההערה');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="note-form" onSubmit={onSubmit}>
      <textarea
        placeholder="לדוגמה: דיברתי בטלפון, מעוניינים בשולחן אוכל מעץ אגוז, לחזור אחרי שיחלוט על מידות…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="admin-toast admin-toast--err" style={{ marginInlineStart: 0, marginBottom: '0.5rem' }}>{error}</p>}
      <button type="submit" className="btn-admin" disabled={saving || !text.trim()}>
        {saving ? 'שומר…' : 'שמירת הערה'}
      </button>
    </form>
  );
}
