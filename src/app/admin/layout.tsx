import AuthGuard from '@/components/admin/AuthGuard'
import AdminLayoutClient from './AdminLayoutClient'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthGuard>
  )
}
