import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());



app.get('/continentes', async (req: Request, res: Response) => {
  try {
    const continentes = await prisma.continente.findMany();
    res.json(continentes);
  } catch (error) {
    console.error("❌ ERRO AO BUSCAR CONTINENTES NO BANCO:", error);
    res.status(500).json({ erro: 'Falha ao buscar os continentes' });
  }
});

app.post('/continentes', async (req: Request, res: Response) => {
  try {
    const { nome, descricao } = req.body;
    const novo = await prisma.continente.create({ data: { nome, descricao } });
    res.status(201).json(novo);
  } catch (error) {
    console.error("❌ ERRO AO CRIAR CONTINENTE NO BANCO:", error);
    res.status(500).json({ erro: 'Falha ao criar o continente' });
  }
});

app.put('/continentes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    const updated = await prisma.continente.update({
      where: { id: Number(id) },
      data: { nome, descricao },
    });
    res.json(updated);
  } catch (error) {
    console.error("❌ ERRO AO ATUALIZAR CONTINENTE:", error);
    res.status(500).json({ erro: 'Falha ao atualizar o continente' });
  }
});

app.delete('/continentes/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.continente.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("❌ ERRO AO DELETAR CONTINENTE:", error);
    res.status(500).json({ erro: 'Falha ao eliminar o continente. Verifique dependências.' });
  }
});


app.get('/continentes', async (req: Request, res: Response) => {
  try {
    const continentes = await prisma.continente.findMany({
      include: {
        _count: {
          select: { paises: true } 
        }
      }
    });

   
    const resposta = continentes.map(c => ({
      ...c,
      paises: c._count.paises 
    }));

    res.json(resposta);
  } catch (error) {
    console.error("❌ ERRO AO BUSCAR CONTINENTES:", error);
    res.status(500).json({ erro: 'Falha ao buscar os continentes' });
  }
});


app.get('/paises', async (req: Request, res: Response) => {
  try {
    const paises = await prisma.pais.findMany({
      include: { continente: true } 
    });
    res.json(paises);
  } catch (error) {
    console.error("❌ ERRO AO BUSCAR PAÍSES:", error);
    res.status(500).json({ erro: 'Falha ao buscar os países.' });
  }
});

app.post('/paises', async (req: Request, res: Response) => {
  try {
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;
    const novoPais = await prisma.pais.create({
      data: {
        nome,
        populacao: Number(populacao),
        idioma_oficial,
        moeda,
        id_continente: Number(id_continente)
      },
    });
    res.status(201).json(novoPais);
  } catch (error) {
    console.error("❌ ERRO AO CRIAR PAÍS:", error);
    res.status(500).json({ erro: 'Falha ao criar o país.' });
  }
});

app.put('/paises/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, populacao, idioma_oficial, moeda, id_continente } = req.body;
    const atualizado = await prisma.pais.update({
      where: { id: Number(id) },
      data: {
        nome,
        populacao: Number(populacao),
        idioma_oficial,
        moeda,
        id_continente: Number(id_continente)
      },
    });
    res.json(atualizado);
  } catch (error) {
    console.error("❌ ERRO AO ATUALIZAR PAÍS:", error);
    res.status(500).json({ erro: 'Falha ao atualizar o país.' });
  }
});

app.delete('/paises/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.pais.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("❌ ERRO AO DELETAR PAÍS:", error);
    res.status(500).json({ erro: 'Falha ao deletar o país.' });
  }
});


app.get('/cidades', async (req: Request, res: Response) => {
  try {
    const cidades = await prisma.cidade.findMany({
      include: { pais: true } 
    });
    res.json(cidades);
  } catch (error) {
    console.error("❌ ERRO AO BUSCAR CIDADES:", error);
    res.status(500).json({ erro: 'Falha ao buscar as cidades.' });
  }
});

app.post('/cidades', async (req: Request, res: Response) => {
  try {
    const { nome, populacao, latitude, longitude, id_pais } = req.body;
    const novaCidade = await prisma.cidade.create({
      data: {
        nome,
        populacao: Number(populacao),
        latitude: Number(latitude),
        longitude: Number(longitude),
        id_pais: Number(id_pais)
      },
    });
    res.status(201).json(novaCidade);
  } catch (error) {
    console.error("❌ ERRO AO CRIAR CIDADE:", error);
    res.status(500).json({ erro: 'Falha ao criar a cidade.' });
  }
});

app.put('/cidades/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, populacao, latitude, longitude, id_pais } = req.body;
    const atualizado = await prisma.cidade.update({
      where: { id: Number(id) },
      data: {
        nome,
        populacao: Number(populacao),
        latitude: Number(latitude),
        longitude: Number(longitude),
        id_pais: Number(id_pais)
      },
    });
    res.json(atualizado);
  } catch (error) {
    console.error("❌ ERRO AO ATUALIZAR CIDADE:", error);
    res.status(500).json({ erro: 'Falha ao atualizar a cidade.' });
  }
});

app.delete('/cidades/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.cidade.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("❌ ERRO AO DELETAR CIDADE:", error);
    res.status(500).json({ erro: 'Falha ao deletar a cidade.' });
  }
});

app.get('/paises/:id_pais/cidades', async (req: Request, res: Response) => {
  try {
    const { id_pais } = req.params;
    const cidades = await prisma.cidade.findMany({ where: { id_pais: Number(id_pais) } });
    res.json(cidades);
  } catch (error) {
    console.error("❌ ERRO AO BUSCAR CIDADES DO PAÍS:", error);
    res.status(500).json({ erro: 'Falha ao procurar as cidades.' });
  }
});


app.get('/api-externa/pais/:nome', async (req: Request, res: Response) => {
  try {
    const { nome } = req.params;
    
    let resposta = await fetch(`https://restcountries.com/v3.1/translation/${nome}`);
    
    if (!resposta.ok) {
      resposta = await fetch(`https://restcountries.com/v3.1/name/${nome}`);
    }

    if (!resposta.ok) {
      res.status(404).json({ erro: `País '${nome}' não encontrado na base global.` });
      return;
    }

    const dados = await resposta.json();
    const paisData = Array.isArray(dados) ? dados[0] : dados;

    res.json({
      nomeOficial: paisData?.name?.official || nome,
      capital: paisData?.capital?.[0] || 'Não informada',
      bandeiraUrl: paisData?.flags?.png || paisData?.flags?.svg || '',
      regiao: paisData?.region || 'Desconhecida',
      mapaUrl: paisData?.maps?.googleMaps || ''
    });
  } catch (error) {
    console.error("❌ ERRO API EXTERNA PAÍS:", error);
    res.status(500).json({ erro: 'Erro interno ao conectar com a API de Países' });
  }
});

app.get('/api-externa/clima', async (req: Request, res: Response) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      res.status(400).json({ erro: 'É necessário informar latitude e longitude' });
      return;
    }

    const resposta = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    if (!resposta.ok) {
      res.status(400).json({ erro: 'Não foi possível obter o clima para estas coordenadas' });
      return;
    }

    const dados = await resposta.json();
    
    res.json({
      temperatura: dados.current_weather.temperature,
      velocidadeVento: dados.current_weather.windspeed,
      codigoClima: dados.current_weather.weathercode
    });
  } catch (error) {
    console.error("❌ ERRO API EXTERNA CLIMA:", error);
    res.status(500).json({ erro: 'Erro ao conectar com a API de Clima' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Servidor rodando com sucesso na porta 3000!');
});