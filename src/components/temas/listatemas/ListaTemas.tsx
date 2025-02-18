
import { useContext, useEffect, useState } from "react";
import { DNA } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import Tema from "../../../models/Tema";
import CardTemas from "../cardtemas/CardTemas";
import { buscar } from "../../../services/Service";

function ListaTemas() {

  const navigate = useNavigate(); // Importa a função useNavigate do react-router-dom

  const [temas, setTemas] = useState<Tema[]>([]); // Inicializa o estado temas como um array de Tema

  const { usuario, handleLogout } = useContext(AuthContext); // Importa o contexto de autenticação
  const token = usuario.token; // Atribui o token do usuário

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

  useEffect(() => {
    if (token === '') { // Se o token for vazio
      alert("Você precisa estar logado!")
      navigate("/")   // Navega para a rota inicial
    }
  }, [token]) // Dependência do useEffect

  useEffect(() => { // Hook de efeito -> useEffect
    buscarTemas(); // Chama a função buscarTemas
  }, [temas.length]) // Dependência do useEffect
  
  return (
    <>
    {temas.length === 0 && (
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
            {temas.map((tema) => (
              <CardTemas key={tema.id} tema={tema} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ListaTemas