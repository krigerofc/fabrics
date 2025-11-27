import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="w-full min-h-[600px] h-[800px] bg-amber-100">
      <div className="w-full h-full bg-cover bg-center bg-[url('/assets/pcb_header.jpg')]">
        <div className="w-full h-full bg-black/60 flex flex-col justify-center items-center px-4">

          <div className="text-white text-center max-w-4xl">
            <h1 className="uppercase tracking-widest text-blue-500 font-bold text-4xl sm:text-5xl lg:text-6xl mb-4">
              Gestão Inteligente
            </h1>

            <h2 className="uppercase tracking-wider text-blue-400 font-medium text-lg sm:text-xl lg:text-2xl mb-6">
              Organização, velocidade e segurança
            </h2>

            <p className="text-base sm:text-lg lg:text-2xl font-light leading-relaxed">
                Desenvolvido especialmente para pequenas lojas que precisam
                de mais organização, agilidade e segurança, 
                todas as operações de forma simples, rápida.
            </p>
          </div>

          <div className="flex flex-row mt-8 gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6">
              Conheça mais
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
