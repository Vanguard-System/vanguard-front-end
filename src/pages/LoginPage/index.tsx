"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { login } from "@/services/auth"
import { CreateUser } from "@/services/users"
import { useNavigate } from "react-router-dom"
import BackendAlert from "@/components/BackendAlert" 
import title from "@/assets/title.jpeg";

interface AuthFormData {
  email: string
  username?: string
  password: string
  rememberMe: boolean
}

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    username: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<AuthFormData>>({})
  const [alert, setAlert] = useState<{ status: 'success' | 'error'; message: string } | null>(null)
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {}

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!isLogin && !formData.username) {
      newErrors.username = "Username é obrigatório"
    } else if (!isLogin && formData.username && formData.username.length < 3) {
      newErrors.username = "Username deve ter pelo menos 3 caracteres"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password)
        console.log("Login realizado:", res)
        setAlert({ status: 'success', message: "Login realizado com sucesso!" })
        navigate("/Budget")
      } else {
        const res = await CreateUser({
          email: formData.email,
          username: formData.username!,
          password: formData.password,
        })
        setAlert({ status: 'success', message: "Cadastro realizado com sucesso!" })
        setIsLogin(true)
        navigate("/login")
      }
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Ocorreu um erro"
      setAlert({ status: 'error', message: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof AuthFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setFormData({
      email: "",
      username: "",
      password: "",
      rememberMe: false,
    })
  }

  useEffect(() => {
    if (!alert) return
    const timer = setTimeout(() => setAlert(null), 4000)
    return () => clearTimeout(timer)
  }, [alert])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <img src={title} alt="Descrição da imagem" />
          <CardTitle className="text-2xl font-bold">{isLogin ? "Bem-vindo" : "Criar Conta"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Entre com suas credenciais para acessar sua conta"
              : "Preencha os dados para criar sua conta"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu username"
                    value={formData.username || ""}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Lembrar de mim
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm"
                  onClick={() => navigate("/forgot-password")}
                >
                  Esqueceu a senha?
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (isLogin ? "Entrando..." : "Cadastrando...") : isLogin ? "Entrar" : "Cadastrar"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <Button variant="link" className="px-0" onClick={toggleMode}>
                {isLogin ? "Cadastre-se" : "Faça login"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      {alert && (
        <div className="fixed bottom-5 right-5 sm:right-8 w-72 sm:w-96 z-50">
          <BackendAlert status={alert.status} message={alert.message} />
        </div>
      )}
    </div>
  )
}
