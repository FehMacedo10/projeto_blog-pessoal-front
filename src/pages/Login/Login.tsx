import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { AuthContext } from '../../contexts/AuthContext';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import UsuarioLogin from '../../models/UsuarioLogin';
import { RotatingLines } from 'react-loader-spinner';

function Login() {

  const navigate = useNavigate(); // Navegação entre as páginas

  const { usuario, isLoading, handleLogin } = useContext(AuthContext) // Pegando as informações do contexto

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(// O estado do usuário que será logado
    {} as UsuarioLogin
  ) // O usuário que será logado

  useEffect(() => { // Verificando se o usuário já está logado
    if (usuario.token !== "") {
      navigate('/home') //  Redirecionando para a página home
    }
  }, [usuario]) // O useEffect será executado toda vez que o usuário mudar

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) { // Função para atualizar o estado
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value
    }) // Atualizando o estado do usuário
  }

  function login(e: ChangeEvent<HTMLFormElement>) { // Função para logar
    e.preventDefault() // Previnindo o comportamento padrão do formulário
    handleLogin(usuarioLogin) // Chamando a função de login
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen place-items-center font-bold">
        <form className="flex justify-center items-center flex-col w-1/2 gap-4" onSubmit={login}>
          <h2 className="text-slate-900 text-5xl">Entrar</h2>
          <div className="flex flex-col w-full">
            <label htmlFor="usuario">Usuário</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Usuário"
              className="border-2 border-slate-700 rounded p-2"
              value={usuarioLogin.usuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)} // Atualizando o estado do usuário
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="senha">Senha</label>
            <input
              type="text"
              id="senha"
              name="senha"
              placeholder="Senha"
              className="border-2 border-slate-700 rounded p-2"
              value={usuarioLogin.senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)} // Atualizando o estado do usuário
            />
          </div>
          <button
            type="submit"
            className="rounded bg-indigo-400 flex justify-center hover:bg-indigo-900
              text-white w-1/2 py-2">

            {isLoading ? <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true} 
            /> :
              <span>Entrar</span>
            }
          </button>

          <hr className='border-slate-800 w-full' />

          <p>
            Ainda não tem uma conta? {' '} 
            <Link to='/cadastro' className='text-indigo-800 hover:underline'>
              Cadastra-se
            </Link>
          </p>
        </form>
        <div className='fundoLogin hidden lg:block'></div>
      </div >
    </>
  );
}

export default Login;