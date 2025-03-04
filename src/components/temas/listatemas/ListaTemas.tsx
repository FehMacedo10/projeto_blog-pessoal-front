/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Tema from "../../../models/Tema";
import CardTemas from "../cardtemas/CardTemas";
import { buscar } from "../../../services/Service";
import { ToastAlerta } from "../../../utils/ToastAlert";

function ListaTemas() {

  // Hook para gerenciar a navegação do usuário
  const navigate = useNavigate(); // Importa a função useNavigate do react-router-dom

  // Váriavel de Estado que recebe os temas do back em um Array
  const [temas, setTemas] = useState<Tema[]>([]); // Inicializa o estado temas como um array de Tema

  // useContext acessa nosso contexto, buscando dele as informações necessárias para esse Componente
  const { usuario, handleLogout } = useContext(AuthContext); // Importa o contexto de autenticação
  const token = usuario.token; // Atribui o token do usuário

  // Função que chama a service buscar() para receber e guardar os temas
  async function buscarTemas() { // Função para buscar os temas
    try {
      await buscar('/temas', setTemas, {
        headers: { 'Authorization': token }
      })
    } catch (error: any) { // Tratamento de erro
      if (error.toString().includes('403')) { // Se o erro for 403
        handleLogout(); // Chama a função handleLogout
      }
    }
  }

  // Esse useEffect verifica se quando o usuário acessou esse componente, ele tem um token válido
  useEffect(() => {
    if (token === '') { // Se o token for vazio
      ToastAlerta("Você precisa estar logado!", "info")
      navigate("/")   // Navega para a rota inicial
    }
  }, [token]) // Dependência do useEffect


  // Esse useEffect dispara a função de busca sempre quando o componente é renderizado
  useEffect(() => { // Hook de efeito -> useEffect
    buscarTemas(); // Chama a função buscarTemas
  }, [temas.length]) // Dependência do useEffect

  return (
    <>
      {temas.length === 0 && ( // Se não houver temas ou estiver no momento de requisição mostre um Loader
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
        <div className="container flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temas.map((tema) => ( // Map(): para cada item do array, o map() passa os dados para o Card
              <CardTemas key={tema.id} tema={tema} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ListaTemas