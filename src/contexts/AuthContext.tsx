import { createContext, ReactNode, useState } from "react";
import UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";


interface AuthContextProps { // Definindo o formato do objeto que será passado para o createContext
  usuario: UsuarioLogin // O usuário logado
  handleLogout(): void // Função para deslogar
  handleLogin(usuario: UsuarioLogin): Promise<void> // Função para logar
  isLoading: boolean // Variável para indicar se está carregando
} // O objeto que será passado para o createContext deve ter essas propriedades

interface AuthProviderProps { // Definindo o formato do objeto que será passado para o AuthProvider
  children: ReactNode // O conteúdo que será exibido dentro do AuthProvider
} // ReactNode é um tipo do TypeScript que aceita qualquer coisa que o React aceita

export const AuthContex = createContext({} as AuthContextProps) // Criando o contexto

export function AuthProvider ({children}: AuthProviderProps) { // Criando o componente que irá prover o contexto

  const [usuario, setUsuario] = useState<UsuarioLogin>({ // Criando o estado do usuário
    id: 0,
    nome: "",
    usuario: "",
    senha: "",
    foto: "",
    token: ""
  }) // O usuário logado

  const [isLoading, setIsLoading] = useState(false) // Criando o estado para indicar se está carregando

  async function handleLogin(usuarioLogin: UsuarioLogin) { // Função para logar
    setIsLoading(true) // Indicando que está carregando
    try {
      await login("/usuarios/logar", usuarioLogin, setUsuario) // Chamando a função de login
      alert("O Usuário foi autenticado com sucesso!") 
    } catch (error) { // Tratando o erro
      alert("Os Dados do usuário estão inconsistentes!")
    }
    setIsLoading(false) // Indicando que parou de carregar
  } 

  function handleLogout() { // Função para deslogar
    setUsuario({ // Setando o usuário como vazio
      id: 0,
      nome: "",
      usuario: "",
      senha: "",
      foto: "",
      token: ""
    })  
  } // O usuário logado

  return ( // Retornando o contexto
    <AuthContex.Provider value={{usuario, handleLogin, handleLogout, isLoading}}>
      {children} 
    </AuthContex.Provider>
  ) // O conteúdo que será exibido dentro do AuthProvider
}
