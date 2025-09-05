"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings, User, LogOut, Search, Menu, X, Home, Bus, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "@/services/auth"

const menuItems = [
  { title: "Home", icon: Home, url: "/Home" },
  { title: "Motorista", icon: User, url: "/Driver" },
  { title: "Carro", icon: Bus, url: "/Car" },
  { title: "Clientes", icon: Users, url: "/Client" },
  { title: "Orçamentos", icon: Users, url: "/Budget" },
]

export default function Header() {
  const [notifications] = useState(3)
  const [searchQuery, setSearchQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); 
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) console.log("Pesquisando por:", searchQuery)
  }
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)

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

          {/* Busca Desktop */}
          <div className="flex-1 mx-4 hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>

          {/* Hamburger Mobile */}
          <div className="sm:hidden flex items-center">
            <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Desktop Right */}
          <div className="hidden sm:flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">João Silva</p>
                <p className="text-gray-500">Administrador</p>
              </div>
            </div>

            <div className="w-px h-6 bg-gray-300"></div>

            <Link to="/Settings">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/Login">
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
      </div>

      {/* Menu Mobile - agora contém o sidebar completo */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-md px-4 py-3">
          {/* Busca Mobile */}
          <form onSubmit={handleSearch} className="mb-3">
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

          {/* Menu Items Mobile */}
          <div className="flex flex-col space-y-2 mb-3">
            {menuItems.map((item) => (
              <Link key={item.title} to={item.url} onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>

          {/* Configurações e Logout */}
          <div className="flex flex-col space-y-2">
            <Link to="/Settings">
              <Button variant="ghost" className="w-full flex items-center justify-start gap-2">
                <Settings className="w-4 h-4" /> Configurações
              </Button>
            </Link>
            <Link to="/Login">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full flex items-center justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" /> Sair
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
