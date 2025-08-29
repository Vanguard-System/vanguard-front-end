"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { GoogleOAuthProvider, GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import axios from 'axios'
import logo from "./../../assets/logo.png"
import { useState } from "react"

const CLIENT_ID = 'SEU_CLIENT_ID_DO_GOOGLE'

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return
    setIsLoading(true)
    try {
      const res = await axios.post('http://localhost:3000/auth/google', {
        idToken: credentialResponse.credential,
      })
      localStorage.setItem('token', res.data.accessToken)
    } 
    catch (err) {
      throw new Error ('Login failed!')
    }
     finally {
      setIsLoading(false)
    }
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-2 text-center pt-8">
            <img src={logo} alt="Logo" width={120} height={120} className="mx-auto" />
            <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
            <CardDescription className="text-gray-600 mb-16">
              Faça login com sua conta Google para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => alert("Falha no login")}
            />
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  )
}
