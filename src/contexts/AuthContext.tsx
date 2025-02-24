/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from "react";
import UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";
import { ToastAlerta } from "../utils/ToastAlert";

//? O que é Contexto? 
//* O Contexto é uma forma de compartilhar informações entre componentes sem precisar passar propriedades manualmente em cada componente filho até chegar no componente que precisa da informação compartilhada.  

// Interface que indica a Tipagem dos dados guardados no Contexto
interface AuthContextProps { // Definindo o formato do objeto que será passado para o createContext
  usuario: UsuarioLogin // O usuário logado
  handleLogout(): void // Função para deslogar
  handleLogin(usuario: UsuarioLogin): Promise<void> // Função para logar
  isLoading: boolean // Variável para indicar se está carregando
} // O objeto que será passado para o createContext deve ter essas propriedades

// Interface que indica a Tipagem do Provedor de Contexto - Função que armazena e gerencia os dados do Contexto
interface AuthProviderProps { // Definindo o formato do objeto que será passado para o AuthProvider
  children: ReactNode // O conteúdo que será exibido dentro do AuthProvider
} // ReactNode é um tipo do TypeScript que aceita qualquer coisa que o React aceita

// Criamos o Contexto e iniciamos ele com um objeto vazio
export const AuthContext = createContext({} as AuthContextProps) // Criando o contexto

// Criamos a função Provider/Provedor, que armazena e gerencia os dados do Contexto
export function AuthProvider({ children }: AuthProviderProps) { // Criando o componente que irá prover o contexto

  // Função que pega os dados do Formulário e atualiza a Variavel de Estado Usuario
  const [usuario, setUsuario] = useState<UsuarioLogin>({ // Criando o estado do usuário
    id: 0,
    nome: "",
    usuario: "",
    senha: "",
    foto: "",
    token: ""
  }) // O usuário logado

  // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
  const [isLoading, setIsLoading] = useState(false) // Criando o estado para indicar se está carregando

  // Função que é responsavel por Logar o usuário
  async function handleLogin(usuarioLogin: UsuarioLogin) { // Função para logar
    setIsLoading(true) // Indicando que está carregando
    try {
      await login("/usuarios/logar", usuarioLogin, setUsuario) // Chama a Service login
      ToastAlerta("Usuário foi autenticado com sucesso!", "sucesso")
    } catch (error) { // Tratando o erro
      ToastAlerta("Os dados do Usuário estão inconsistentes!", "erro")
    }
    setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
  }

  // Função que reseta os campos da variavel de estado, limpando o Token, e deslogando o usuário
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

  return (  // Montamos o retorno do Provider/Provedor de Contexto, passando os dados que ele compartilha
    <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading }}>
      {children}
    </AuthContext.Provider>
  ) // O conteúdo que será exibido dentro do AuthProvider
}
