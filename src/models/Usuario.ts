import Postagem from "./Postagem";

// interface -> define a estrutura de um objeto
export default interface Usuario { // Definindo o formato do objeto Usuario
  id: number,
  nome: string,
  usuario: string,
  foto: string,
  senha: string,
  postagem?: Postagem | null; //* ? -> opcional
}
