/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext";
import Tema from "../../../models/Tema";
import { atualizar, buscar, cadastrar } from "../../../services/Service";

function FormTema() {

  // Hook para gerenciar a navegação do usuário
  const navigate = useNavigate(); // Hook de navegação

  // Váriavel de Estado que recebe os dados de um Tema
  const [tema, setTema] = useState<Tema>({} as Tema); // Estado para armazenar o tema

  // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para armazenar o status de carregamento

  // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
  const { usuario, handleLogout } = useContext(AuthContext); // Dados do usuário logado 
  const token = usuario.token // Token do usuário logado

  // Hook que pega uma variavel que foi passada pela rota do navegador - similar ao PathVariable do back
  const { id } = useParams<{ id: string }>(); // Parâmetro de rota


  // Função que chama a service buscar() para receber os dados de um Tema especifico - usada na atualização
  async function buscarPorId(id: string) { // Função para buscar um tema por id
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

  // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
  useEffect(() => { // Hook de efeito
    if (token === '') { // Se o token estiver vazio
      alert("Você precisa estar logado!") // Exibe um alerta
      navigate('/') // Navega para a página inicial
    }
  }, [token])


  // Esse useEffect verifica se existe um ID, se sim, 
  // quer dizer que estamos fazendo uma atualização e chamamos a função buscarPorId
  useEffect(() => { // Hook de efeito
    if (id !== undefined) { // Se o id for diferente de indefinido
      buscarPorId(id) // Busca o tema pelo id 
    }
  }, [id])


  // Função que pega os dados do Formulário e atualiza a Variavel de Estado Tema
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) { // Função para atualizar o estado
    setTema({
      ...tema, // Espalha o estado atual
      [e.target.name]: e.target.value // Atualiza o estado com o valor do campo
    })
  }

  // Função que envia o usuário para a rota de listagem de temas
  function retornar() { // Função para retornar
    navigate('/temas') // Navega para a página de temas 
  }

  // Função que realiza o Cadastro ou Atualização de um Tema
  async function gerarNovoTema(e: ChangeEvent<HTMLFormElement>) { // Função para gerar um novo tema
    e.preventDefault() // Impede o Recarregamento do Formulário
    setIsLoading(true) // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo


    // Esse IF verifica se vamos fazer uma atualização ou cadastro de tema
    if (id !== undefined) { // Se o id for diferente de indefinido 
      try { // Tenta fazer a requisição
        await atualizar(`/temas`, tema, setTema, { // Chama a service de Atualizar
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
    } else {  // Se o ID não existir é um processo de cadastro
      try { //  Tenta fazer a requisição 
        await cadastrar(`/temas`, tema, setTema, { // Chama a service de Cadastrar
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

    setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
    retornar() // Chama a função retornar()
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
          {isLoading ? // Se houver um carregamento, mostre um Loader
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            // Se ÑÃO houver ID, o texto que aparece é Cadastrar, senão, o texto é Atualizar
            <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
          }
        </button>
      </form>
    </div>
  )
}

export default FormTema