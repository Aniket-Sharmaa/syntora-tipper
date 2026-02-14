import type { Metadata } from 'next'
import '../app/globals.css';
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Syntora-Tipper - Employee Management System',
  description: 'Comprehensive employee management and payment system with expense tracking, salary calculations, and role-based access control',
  keywords: 'employee management, payment system, expense tracking, salary calculation, HR management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
