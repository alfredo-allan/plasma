import { redirect } from "next/navigation";

// Rota desativada — a loja agora vende só roupas, não faz mais sentido
// ter um customizador de skate montado aqui. Mantive o arquivo (em vez de
// apagar) porque não consigo deletar arquivos remotamente nessa sessão;
// se quiser remover a pasta "build" inteira do projeto, pode apagar
// manualmente depois.
export default function Page() {
  redirect("/");
}
