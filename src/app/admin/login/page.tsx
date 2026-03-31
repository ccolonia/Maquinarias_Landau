'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, Loader2, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  // Verificar si ya está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth')
        const data = await res.json()
        if (data.authenticated) {
          router.push('/admin')
        }
      } catch (err) {
        // No autenticado
      } finally {
        setCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D] mx-auto mb-4" />
          <p className="text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#BE1E2D] to-[#881520] flex items-center justify-center shadow-lg">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Panel de Administración</CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Maquinarias Landau
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@landau.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-[#BE1E2D] focus:ring-[#BE1E2D]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-[#BE1E2D] focus:ring-[#BE1E2D]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-[#BE1E2D] hover:bg-[#9B1829] text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Ingresar al Panel'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-[#BE1E2D] transition-colors">
              ← Volver al sitio web
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
