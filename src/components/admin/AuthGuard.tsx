'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // No verificar auth en la página de login
    if (pathname === '/admin/login') {
      setIsAuthenticated(true)
      return
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth')
        const data = await res.json()
        
        if (data.authenticated) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/admin/login')
        }
      } catch (err) {
        setIsAuthenticated(false)
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [pathname, router])

  // En la página de login, no mostrar loader
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Mostrar loader mientras verifica
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D] mx-auto mb-4" />
          <p className="text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (ya se redirigió)
  if (!isAuthenticated) {
    return null
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>
}
