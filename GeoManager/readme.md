# GeoManager 🌍

> **Atividade de Programação Web, professor André Olímpio  — FATEC São José dos Campos (Prof. Jessen Vidal)** > Sistema de Alta Performance para Gestão Geográfica Relacional e Monitoramento Global em Tempo Real.

O **GeoManager** é uma plataforma completa (*Full-Stack*) projetada para gerenciar dados geográficos estruturados em uma hierarquia rígida: **Continentes → Países → Cidades**. O ecossistema vai além de um CRUD convencional, integrando-se diretamente a APIs globais para enriquecimento automático de dados, trazendo bandeiras oficiais e condições climáticas em tempo real.

---

## 📄 1. Documentação e Mídia

Abaixo encontram-se os acessos aos arquivos oficiais de validação e homologação do software armazenados no Google Drive:

* 🎥 **Demonstração em Vídeo:** [Acessar Vídeo de Apresentação do Sistema](https://drive.google.com/file/d/1nsBOcjb4NZ-AnoxAeaB5HQeL8CrNgwmW/view?usp=sharing)
* 📑 **Plano e Relatório de Testes:** [Acessar Documentação de Testes](https://drive.google.com/file/d/1S8LnIfrJQoFIxTcQuDQ5eq523PrLEc9f/view?usp=sharing)
* 📚 **Enunciado do desafio:** [Acessar Documentação de Testes](https://drive.google.com/file/d/1g7T6g6LAjWPnpwnEdxcObVLhuk7AWZTq/view?usp=sharing)
---

## ⚡ 2. Funcionalidades Principais

### 📊 Painel Principal (Dashboard)
* **Métricas em Tempo Real:** Indicadores reativos que exibem o total absoluto de continentes, países e cidades salvos na base de dados.
* **Cálculo Demográfico Automatizado:** Consolidação matemática da população mundial com formatação dinâmica (ex: 4.10B para bilhões).
* **Gráficos Dinâmicos:** Gráfico de barras dos países mais populosos e distribuição por continente, gerados a partir de cálculos em tempo real.

### 🌐 Módulos (Continentes, Países e Cidades)
* **Operações CRUD Completas:** Gestão total de registros com integridade referencial mantida pelo Prisma ORM.
* **Integração FlagsAPI:** Renderização dinâmica de bandeiras em alta resolução (`64px`) mapeadas por siglas ISO.
* **Integração Open-Meteo API:** Consulta de clima em tempo real baseada em coordenadas (Latitude/Longitude) com interpretação meteorológica legível.

---

## 🛠️ 3. Tecnologias Utilizadas

* **Frontend:** React 18, TypeScript, Vite, Lucide React.
* **Backend:** Node.js, Express, Prisma ORM (v7.8.0), PostgreSQL (Supabase).
* **APIs Externas:** REST Countries (Bandeiras), Open-Meteo (Clima).

---

## 📋 4. Requisitos para Rodar
* [Node.js](https://nodejs.org/) (Versão 18+)
* Banco de dados PostgreSQL (Supabase recomendado)

---

## ⚙️ 5. Configuração do Backend

### Arquivo `.env` (na pasta `/backend`)
```env
DATABASE_URL="postgres://usuario:senha@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://usuario:senha@host:5432/postgres"
```

### Arquivo prisma.config.ts (na pasta /backend)
import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DIRECT_URL as string,
  },
});

--- 

## 🚀 6. Como Rodar

cd backend
npx prisma db push
npx prisma generate

Após esses comandos, abra dois terminais

**terminal backend:**

cd backend
npm install
npm run dev


**terminal frontend:**

cd frontend
npm install
npm run dev