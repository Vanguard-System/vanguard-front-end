"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Camera, User, Lock, LogOut, Save, User2Icon } from "lucide-react";
import Header from "../../components/header";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useCurrentUser, useUpdateUser } from "@/services/hooks/useUsers";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: currentUser } = useCurrentUser();
  const updateUserMutation = useUpdateUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("/diverse-user-avatars.png");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      await updateUserMutation.mutateAsync({
        id: currentUser.id,
        data: { username, email },
      });

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error?.response?.data?.message || "Não foi possível atualizar o perfil.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    toast({
      title: "Saindo do sistema",
      description: "Você será redirecionado para a página de login.",
    });
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <div className="min-h-screen ml-0 md:ml-44 mt-5 mb-10 px-4 sm:px-6 lg:px-8">
      <Header />

      <main className="pt-16 max-w-4xl mx-auto space-y-6">
        <header className="mb-6 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas informações pessoais e preferências da conta
          </p>
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
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full">
              <Avatar className="h-24 w-24 flex-shrink-0">
                <AvatarImage src={profileImage || "/placeholder.svg"} alt="Foto do perfil" />
                <AvatarFallback>
                  <User2Icon />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="space-y-2 w-full">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 w-full">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row justify-center sm:justify-end">
              <Button
                onClick={handleSaveProfile}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Save className="h-4 w-4" />
                Salvar Alterações
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
          <CardContent className="flex flex-col sm:flex-row justify-center sm:justify-start">
            <Link to='/login' className="w-full sm:w-auto">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4" />
                Sair da Conta
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
