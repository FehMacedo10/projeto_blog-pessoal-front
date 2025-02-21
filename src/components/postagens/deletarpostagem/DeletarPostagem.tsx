/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Postagem from "../../../models/Postagem";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar, deletar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner"


function DeletarPostagem() {

  const navigate = useNavigate(); // Hook para gerenciar a navegação do usuário

  const [isLoading, setIsLoading] = useState<boolean>(false); // Váriavel de Estado que recebe os dados de um Tema
  const [postagem, setPostagem] = useState<Postagem>({} as Postagem);  // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo

  const { id } = useParams<{ id: string }>(); // Hook que pega uma variavel que foi passada pela rota do navegador - similar ao PathVariable do back

  // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
  const { usuario, handleLogout } = useContext(AuthContext); // Contexto de autenticação
  const token = usuario.token // Token de autenticação

  // Função que chama a service buscar() para receber os dados de uma Postagem especifica - usada na atualização
  async function buscarPorId(id: string) { // Função para buscar a postagem pelo id
    try { // Tenta buscar a postagem
      await buscar(`/postagens/${id}`, setPostagem, { // Requisição GET para a API
        headers: { // Cabeçalho da requisição
          'Authorization': token // Token de autenticação         
        }
      })
    } catch (error: any) { // Trata erros
      if (error.toString().includes("403")) { // Se o erro for 403
        handleLogout(); // Desloga o usuário
      }
    }
  }

  // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
  useEffect(() => { // Hook de efeito para verificar se o usuário está logado
    if (token === "") { // Se o token estiver vazio
      alert("Você precisa estar logado"); // Avisa o usuário
      navigate("/"); // Redireciona para a página inicial
    }
  }, [token]) // Array de dependências

  // Esse useEffect verifica se existe um ID, se sim, 
  // quer dizer que estamos fazendo uma atualização e chamamos a função buscarPorId
  useEffect(() => { // Hook de efeito para buscar a postagem pelo id
    if (id !== undefined) { // Se o id for diferente de indefinido
      buscarPorId(id); // Chama a função para buscar a postagem
    }
  }, [id]) // Array de dependências

  // Função que realiza a Exclusão de uma Postagem
  async function deletarPostagem() { // Função para deletar a postagem
    setIsLoading(true); // Atualiza a Variavel de Estado, indicando que existe uma carregamento

    try { // Tenta deletar a postagem
      await deletar(`/postagens/${id}`, { // Chama a service Deletar
        headers: { // Cabeçalho da requisição
          'Authorization': token // Token de autenticação
        }
      })
      alert("Postagem apagada com sucesso"); // Avisa o usuário
    } catch (error: any) { // Trata erros
      if (error.toString().includes("403")) { // Se o erro for 403
        handleLogout(); // Desloga o usuário
      } else { // Se não
        alert("Erro ao deletar a postagem") // Avisa o usuário
      }
    }

    setIsLoading(false);  // Atualiza a Variavel de Estado, indicando que o carregamento parou
    retornar(); // Chama a função para retornar para a página de postagens

  }
  // Função que envia o usuário para a rota de listagem de postagem
  function retornar() { // Função para retornar para a página de postagens
    navigate("/postagens"); // Redireciona para a página de postagens
  }

  return (
    <div className="container w-1/3 mx-auto">
      <h1 className="text-4xl text-center my-4">Deletar Postagem</h1>

      <p className="text-center font-semibold mb-4">
        Você tem certeza de que deseja apagar a postagem a seguir?
      </p>

      <div className="border flex flex-col rounded-2xl overflow-hidden justify-between">
        <header className="py-2 px-6 bg-indigo-600 text-white font-bold text-2xl">
          Postagem
        </header>
        <div className="p-4">
          <p className="text-xl h-full">{postagem.titulo}</p>
          <p>{postagem.texto}</p>
        </div>
        <div className="flex">
          <button
            className="text-slate-100 bg-red-400 hover:bg-red-600 w-full py-2"
            onClick={retornar}>
            Não
          </button>
          <button
            className="w-full text-slate-100 bg-indigo-400 
            hover:bg-indigo-600 flex items-center justify-center"
            onClick={deletarPostagem}>

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

export default DeletarPostagem