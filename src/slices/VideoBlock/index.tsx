// Desativado — essa slice depende de tipos que o Slice Machine só gera
// quando conectado a um repositório Prismic de verdade (nunca foi
// configurado nesse projeto) e não é usada em nenhuma página do site hoje.
// Mantida (em vez de apagada) porque não consigo deletar arquivos
// remotamente nessa sessão. Se um dia quiser um bloco de vídeo de novo,
// dá pra reconstruir sem depender do Prismic, igual fizemos nas outras seções.
const VideoBlock = (): null => {
  return null;
};

export default VideoBlock;
