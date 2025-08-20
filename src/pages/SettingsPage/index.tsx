"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Camera, User, Lock, LogOut, Save } from "lucide-react"
import Header from "../../components/header"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"

export default function SettingsPage() {
  const [name, setName] = useState("João Silva")
  const [email, setEmail] = useState("joao@exemplo.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileImage, setProfileImage] = useState("/diverse-user-avatars.png")
  const { toast } = useToast()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi alterada com sucesso.",
      })
    }
  }

  const handleSaveProfile = () => {
    toast({
      title: "Perfil salvo",
      description: "Suas informações foram atualizadas com sucesso.",
    })
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: "Erro", description: "A nova senha deve ter pelo menos 6 caracteres.", variant: "destructive" })
      return
    }
    toast({ title: "Senha alterada", description: "Sua senha foi alterada com sucesso." })
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
  }

  const handleLogout = () => {
    toast({
      title: "Saindo do sistema",
      description: "Você será redirecionado para a página de login.",
    })
    setTimeout(() => { window.location.href = "/login" }, 2000)
  }

  return (
    <div className="min-h-screen ml-0 md:ml-44">
      <Header />

      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="mb-6 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Gerencie suas informações pessoais e preferências da conta</p>
          </header>

          {/* Card Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>Atualize suas informações pessoais e foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage || "/placeholder.svg"} alt="Foto do perfil" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col sm:items-start items-center gap-2">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      Alterar Foto
                    </div>
                  </Label>
                  <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">JPG, PNG ou GIF. Máximo 5MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <Button onClick={handleSaveProfile} className="flex items-center gap-2 w-full sm:w-auto">
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>Altere sua senha para manter sua conta segura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Digite sua senha atual" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Digite a nova senha" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme a nova senha" />
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                <Button onClick={handleChangePassword} disabled={!currentPassword || !newPassword || !confirmPassword} className="flex items-center gap-2 w-full sm:w-auto">
                  <Lock className="h-4 w-4" />
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Logout */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <LogOut className="h-5 w-5" />
                Sair do Sistema
              </CardTitle>
              <CardDescription>Encerre sua sessão atual e retorne à página de login</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center sm:justify-start">
              <Link to='/Login' className="w-full sm:w-auto">
                <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 w-full sm:w-auto">
                  <LogOut className="h-4 w-4" />
                  Sair da Conta
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
