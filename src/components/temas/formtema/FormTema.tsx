import { ChangeEvent, useContext, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext";
import Tema from "../../../models/Tema";
import { atualizar, buscar, cadastrar } from "../../../services/Service";

function FormTema() {

  const navigate = useNavigate(); // Hook de navegação

  const [tema, setTema] = useState<Tema>({} as Tema); // Estado para armazenar o tema
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para armazenar o status de carregamento

  const { usuario, handleLogout } = useContext(AuthContext); // Dados do usuário logado 
  const token = usuario.token // Token do usuário logado

  const { id } = useParams<{ id: string }>(); // Parâmetro de rota

  async function buscarPorId( id: string) { // Função para buscar um tema por id
    try {
      await buscar(`/temas/${id}`, setTema, { // Faz a requisição para a API 
        headers: { 'Authorization': token } // Passa o token do usuário logado no cabeçalho da requisição
      })
    } catch (error: any) { // 
      if (error.toString().includes('403')) { //
        handleLogout()
      }
    }
  }

  useEffect(() => { // Hook de efeito
    if (token === '') { // Se o token estiver vazio
      alert("Você precisa estar logado!") // Exibe um alerta
      navigate('/') // Navega para a página inicial
    }
  }, [token]) 

  useEffect(() => { // Hook de efeito
    if (id !== undefined) { // Se o id for diferente de indefinido
      buscarPorId(id) // Busca o tema pelo id 
    }
  }, [id])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) { // Função para atualizar o estado
    setTema({
      ...tema, // Espalha o estado atual
      [e.target.name]: e.target.value // Atualiza o estado com o valor do campo
    })
  }

  function retornar() { // Função para retornar
    navigate('/temas') // Navega para a página de temas 
  }

  async function gerarNovoTema(e: ChangeEvent<HTMLFormElement>) { // Função para gerar um novo tema
    e.preventDefault() // Previne o comportamento padrão do formulário
    setIsLoading(true) // Atualiza o estado de carregamento para verdadeiro

    if (id !== undefined) { // Se o id for diferente de indefinido 
      try { // Tenta fazer a requisição
        await atualizar(`/temas`, tema, setTema, { // Faz a requisição para a API 
          headers: { 'Authorization': token } // Passa o token do usuário logado no cabeçalho da requisição
        })
        alert("O Tema foi atualizado com sucesso!") // Exibe um alerta 
      } catch (error: any) { // Trata o erro
        if (error.toString().includes('403')) { // Se o erro for 403
          handleLogout() // Desconecta o usuário
        } else { // Senão
          alert("Erro ao atualizar o tema") // Exibe um alerta
        }
      }
    } else { // Senão
      try { //  Tenta fazer a requisição 
        await cadastrar(`/temas`, tema, setTema, {
          headers: { 'Authorization': token } // Passa o token do usuário logado no cabeçalho da requisição
        }) // Faz a requisição para a API
        alert("O Tema foi cadastrado com sucesso!") // Exibe um alerta
      } catch (error: any) { // Trata o erro
        if (error.toString().includes('403')) { // Se o erro for 403
          handleLogout() // Desconecta o usuário
        } else { // Senão
          alert("Erro ao cadastrar o tema") // Exibe um alerta
        }
      }
    }

    setIsLoading(false) // Atualiza o estado de carregamento para falso
    retornar() // Retorna para a página de temas
  }

  return (
    <div className="container flex flex-col items-center justify-center mx-auto">
      <h1 className="text-4xl text-center my-8">
        {id === undefined ? 'Cadastrar Tema' : 'Editar Tema'}
      </h1>

      <form className="w-1/2 flex flex-col gap-4" onSubmit={gerarNovoTema}>
        <div className="flex flex-col gap-2">
          <label htmlFor="descricao">Descrição do Tema</label>
          <input
            type="text"
            placeholder="Descreva aqui seu tema"
            name="descricao"
            className="border-2 border-slate-700 rounded p-2"
            value={tema.descricao}
            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
          />
        </div>
        <button
          className="rounded text-slate-100 bg-indigo-400
                  hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center"
          type="submit">
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
          }
        </button>
      </form>
    </div>
  )
}

export default FormTema