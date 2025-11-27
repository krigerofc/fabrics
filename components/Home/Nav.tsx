
'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";

import { LayoutDashboard, UserCircle, Settings, LogOut, ChevronDown, Menu } from "lucide-react"; 
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import navbarData from "@/backend/config/config.json";

//  Tipos 
export type NavbarConfig = {
  Texts: { logo_name: string };
  cores: { primary: string; secondary: string; [key:string]: string };
};

const NAV_LINKS = [
  { title: "Início", href: "/" },
  { title: "Sobre", href: "/About" },
  { title: "Preços", href: "/Prices" },
  { title: "Contato", href: "/Contact" },
];


const USER_MENU = [
  { title: "Perfil", href: "/Account/Profile", icon: UserCircle },
  { title: "Configurações", href: "/Account/Settings", icon: Settings },
  { title: "Sair", href: "/api/auth/signout", icon: LogOut },
];

const config: NavbarConfig = navbarData as NavbarConfig;

export default function Navbar() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between m-auto"> 

        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg hidden sm:inline-block">
              {config.Texts.logo_name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-4">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground/80"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {status === "loading" && (
            <Button variant="ghost" disabled className="flex items-center space-x-2">
            <UserCircle className="h-5 w-5" />
            <span>Carregando...</span>
            </Button>
            )}
          {status === "unauthenticated" && (
            <Button asChild>
            <Link href="/api/auth/signin">Login</Link>
            </Button>
          )}
          {status === "authenticated" &&(
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <UserCircle className="h-5 w-5" />
                  <span>Conta</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48">
                {USER_MENU.map((item, i) => (
                  <Link href={item.href} key={i} passHref>
                    <DropdownMenuItem className="cursor-pointer flex items-center">
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.title}
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {NAV_LINKS.map((link, i) => (
                  <Link href={link.href} key={i} passHref>
                      <DropdownMenuItem className="cursor-pointer">
                          {link.title}
                      </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      </div>
    </header>
  );
}