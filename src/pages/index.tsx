import { Formulario } from "@/components/Formulario";

export default function Home() {
  return (
    <div>
      <h1>Parametros</h1>
      <main className="flex min-h-screen w-full flex-col items-center bg-white dark:bg-black sm:items-start">
        <Formulario/>
      </main>
    </div>
  );
}
