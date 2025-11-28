import { useState } from "react"
import { verify2FA } from "@/services/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BackendAlert from "@/components/BackendAlert"

export default function TwoFactorModal({
  email,
  onClose,
  onSuccess
}: {
  email: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [code, setCode] = useState("")
  const [alert, setAlert] = useState<{ status: "success" | "error"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!code) {
      setAlert({ status: "error", message: "Digite o código" })
      return
    }

    setLoading(true)

    try {
      await verify2FA(email, code)
      setAlert({ status: "success", message: "Código verificado!" })
      setTimeout(() => onSuccess(), 800)
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Código incorreto"
      setAlert({ status: "error", message: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Verificação 2FA</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Enviamos um código de verificação para <b>{email}</b>
          </p>

          <Input
            type="text"
            placeholder="Código 2FA"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />

          <Button className="w-full" onClick={handleVerify} disabled={loading}>
            {loading ? "Verificando..." : "Confirmar"}
          </Button>

          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cancelar
          </Button>

          {alert && (
            <div className="mt-3">
              <BackendAlert status={alert.status} message={alert.message} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
