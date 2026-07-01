import LogoutButton from './LogoutButton';
import LogoMark from '@/components/Logo';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <LogoMark size={26} />
          אורי · ניהול לידים
        </div>
        <nav className="admin-topbar__nav">
          <a href="/admin">לוח מחוונים</a>
          <a href="/admin/leads">כל הלידים</a>
        </nav>
        <LogoutButton />
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
