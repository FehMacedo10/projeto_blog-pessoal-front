/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'; // Importando o useState e useEffect
import { useNavigate } from 'react-router-dom'; // Importando o hook de navegação
import Usuario from '../../models/Usuario'; // Importando a interface Usuario
import { cadastrarUsuario } from '../../services/Service'; // Importando a função de cadastro de usuário
import './Cadastro.css'; // Importando o arquivo de estilização
import { RotatingLines } from 'react-loader-spinner'; // Importando o componente de loading
import { ToastAlerta } from '../../utils/ToastAlert';

function Cadastro() { // Função que representa a tela de cadastro

  // Hook para gerenciar a navegação do usuário
  const navigate = useNavigate(); // Instanciando o hook de navegação

  // Variavel de Estado que serve para indicar que existe um carregamento ocorrendo
  const [isLoading, setIsLoading] = useState<boolean>(false); // Criando um estado para o loading

  // Váriavel de Estado que recebe a verificação de Senha
  const [confirmaSenha, setConfirmaSenha] = useState<string>(""); // Criando um estado para a confirmação de senha

  // Váriavel de Estado que recebe os dados do usuario
  const [usuario, setUsuario] = useState<Usuario>({ // Criando um estado para o usuário com os campos vazios
    id: 0,
    nome: "",
    usuario: "",
    senha: "",
    foto: ""
  });



  // Função que quando a Variavel Usuario mudar de Estado
  // irá chamar uma função onde caso o ID de Usuário for diferente de 0
  // chamará a função retornar()
  useEffect(() => { // Função que é executada toda vez que a tela é renderizada
    if (usuario.id !== 0) { // Verifica se o id do usuário é diferente de 0
      retornar() // Chama a função retornar
    }
  }, [usuario]) // Parâmetro que indica quando a função deve ser executada

  // Função que usa o Hook Navigate para enviar o usuário para a rota de Login
  function retornar() { // Função que navega para a tela de login
    navigate('/login') // Navega para a tela de login
  }

  // Função que pega os dados do Formulário e atualiza a Variavel de Estado Usuario
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) { // Função que atualiza o estado do usuário
    setUsuario({ // Atualiza o estado do usuário
      ...usuario, // Mantém os valores antigos do usuário e atualiza o campo que foi alterado
      /// ... -> spread operator -> copia os valores do objeto
      /*
        id
        nome
        senha
        usuario
        foto      
      */
      // nome : "Root"
      [e.target.name]: e.target.value // Atualiza o campo que foi alterado
    })
  }

  // Função que pega os dados do Campo Confirmar Senha e atualiza a Variavel de Estado Confirma-Senha
  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) { // Função que atualiza o estado da confirmação de senha
    setConfirmaSenha(e.target.value) // Atualiza o estado da confirmação de senha
  }

  // Função que realiza o Cadastro do Usuário
  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) { // Função que cadastra um novo usuário
    e.preventDefault() // Impede o Recarregamento do Formulário

    // Verifica se as senhas batem e tem mais de 8 caracteres
    if (confirmaSenha === usuario.senha && usuario.senha.length >= 8) { // Verifica se a senha e a confirmação de senha são iguais
      setIsLoading(true) // Atualiza a Variavel de Estado, indicando que existe uma carregamento ocorrendo


      try { // Tenta executar uma função que pode retornar erro
        await cadastrarUsuario('/usuarios/cadastrar', usuario, setUsuario)  // Chama a Service cadastrarUsuario
        ToastAlerta("Usuário cadastrado com sucesso!", "sucesso") // Exibe um alerta de sucesso

      } catch (error) { // Tratamento de erro
        ToastAlerta("Erro ao cadastrar usuário!", "erro") // Exibe um alerta de erro

      }
    } else { // Caso as senhas não sejam iguais
      ToastAlerta("Dados do usuário inconsistentes! Verifiquem as informações do cadastro", "info") // Exibe um alerta de erro
      setUsuario({ ...usuario, senha: "" }) // Limpa o campo de senha
      setConfirmaSenha("") // Limpa o campo de confirmação de senha
    }

    setIsLoading(false) // Atualiza a Variavel de Estado, indicando que o carregamento parou
  }

  return (
    <>
      <div className='grid grid-cols-1 lg:grid-cols-2 h-screen place-items-center font-bold'>
        <div className='fundoCadastro hidden lg:block'></div>
        <form className='flex justify-center items-center flex-col w-2/3 gap-3'
          onSubmit={cadastrarNovoUsuario}>
          <h2 className='text-slate-900 text-5xl'>Cadastrar</h2>
          <div className='flex flex-col w-full'>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id='nome'
              name='nome'
              placeholder='Nome'
              className='border-2 border-slate-700 rounded p-2'
              value={usuario.nome} // Exibe o valor do nome
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id='usuario'
              name='usuario'
              placeholder='Usuário'
              className='border-2 border-slate-700 rounded p-2'
              value={usuario.usuario} // Exibe o valor do usuário
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)} // Chama a função de atualização de estado
            />
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor="foto">Foto</label>
            <input
              type="text"
              id='foto'
              name='foto'
              placeholder='Foto'
              className='border-2 border-slate-700 rounded p-2'
              value={usuario.foto} // Exibe o valor da foto
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)} // Chama a função de atualização de estado
            />
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id='senha'
              name='senha'
              placeholder='Senha'
              className='border-2 border-slate-700 rounded p-2'
              value={usuario.senha} // Exibe o valor da senha
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)} // Chama a função de atualização de estado
            />
          </div>
          <div className='flex flex-col w-full'>
            <label htmlFor="confirmarSenha">Confirmar Senha</label>
            <input
              type="password"
              id='confirmarSenha'
              name='confirmarSenha'
              placeholder='Confirmar Senha'
              className='border-2 border-slate-700 rounded p-2'
              value={confirmaSenha} // Exibe o valor da confirmação de senha
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleConfirmarSenha(e)} // Chama a função de confirmação de senha
            />
          </div>
          <div className='flex justify-around w-full gap-8'>
            <button
              className='rounded text-white bg-red-400 hover:bg-red-700 w-1/2 py-2'
              onClick={retornar}>
              Cancelar
            </button>
            <button
              type='submit'
              className='rounded text-white bg-indigo-400 hover:bg-indigo-900 w-1/2 py-2 flex justify-center'>
              {isLoading ? <RotatingLines // Componente de loading
                strokeColor='white'
                strokeWidth='5'
                animationDuration='0.75'
                width='24'
                visible={true} // Exibe o componente de loading
              /> :
                <span>Cadastrar</span>
              }
            </button>
          </div>
        </form>
      </div>
    </>
  )
} // O formulário de cadastro de usuário

export default Cadastro