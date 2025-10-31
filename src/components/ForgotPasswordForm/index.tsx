"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useRequestPasswordReset } from "@/services/hooks/useUsers"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { mutate: requestReset, isPending, isSuccess } = useRequestPasswordReset()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Digite um email válido.")
      return
    }
    setError(null)
    requestReset(email, {
      onSuccess: () => {
        navigate("/reset-password?email=" + encodeURIComponent(email))
      },
      onError: () => setError("Erro ao enviar o email. Tente novamente."),
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-bold">Esqueceu sua senha?</CardTitle>
          <CardDescription>Digite seu email e enviaremos um código de redefinição</CardDescription>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enviando..." : "Enviar código"}
            </Button>
            {isSuccess && <p className="text-sm text-green-500 text-center">Código enviado! Verifique seu email.</p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
