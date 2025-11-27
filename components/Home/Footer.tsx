import Link from "next/link";
import { LayoutDashboard, Twitter, Github, Linkedin } from "lucide-react";
import navbarData from "@/backend/config/config.json";

export type NavbarConfig = {
  Texts: { logo_name: string };
  cores: { primary: string; secondary: string; [key: string]: string };
};

const config: NavbarConfig = navbarData as NavbarConfig;

const footerSections = [
  {
    title: "Produto",
    links: [
      { title: "Funcionalidades", href: "/features" },
      { title: "Preços", href: "/prices" },
      { title: "Integrações", href: "/integrations" },
      { title: "Atualizações", href: "/changelog" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { title: "Sobre nós", href: "/about" },
      { title: "Carreiras", href: "/careers" },
      { title: "Imprensa", href: "/press" },
      { title: "Contato", href: "/contact" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { title: "Blog", href: "/blog" },
      { title: "Documentação", href: "/docs" },
      { title: "Suporte", href: "/support" },
      { title: "API Status", href: "/status" },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: "#", name: "Twitter" },
  { icon: Github, href: "#", name: "GitHub" },
  { icon: Linkedin, href: "#", name: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <LayoutDashboard className="h-7 w-7 text-primary" />
              <span className="font-bold text-xl">{config.Texts.logo_name}</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              A solução completa para gestão inteligente do seu negócio.
            </p>
          </div>


          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.title} className="mb-2">
                    <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Rodapé inferior */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} {config.Texts.logo_name}, Inc. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.href} className="text-muted-foreground hover:text-primary">
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
