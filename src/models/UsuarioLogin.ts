export default interface UsuarioLogin { // Definindo o formato do objeto UsuarioLogin
  id: number,
  nome: string,
  usuario: string,
  senha: string,
  foto: string,
  token: string;
}