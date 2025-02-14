import axios from "axios";

const api = axios.create({ // Cria uma instância do axios
  baseURL: "https://blogpessoal-xy3s.onrender.com" // Define a URL base da API
})

export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => { // Função para cadastrar um usuário
  const resposta = await api.post(url, dados) // Faz a requisição para a API
  setDados(resposta.data) // Atualiza o estado com a resposta da API
}

export const login = async (url: string, dados: Object, setDados: Function) => {  // Função para logar um usuário
  const resposta = await api.post(url, dados) // Faz a requisição para a API
  setDados(resposta.data) // Atualiza o estado com a resposta da API
}

// função assíncrona -> async: permite que a função seja assíncrona; await: espera a resposta da requisição
// o que é função assíncrona? -> é uma função que não bloqueia a execução do código
// data -> é o corpo da resposta da requisição