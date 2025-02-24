/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import CardPostagens from "../cardpostagens/CardPostagens";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import Postagem from "../../../models/Postagem";
import { buscar } from "../../../services/Service";
import { DNA } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlert";


function ListaPostagens() {

  // Hook para gerenciar a navegação do usuário
  const navigate = useNavigate(); // Hook do React Router DOM para navegação entre páginas

  // Váriavel de Estado que recebe as Postagens do back em um Array
  const [postagens, setPostagem] = useState<Postagem[]>([]); // Estado para armazenar as postagens

  // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
  const { usuario, handleLogout } = useContext(AuthContext); // Contexto de autenticação 
  const token = usuario.token;// Token de autenticação

  // Função que chama a service buscar() para receber e guardar as Postagens
  async function buscarPostagens() { // Função para buscar as postagens
    try {
      await buscar('/postagens', setPostagem, { // Faz a requisição para a API
        headers: { // Define o cabeçalho da requisição
          Authorization: token // Define o token de autenticação
        }
      })
    } catch (error: any) { // Tratamento de erro
      if (error.toString().includes('403')) { // Verifica se o erro é de autenticação
        handleLogout();// Desloga o usuário
      }
    }
  }

  // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
  useEffect(() => { // Hook do React para executar a função uma única vez
    if (token === '') { // Verifica se o token está vazio
      ToastAlerta("Você precisa estar logado", "info"); //  Exibe um alerta
      navigate('/'); // Redireciona para a página inicial
    }
  }, [token]) // Dependência do hook

  // Esse useEffect dispara a função de busca sempre quando o componente é renderizado
  useEffect(() => { // Hook do React para executar a função uma única vez
    buscarPostagens(); // Chama a função buscarPostagns
  }, [postagens.length]); // Dependência

  return (
    <>
      {postagens.length === 0 && ( // Se não houver temas ou estiver no momento de requisição mostre um Loader
        <DNA
          visible={true}
          height="200"
          width="200"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper mx-auto"
        />
      )}
      <div className="flex justify-center w-full my-4">
        <div className="container flex flex-col mx-2">
          <div className="container mx-auto my-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {postagens.map((postagem) => ( // Mapeia as postagens
              <CardPostagens key={postagem.id} postagem={postagem} /> // Renderiza o componente CardPostagens
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ListaPostagens;