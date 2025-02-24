/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import Tema from "../../../models/Tema"
import { buscar, deletar } from "../../../services/Service"
import { RotatingLines } from "react-loader-spinner"
import { ToastAlerta } from "../../../utils/ToastAlert"

function DeletarTema() { // Função que define o componente DeletarTema

  // Hook para gerenciar a navegação do usuário
  const navigate = useNavigate(); // Hook de navegação

  // Váriavel de Estado que recebe os dados de um Tema
  const [tema, setTema] = useState<Tema>({} as Tema); // Estado que armazena o tema

  // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado que armazena se está carregando


  // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
  const { usuario, handleLogout } = useContext(AuthContext) // Desestruturação do AuthContext
  const token = usuario.token // Token do usuário

  // Hook que pega uma variavel que foi passada pela rota do navegador - similar ao PathVariable do back
  const { id } = useParams<{ id: string }>() // Desestruturação dos parâmetros da URL

  // Função que chama a service buscar() para receber os dados de um Tema especifico - usada na atualização
  async function buscarPorId(id: string) { // Função para buscar um tema pelo ID
    try {
      await buscar(`/temas/${id}`, setTema, { // Busca um tema pelo ID
        headers: { 'Authorization': token } // Define o cabeçalho da requisição
      })
    } catch (error: any) { // Tratamento de erro
      if (error.toStrig().includes("403")) { // Se o erro for 403
        handleLogout() // Desloga o usuário
      }
    }
  }


  // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
  useEffect(() => { // Hook de efeito
    if (token === '') { // Se o token for vazio
      ToastAlerta('Você precisa estar logado', "info") // Alerta que o usuário precisa estar logado
      navigate('/') // Navega para a rota inicial
    }
  }, [token]) // Dependência do hook


  // Esse useEffect verifica se existe um ID, se sim, 
  // quer dizer que estamos fazendo uma atualização e chamamos a função buscarPorId
  useEffect(() => { // Hook de efeito
    if (id !== undefined) { // Se o ID não for indefinido
      buscarPorId(id) // Busca um tema pelo ID
    }
  }, [id]) // Dependência do hook

  // Função que realiza a Exclusão de um Tema
  async function deletartema() { // Função para deletar um tema
    setIsLoading(true) // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo

    try { // Tenta deletar um tema
      await deletar(`/temas/${id}`, { // Chama a service Deletar
        headers: { 'Authorization': token } // Define o cabeçalho da requisição
      })
      ToastAlerta('Tema deletado com sucesso', "sucesso") // Alerta que o tema foi deletado com sucesso
    } catch (error: any) { // Tratamento de erro
      if (error.toStrig().includes("403")) { // Se o erro for 403
        handleLogout() // Desloga o usuário
      } else { // Senão
        ToastAlerta('Erro ao deletar o tema', "erro") // Alerta que houve um erro ao deletar o tema
      }
    }

    setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
    retornar() // Chama a função retornar()

  }


  // Função que envia o usuário para a rota de listagem de temas
  function retornar() { // Função para retornar para a rota de temas
    navigate('/temas') // Navega para a rota de temas
  }


  return (
    <div className="container w-1/3 mx-auto">
      <h1 className="text-4xl text-center my-4">Deletar Tema</h1>
      <p className="text-center font-semibold mb-4">
        Você tem certeza de que deseja apagar o tema a seguir?
      </p>
      <div className="border flex flex-col rounded-2xl overflow-hidden justify-between">
        <header className="py-2 px-6 bg-indigo-600 text-white font-bold text-2xl">
          Tema
        </header>
        <p className="p-8 text-3xl bg-slate-200 h-full">{tema.descricao}</p>
        <div className="flex">
          <button
            className="text-slate-100 bg-red-400 hover:bg-red-600 w-full py-2"
            onClick={retornar}>
            Não
          </button>
          <button
            className="w-full text-slate-100 bg-indigo-400 hover:bg-indigo-600 flex items-center justify-center"
            onClick={deletartema}>
            {isLoading ? // Se houver um carregamento, mostre um Loader
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              /> :
              // Se NÃO um carregamento acontecendo, o texto que aparece é Sim
              <span>Sim</span>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarTema