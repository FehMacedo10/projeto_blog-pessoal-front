import Postagem from "./Postagem";

export default interface Tema { // Definindo o formato do objeto Tema
  id: number,
  descricao: string,
  postagem?: Postagem | null;
}