import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../contexts/AuthContext"
import Tema from "../../models/Tema"
import { buscar, deletar } from "../../services/Service"
import { RotatingLines } from "react-loader-spinner"

function DeletarTema() { // Função que define o componente DeletarTema

  const navigate = useNavigate(); // Hook de navegação

  const [tema, setTema] = useState<Tema>({} as Tema); // Estado que armazena o tema
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado que armazena se está carregando

  const { usuario, handleLogout } = useContext(AuthContext) // Desestruturação do AuthContext
  const token = usuario.token // Token do usuário

  const { id } = useParams<{ id: string }>() // Desestruturação dos parâmetros da URL

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

  useEffect(() => { // Hook de efeito
    if (token === '') { // Se o token for vazio
      alert('Você precisa estar logado') // Alerta que o usuário precisa estar logado
      navigate('/') // Navega para a rota inicial
    }
  }, [token]) // Dependência do hook

  useEffect(() => { // Hook de efeito
    if (id !== undefined) { // Se o ID não for indefinido
      buscarPorId(id) // Busca um tema pelo ID
    }
  }, [id]) // Dependência do hook

  async function deletartema() { // Função para deletar um tema
    setIsLoading(true) // Define que está carregando

    try { // Tenta deletar um tema
      await deletar(`/temas/${id}`, { // Deleta um tema pelo ID
        headers: { 'Authorization': token } // Define o cabeçalho da requisição
      })
      alert('Tema deletado com sucesso') // Alerta que o tema foi deletado com sucesso
    } catch (error: any) { // Tratamento de erro
      if (error.toStrig().includes("403")) { // Se o erro for 403
        handleLogout() // Desloga o usuário
      } else { // Senão
        alert('Erro ao deletar o tema') // Alerta que houve um erro ao deletar o tema
      }
    }

    setIsLoading(false) // Define que não está carregando
    retornar() // Retorna para a rota de temas

  }

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
            {isLoading ?
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              /> :
              <span>Sim</span>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeletarTema