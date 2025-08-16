"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, User, LogOut, Search } from "lucide-react"
import { Link } from "react-router-dom"

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications] = useState(3) // Simulando notificações
  const [searchQuery, setSearchQuery] = useState("")

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogout = () => {
    // Lógica de logout aqui
    console.log("Saindo do sistema...")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Pesquisando por:", searchQuery)
      // Aqui você pode implementar a lógica de pesquisa
      // Por exemplo: redirecionar para uma página de resultados
      // router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">Vanguard</span>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Direita - Informações do usuário e controles */}
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
             <Link to="/Settings">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4" />
              </Button>
             </Link>
            </div>
          </div>

          {/* Botão de Logout */}
         <Link to='/Login'>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
         </Link>
        </div>
      </div>
    </header>
  )
}
