import axios from "axios";

export const api = axios.create({ // Cria uma instância do axios
  baseURL: import.meta.env.VITE_API_URL // Define a URL base da API
})

export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => { // Função para cadastrar um usuário
  const resposta = await api.post(url, dados) // Faz a requisição para a API
  setDados(resposta.data) // Atualiza o estado com a resposta da API
}

export const login = async (url: string, dados: Object, setDados: Function) => {  // Função para logar um usuário
  const resposta = await api.post(url, dados) // Faz a requisição para a API
  setDados(resposta.data) // Atualiza o estado com a resposta da API
}

export const buscar = async (url: string, setDados: Function, header: Object) => { // Função para buscar dados
  const resposta = await api.get(url, header)
  setDados(resposta.data)
}

export const cadastrar = async (url: string, dados: Object, setDados: Function, header: Object) => { // Função para cadastrar dados
  const resposta = await api.post(url, dados, header)
  setDados(resposta.data)
}

export const atualizar  = async (url: string, dados: Object, setDados: Function, header: Object) => { // Função para atualizar dados
  const resposta = await api.put(url, dados, header)
  setDados(resposta.data)
}

export const deletar = async (url: string, header: Object) => { // Função para deletar dados
  await api.delete(url, header);
}

// função assíncrona -> async: permite que a função seja assíncrona; await: espera a resposta da requisição
// o que é função assíncrona? -> é uma função que não bloqueia a execução do código
// data -> é o corpo da resposta da requisição