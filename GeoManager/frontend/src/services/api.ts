const API_URL = 'http://localhost:3000';

export const apiService = {

  getContinentes: async () => {
    const response = await fetch(`${API_URL}/continentes`);
    if (!response.ok) throw new Error('Erro ao buscar continentes');
    return response.json();
  },

  createContinente: async (nome: string, descricao: string) => {
    const response = await fetch(`${API_URL}/continentes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao }),
    });
    if (!response.ok) throw new Error('Erro ao criar continente');
    return response.json();
  },

  updateContinente: async (id: number, nome: string, descricao: string) => {
    const response = await fetch(`${API_URL}/continentes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, descricao }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar continente');
    return response.json();
  },

  deleteContinente: async (id: number) => {
    const response = await fetch(`${API_URL}/continentes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar continente');
    return;
  },

  getPaises: async () => {
    const response = await fetch(`${API_URL}/paises`);
    if (!response.ok) throw new Error('Erro ao buscar países');
    return response.json();
  },

  createPais: async (dados: { nome: string; populacao: number; idioma_oficial: string; moeda: string; id_continente: number }) => {
    const response = await fetch(`${API_URL}/paises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error('Erro ao criar país');
    return response.json();
  },

  updatePais: async (id: number, dados: { nome: string; populacao: number; idioma_oficial: string; moeda: string; id_continente: number }) => {
    const response = await fetch(`${API_URL}/paises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error('Erro ao atualizar país');
    return response.json();
  },

  deletePais: async (id: number) => {
    const response = await fetch(`${API_URL}/paises/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar país');
    return;
  },

  getPaisInfoExterna: async (nome: string) => {
    const response = await fetch(`${API_URL}/api-externa/pais/${nome}`);
    if (!response.ok) throw new Error('País não encontrado na API Externa');
    return response.json();
  },


  getCidades: async () => {
    const response = await fetch(`${API_URL}/cidades`);
    if (!response.ok) throw new Error('Erro ao buscar cidades');
    return response.json();
  },

  createCidade: async (dados: { nome: string; populacao: number; latitude: number; longitude: number; id_pais: number }) => {
    const response = await fetch(`${API_URL}/cidades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error('Erro ao criar cidade');
    return response.json();
  },

  updateCidade: async (id: number, dados: { nome: string; populacao: number; latitude: number; longitude: number; id_pais: number }) => {
    const response = await fetch(`${API_URL}/cidades/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error('Erro ao atualizar cidade');
    return response.json();
  },

  deleteCidade: async (id: number) => {
    const response = await fetch(`${API_URL}/cidades/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar cidade');
    return;
  },


  getClima: async (lat: number, lon: number) => {
    const response = await fetch(`${API_URL}/api-externa/clima?lat=${lat}&lon=${lon}`);
    if (!response.ok) throw new Error('Erro ao buscar clima da cidade');
    return response.json();
  }
};