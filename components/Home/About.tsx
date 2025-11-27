import Image from 'next/image';

export default function About2() {
  return (
    <section className="bg-blue-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Inovando a Gestão da sua Loja!
            </h2>
            <p className="text-lg sm:text-xl leading-8 text-blue-100">
              Nascemos da necessidade de simplificar a complexa rotina de lojas pequenasg. Nossa plataforma foi desenhada por especialistas do setor para oferecer uma solução completa e intuitiva, que cuida de todos os detalhes do seu negócio.
            </p>
            <p className="text-lg sm:text-xl leading-8 text-blue-100">
              Da gestão de lotes e controle de metragem ao ponto de venda, nosso objetivo é um só: dar a você o tempo e a tranquilidade para focar no que realmente importa!
            </p>
          </div>
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-80 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/assets/pcb_header.jpg"
                alt="Loja de tecidos organizada"
                layout="fill"
                objectFit="cover"
                className="transform hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
