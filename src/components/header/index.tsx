"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, User, LogOut } from 'lucide-react'
import logo from "./../../assets/logo.png"

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications] = useState(3) // Simulando notificações

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogout = () => {
    // Lógica de logout aqui
    console.log("Saindo do sistema...")
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              width={50}
              height={50}
              className="mx-auto"
            />
            <span className="ml-3 text-xl font-bold text-gray-900">Vanguard</span>
          </div>

          {/* Centro - Informações do usuário e controles */}
          <div className="flex items-center space-x-6">

            {/* Informações do usuário */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">João Silva</p>
                <p className="text-gray-500">Administrador</p>
              </div>
            </div>

            {/* Separador */}
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>

            {/* Controles */}
            <div className="flex items-center space-x-2">

              {/* Configurações */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Settings className="w-4 h-4" />
              </Button>

            </div>
          </div>

          {/* Botão de Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>

        </div>
      </div>
    </header>
  )
}
