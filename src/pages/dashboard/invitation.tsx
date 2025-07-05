import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { Building2, Mail, User, ChefHat, Users, Shield, Clock, MapPin, Phone } from "lucide-react";
import { useGetInvitation } from "@/api/endpoints/invitation/hooks";
import { useGetRestaurant } from "@/api/endpoints/restaurants/hooks";
import { useGetRole } from "@/api/endpoints/role/hook";
import { useGetUser } from "@/api/endpoints/user/hooks";
import { membershipsApi } from "@/api/endpoints/memberships/requests";
import { invitationApi } from "@/api/endpoints/invitation/requests";
import { showPromiseToast } from "@/utils/notifications/toast";
import { useGoogleAuth } from "@/hooks/use-google-auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { authApi } from "@/api/endpoints/auth/endpoints";
import { LoginForm } from "@/components/pages/login/login-form";


interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const getRoleIcon = (roleName: string) => {
  const name = roleName.toLowerCase();
  if (name.includes("chef")) return <ChefHat className="h-4 w-4" />;
  if (name.includes("manager")) return <Shield className="h-4 w-4" />;
  if (name.includes("server") || name.includes("waiter")) return <Users className="h-4 w-4" />;
  return <User className="h-4 w-4" />;
};

const formatOpeningHours = (hours: string) => {
  const [open, close] = hours.split("-");
  return `${open} - ${close}`;
};

const renderError = (message: string) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center">
    <p className="text-lg font-semibold">{message}</p>
    <div className="flex gap-4">
      <Button asChild>
        <Link to="/">Início</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="/contact">Contacto</Link>
      </Button>
    </div>
  </div>
);

export default function RestaurantInvitation() {
  const { invitationId } = useParams() as { invitationId: string };

  const {
    data: invitation,
    isError: invitationError,
    isLoading: invitationLoading,
  } = useGetInvitation(invitationId);
  const {
    data: role,
    isError: roleError,
    isLoading: roleLoading,
  } = useGetRole(invitation?.roleId);
  const {
    data: restaurant,
    isError: restaurantError,
    isLoading: restaurantLoading,
  } = useGetRestaurant(invitation?.restaurantId);
  const {
    data: manager,
    isError: managerError,
    isLoading: managerLoading,
  } = useGetUser(invitation?.managerId);

  const invitedEmail = (invitation as unknown as { email?: string })?.email ?? "";

  const navigate = useNavigate();
  const { signInWithGoogle } = useGoogleAuth();


  const [currentView, setCurrentView] = useState<"invitation" | "choice" | "signup" | "login">("invitation");
  const [signupData, setSignupData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: invitedEmail,
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (invitation) {
      setSignupData((prev) => ({
        ...prev,
        firstName: invitation.name.split(" ")[0] || "",
        lastName: invitation.name.split(" ").slice(1).join(" ") || "",
        email: invitedEmail,
      }));
    }
  }, [invitation, invitedEmail]);

  const handleAcceptInvitation = () => setCurrentView("choice");
  const handleDeclineInvitation = () => {};

  const handleExistingLoginSuccess = async () => {
    if (!invitation) return;
    const user = await authApi.me();
    await membershipsApi.addMembership(user._id, invitation.roleId);
    await membershipsApi.activateMembership(user._id, invitation.restaurantId);
    await invitationApi.deleteInvitation(invitation._id);
    navigate("/dashboard");
  };

  const handleExistingLogin = () => {
    const promise = handleExistingLoginSuccess();
    showPromiseToast(promise, {
      loading: "Aceitando convite...",
      success: "Convite aceito!",
      error: "Erro ao aceitar convite.",
    });
    return promise;
  };

  const handleGoogleSignup = () => {
    const promise = signInWithGoogle()
      .then(async ({ token, credential }) => {
        const firebaseId = await auth.currentUser?.getIdToken();

        if (!firebaseId) return;

        if (!invitation) return;

        const user = await authApi.register({
          idToken: token,
          userData: {
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: credential.user.email ?? "",
            phoneNumber: signupData.phoneNumber,
          },
        });

        await membershipsApi.addMembership(
          user._id,
          invitation.roleId
        );
        await membershipsApi.activateMembership(
          user._id,
          invitation.restaurantId
        );
        await invitationApi.deleteInvitation(invitation._id);
      })
      .then(() => navigate("/dashboard"));

    showPromiseToast(promise, {
      loading: "Criando conta...",
      success: "Conta criada com sucesso!",
      error: "Erro ao criar conta.",
    });
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();

    const promise = createUserWithEmailAndPassword(
      auth,
      signupData.email,
      signupData.password
    )
      .then(async (cred) => {
        const token = await cred.user.getIdToken();
        const email = cred.user.email;

        if (!email) return;

        if (!invitation) return;

        const user = await authApi.register({
          idToken: token,
          userData: {
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            email: email,
            phoneNumber: signupData.phoneNumber,
          },
        });

        await membershipsApi.addMembership(
          user._id,
          invitation.roleId
        );
        await membershipsApi.activateMembership(
          user._id,
          invitation.restaurantId
        );
        await invitationApi.deleteInvitation(invitation._id);
      })
      .then(() => navigate("/dashboard"));

    showPromiseToast(promise, {
      loading: "Criando conta...",
      success: "Conta criada com sucesso!",
      error: "Erro ao criar conta.",
    });
  };
  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  if (
    invitationLoading ||
    roleLoading ||
    restaurantLoading ||
    managerLoading
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (invitationError || !invitation) {
    return renderError("Convite não encontrado.");
  }

  if (restaurantError || !restaurant) {
    return renderError("Restaurante não encontrado.");
  }

  if (roleError || !role) {
    return renderError("Função não encontrada.");
  }

  if (managerError || !manager) {
    return renderError("Usuário não encontrado.");
  }

  if (currentView === "choice") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Como deseja continuar?</CardTitle>
              <CardDescription>Escolha usar uma conta existente ou criar uma nova.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full h-12 text-base font-medium" onClick={() => setCurrentView('login')}>
                Entrar na minha conta
              </Button>
              <Button variant="outline" className="w-full h-12 text-base font-medium" onClick={() => setCurrentView('signup')}>
                Criar nova conta
              </Button>
              <div className="text-center">
                <Button variant="ghost" onClick={() => setCurrentView('invitation')} className="text-sm text-muted-foreground hover:text-foreground">
                  ← Voltar ao convite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Entre na Sua Conta</CardTitle>
              <CardDescription>Use uma conta existente para aceitar o convite</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onLoggedIn={handleExistingLogin} />
              <div className="text-center mt-4">
                <Button variant="ghost" onClick={() => setCurrentView('choice')} className="text-sm text-muted-foreground hover:text-foreground">
                  ← Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === "signup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Crie Sua Conta</CardTitle>
              <CardDescription>
                Junte-se ao {restaurant.name} como {role.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button variant="outline" className="w-full h-12 text-base font-medium" onClick={handleGoogleSignup}>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar com Google
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Ou continue com email</span>
                </div>
              </div>
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" type="text" value={signupData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" type="text" value={signupData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={signupData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Telefone</Label>
                  <Input id="phoneNumber" type="tel" value={signupData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" value={signupData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input id="confirmPassword" type="password" value={signupData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-medium">
                  Criar Conta
                </Button>
              </form>
              <div className="text-center">
                <Button variant="ghost" onClick={() => setCurrentView("invitation")} className="text-sm text-muted-foreground hover:text-foreground">
                  ← Voltar ao convite
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="border-0">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 transition-all ease-in-out duration-150 hover:border border-purple-400 hover:outline-2 outline-purple-200 bg-zinc-200 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-zinc-600" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gray-900">Você Foi Convidado!</CardTitle>
              <CardDescription className="text-lg mt-2">Junte-se ao {restaurant.name} como {role.name}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex items-center space-x-4 lg:flex-shrink-0">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={restaurant.logoUrl || "/placeholder.svg"} alt={restaurant.name} />
                    <AvatarFallback className="bg-zinc-200 text-2xl font-bold">
                      {restaurant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{restaurant.name}</h3>
                    <Badge variant="secondary" className="mt-1">{restaurant.isActive ? "Ativo" : "Inativo"}</Badge>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-gray-700">{restaurant.description}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{restaurant.phoneNumber}</span>
                    </div>
                  </div>
                  {restaurant.settings.openingHours && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />Horário de Funcionamento
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {Object.entries(restaurant.settings.openingHours).map(([day, hours]) =>
                          hours ? (
                            <div key={day} className="flex justify-between bg-white px-2 py-1 rounded">
                              <span className="capitalize font-medium">
                                {day === "monday"
                                  ? "Seg"
                                  : day === "tuesday"
                                  ? "Ter"
                                  : day === "wednesday"
                                  ? "Qua"
                                  : day === "thursday"
                                  ? "Qui"
                                  : day === "friday"
                                  ? "Sex"
                                  : day === "saturday"
                                  ? "Sáb"
                                  : "Dom"}
                              </span>
                              <span className="text-gray-600">{formatOpeningHours(hours)}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />Convidado por
                </h4>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {manager.firstName.charAt(0)}{manager.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {manager.firstName} {manager.lastName}
                    </p>
                    <p className="text-sm text-gray-600">Gerente</p>
                    <p className="text-sm text-gray-500">{manager.email}</p>
                    <p className="text-sm text-gray-500">{manager.phoneNumber}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2" />Sua Função
                </h4>
                <div className="p-4 bg-white rounded-lg border space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{role.name}</p>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                    <Badge className="flex items-center gap-1" style={{ color: "white" }}>
                      {getRoleIcon(role.name)}
                      {role.name}
                    </Badge>
                  </div>
                  {/*<div className="space-y-2">*/}
                  {/*  <p className="text-xs font-medium text-gray-700">Permissões:</p>*/}
                  {/*  <div className="flex flex-wrap gap-1">*/}
                  {/*    {role.permissions.map((perm, index) => (*/}
                  {/*      <Badge key={index} variant="outline" className="text-xs">*/}
                  {/*        {perm.section}: {perm.permissions.join(", ")}*/}
                  {/*      </Badge>*/}
                  {/*    ))}*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="text-sm text-blue-800">
                  <strong>Convite para:</strong> {invitation.name}
                </p>
                {invitedEmail && (
                  <p className="text-sm text-blue-800">
                    <strong>Email:</strong> {invitedEmail}
                  </p>
                )}
              </div>
              <p className="text-xs text-blue-600">
                Convite criado em: {new Date(invitation.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleAcceptInvitation} className="flex-1 text-base font-medium">
                Aceitar Convite
              </Button>
              <Button variant="outline" onClick={handleDeclineInvitation} className="flex-1 text-base font-medium">
                Recusar
              </Button>
            </div>
            <div className="text-center text-sm text-gray-500">
              Ao aceitar este convite, você concorda em se juntar ao {restaurant.name} como {role.name}.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
