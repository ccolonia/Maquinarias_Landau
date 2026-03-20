'use client'

import { useEffect, useState } from 'react'
import { 
  Save, 
  Loader2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  User,
  Lock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface SiteConfig {
  id: string
  siteName: string
  siteDescription: string
  logo: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImage: string
  address: string
  phone: string
  whatsapp: string
  email: string
  schedule: string
  facebook: string
  instagram: string
  yearsExperience: number
  clientsCount: number
  brandsCount: number
  techniciansCount: number
  primaryColor: string
}

interface CurrentUser {
  email: string
  name: string
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  
  // Credenciales
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [savingCredentials, setSavingCredentials] = useState(false)

  useEffect(() => {
    fetchConfig()
    fetchCurrentUser()
  }, [])

  async function fetchConfig() {
    try {
      const res = await fetch('/api/admin/config')
      const data = await res.json()
      setConfig(data)
    } catch (error) {
      console.error('Error fetching config:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCurrentUser() {
    try {
      const res = await fetch('/api/admin/auth')
      const data = await res.json()
      if (data.authenticated && data.user) {
        setCurrentUser({ email: data.user.email, name: data.user.name })
        setNewEmail(data.user.email)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  async function handleSave() {
    if (!config) return

    setSaving(true)
    try {
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      toast({
        title: 'Configuración guardada',
        description: 'Los cambios se han guardado correctamente.'
      })
    } catch (error) {
      console.error('Error saving config:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveCredentials() {
    if (!currentPassword && (newEmail !== currentUser?.email || newPassword)) {
      toast({
        title: 'Contraseña requerida',
        description: 'Debes ingresar tu contraseña actual para hacer cambios.',
        variant: 'destructive'
      })
      return
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Las contraseñas nuevas no coinciden.',
        variant: 'destructive'
      })
      return
    }

    if (newPassword && newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        variant: 'destructive'
      })
      return
    }

    setSavingCredentials(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail: newEmail !== currentUser?.email ? newEmail : undefined,
          newPassword: newPassword || undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar')
      }

      // Actualizar estado local
      if (data.user) {
        setCurrentUser({ email: data.user.email, name: data.user.name })
        setNewEmail(data.user.email)
      }
      
      // Limpiar campos de contraseña
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      toast({
        title: 'Credenciales actualizadas',
        description: data.message || 'Los cambios se guardaron correctamente.'
      })
    } catch (error) {
      console.error('Error saving credentials:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudieron actualizar las credenciales.',
        variant: 'destructive'
      })
    } finally {
      setSavingCredentials(false)
    }
  }

  function updateConfig(field: keyof SiteConfig, value: string | number) {
    if (!config) return
    setConfig({ ...config, [field]: value })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE1E2D]" />
      </div>
    )
  }

  if (!config) return null

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-1">Configura los datos de tu sitio web</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#BE1E2D] hover:bg-[#9B1829]">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      {/* Credenciales de Acceso */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Credenciales de Acceso
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm text-gray-500 mb-2">
            Cambia tu email y/o contraseña de acceso al panel administrativo.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Email de acceso
              </Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@landau.com"
              />
            </div>
            <div className="grid gap-2">
              <Label>Contraseña actual</Label>
              <div className="relative">
                <Input
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Nueva contraseña
              </Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Dejar vacío para mantener actual"
              />
            </div>
            <div className="grid gap-2">
              <Label>Confirmar nueva contraseña</Label>
              <Input
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir nueva contraseña"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveCredentials} 
              disabled={savingCredentials}
              className="bg-gray-800 hover:bg-gray-700"
            >
              {savingCredentials ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Lock className="w-4 h-4 mr-2" />
              )}
              Actualizar Credenciales
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información General */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Nombre del Sitio</Label>
              <Input
                value={config.siteName}
                onChange={(e) => updateConfig('siteName', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>URL del Logo</Label>
              <Input
                value={config.logo || ''}
                onChange={(e) => updateConfig('logo', e.target.value)}
                placeholder="/images/logo.png"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Descripción del Sitio</Label>
            <Textarea
              value={config.siteDescription || ''}
              onChange={(e) => updateConfig('siteDescription', e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Color Principal</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => updateConfig('primaryColor', e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={config.primaryColor}
                  onChange={(e) => updateConfig('primaryColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Section */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Sección Hero (Inicio)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Título Principal</Label>
            <Input
              value={config.heroTitle || ''}
              onChange={(e) => updateConfig('heroTitle', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Subtítulo</Label>
            <Input
              value={config.heroSubtitle || ''}
              onChange={(e) => updateConfig('heroSubtitle', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Descripción</Label>
            <Textarea
              value={config.heroDescription || ''}
              onChange={(e) => updateConfig('heroDescription', e.target.value)}
              rows={2}
            />
          </div>
          <div className="grid gap-2">
            <Label>URL de Imagen Hero</Label>
            <Input
              value={config.heroImage || ''}
              onChange={(e) => updateConfig('heroImage', e.target.value)}
              placeholder="/images/hero.png"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Información de Contacto
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección
              </Label>
              <Input
                value={config.address || ''}
                onChange={(e) => updateConfig('address', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
              </Label>
              <Input
                value={config.phone || ''}
                onChange={(e) => updateConfig('phone', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>WhatsApp (sin símbolos)</Label>
              <Input
                value={config.whatsapp || ''}
                onChange={(e) => updateConfig('whatsapp', e.target.value)}
                placeholder="5491162422197"
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={config.email || ''}
                onChange={(e) => updateConfig('email', e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horarios (JSON)
            </Label>
            <Textarea
              value={config.schedule || ''}
              onChange={(e) => updateConfig('schedule', e.target.value)}
              rows={3}
              placeholder='{"weekdays": "Lun-Jue: 9:30-17:00", "friday": "Vie: 9:30-14:00", "saturday": "Sáb: 8:00-13:00"}'
            />
          </div>
        </CardContent>
      </Card>

      {/* Redes Sociales */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Redes Sociales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook URL
              </Label>
              <Input
                value={config.facebook || ''}
                onChange={(e) => updateConfig('facebook', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram URL
              </Label>
              <Input
                value={config.instagram || ''}
                onChange={(e) => updateConfig('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle>Métricas del Sitio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <Label>Años de Experiencia</Label>
              <Input
                type="number"
                value={config.yearsExperience}
                onChange={(e) => updateConfig('yearsExperience', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Clientes Satisfechos</Label>
              <Input
                type="number"
                value={config.clientsCount}
                onChange={(e) => updateConfig('clientsCount', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Marcas Disponibles</Label>
              <Input
                type="number"
                value={config.brandsCount}
                onChange={(e) => updateConfig('brandsCount', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Técnicos Certificados</Label>
              <Input
                type="number"
                value={config.techniciansCount}
                onChange={(e) => updateConfig('techniciansCount', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
