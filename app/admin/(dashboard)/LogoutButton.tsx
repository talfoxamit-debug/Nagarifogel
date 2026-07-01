'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const onClick = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };
  return (
    <button type="button" className="admin-topbar__logout" onClick={onClick}>
      התנתקות
    </button>
  );
}
