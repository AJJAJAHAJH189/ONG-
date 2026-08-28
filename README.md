# ACESS-WEB — Plataforma Acessível de Apoio Comunitário e Inclusão

> **Aplicação Web Full-Stack para Conexão de Voluntários a Idosos, PCDs e Famílias Vulneráveis**  
> **Conformidade:** W3C WCAG 2.2 Nível AA | Meta Lighthouse: 100/100 | axe DevTools: 0 Violações

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Instalação e Execução Local](#-instalação-e-execução-local)
- [Arquitetura da Aplicação](#-arquitetura-da-aplicação)
- [Documentação dos Endpoints da API REST](#-documentação-dos-endpoints-da-api-rest)
- [Diretrizes de Acessibilidade Implementadas (WCAG 2.2 AA)](#-diretrizes-de-acessibilidade-implementadas-wcag-22-aa)
- [Resiliência para Conexões Rurais e Starlink](#-resiliência-para-conexões-rurais-e-starlink)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🌟 Visão Geral

A **ACESS-WEB** é uma plataforma comunitária projetada para conectar voluntários a pessoas idosas, com deficiência e famílias vulneráveis. O projeto foi estruturado com foco em **acessibilidade universal**, assegurando usabilidade para pessoas que dependem de leitores de tela (NVDA, VoiceOver), navegação exclusivamente por teclado, modos de alto contraste e conexões de rede instáveis ou de alta latência (redes rurais e via satélite Starlink).

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- **Node.js**: Versão 18.0.0 ou superior instalada ([Download Node.js](https://nodejs.org/)).
- **NPM**: Gerenciador de pacotes incluso com o Node.

### Passo a Passo

1. **Clonar o Repositório ou Extrair os Arquivos:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Iniciar o Servidor em Modo de Desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acessar a Aplicação:**
   Abra seu navegador e acesse:
   👉 **`http://localhost:3000`**

---

## 🏗️ Arquitetura da Aplicação

A aplicação adota uma arquitetura **Full-Stack integrada** com TypeScript em todas as camadas:

```
├── server.ts                 # Servidor Express.js (Rotas de API REST e integração com Vite)
├── src/
│   ├── main.tsx              # Ponto de entrada React 19
│   ├── App.tsx               # Orquestrador de estado global, abas e persistência resiliente
│   ├── index.css             # Configurações do Tailwind CSS e estilos universais de acessibilidade
│   ├── types.ts              # Definições de tipos e interfaces TypeScript
│   ├── components/
│   │   ├── Header.tsx                 # Cabeçalho semântico com navegação e status de rede
│   │   ├── AccessibilityToolbar.tsx   # Barra de acessibilidade (zoom, contraste, dislexia, voz)
│   │   ├── HelpRequestForm.tsx        # Formulário semântico com validação acessível
│   │   ├── VolunteerRegistrationForm.tsx # Cadastro de voluntários
│   │   ├── HelpRequestsBoard.tsx      # Central de chamados com filtros e tabela/cards acessíveis
│   │   ├── RequestDetailModal.tsx     # Diálogo modal com Focus Trap e restauração de foco
│   │   ├── StarlinkSimulator.tsx      # Simulador de latência de satélite e fila local offline
│   │   ├── AuditAndPitchGuide.tsx     # Checklist WCAG 2.2 AA e procedimentos de teste
│   │   ├── SkipLinks.tsx              # Links de salto de navegação rápida (Alt + 1 / Alt + 2)
│   │   ├── LiveAnnouncer.tsx          # Regiões vivas aria-live polite e assertive
│   │   └── Footer.tsx                 # Rodapé institucional com canais públicos de emergência
│   └── utils/
│       ├── api.ts            # Cliente HTTP com suporte a fallback e fila de sincronização
│       └── speech.ts         # Integração com Web Speech API para síntese de voz
```

### Tecnologias Utilizadas
- **Back-end:** Node.js, Express 4, TypeScript, `tsx` (execução TypeScript nativa).
- **Front-end:** React 19, Tailwind CSS v4, Lucide React (ícones acessíveis).
- **Empacotamento & Build:** Vite 6, esbuild.

---

## 📡 Documentação dos Endpoints da API REST

Todos os endpoints utilizam o prefixo `/api` e retornam dados em formato **JSON**. Em caso de erro, a API retorna respostas padronizadas com indicação do campo afetado e mensagem acessível.

### Formato Padrão de Erro Semântico
```json
{
  "error": true,
  "code": "INVALID_FIELD",
  "field": "nome_do_campo",
  "message": "Mensagem explicativa e contextualizada para leitor de tela."
}
```

---

### 1. Chamados de Ajuda (`/api/help-requests`)

#### `GET /api/help-requests`
Retorna a listagem de chamados cadastrados, ordenados do mais recente para o mais antigo.

- **Parâmetros de Consulta (Query Params - Opcionais):**
  - `category` (string): Filtra por categoria (`saude_medicamentos`, `alimentacao`, `transporte_acessivel`, `tecnologia_reparos`, etc.).
  - `status` (string): Filtra por status (`pendente`, `em_atendimento`, `concluido`).
  - `urgency` (string): Filtra por urgência (`baixa`, `media`, `alta`, `urgente`).
  - `search` (string): Busca textual por nome, cidade ou descrição.

- **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "id": "req-001",
      "name": "Dona Helena Silveira",
      "phone": "(11) 98765-4321",
      "city": "São Paulo",
      "state": "SP",
      "address": "Rua das Flores, 142 - Zona Leste",
      "category": "saude_medicamentos",
      "specificNeeds": ["idoso_apoio_digital", "mobilidade_reduzida"],
      "urgency": "alta",
      "description": "Preciso de auxílio para retirar medicamentos de uso contínuo.",
      "status": "pendente",
      "createdAt": "2026-08-27T10:00:00.000Z"
    }
  ]
  ```

---

#### `POST /api/help-requests`
Cadastra uma nova solicitação de ajuda com validação de dados em cada campo.

- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Maria de Lurdes",
    "phone": "(11) 98888-7777",
    "city": "São Paulo",
    "state": "SP",
    "address": "Av. Paulista, 1000",
    "category": "saude_medicamentos",
    "specificNeeds": ["deficiencia_visual"],
    "urgency": "alta",
    "description": "Necessito de acompanhamento presencial para exame oftalmológico."
  }
  ```

- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "success": true,
    "message": "Solicitação de ajuda cadastrada com sucesso!",
    "request": {
      "id": "req-1234",
      "name": "Maria de Lurdes",
      "status": "pendente",
      "createdAt": "2026-08-28T02:00:00.000Z"
    }
  }
  ```

- **Respostas de Erro (400 Bad Request):**
  - `INVALID_NAME`: Nome com menos de 3 caracteres.
  - `INVALID_PHONE`: Telefone inválido.
  - `INVALID_CITY`: Município não informado.
  - `INVALID_ADDRESS`: Endereço com menos de 5 caracteres.
  - `INVALID_DESCRIPTION`: Descrição com menos de 10 caracteres.

---

#### `PATCH /api/help-requests/:id/status`
Atualiza o status de atendimento de um chamado e associa ou desassocia um voluntário.

- **Parâmetros de Rota:**
  - `id` (string): Identificador único do chamado (ex.: `req-001`).

- **Corpo da Requisição (JSON):**
  ```json
  {
    "status": "em_atendimento",
    "assignedVolunteerId": "vol-001",
    "statusNotes": "Atendimento agendado para o próximo sábado."
  }
  ```

- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "success": true,
    "message": "Status do chamado atualizado para: em atendimento.",
    "request": { ... }
  }
  ```

- **Resposta de Erro (404 Not Found):**
  ```json
  {
    "error": true,
    "code": "REQUEST_NOT_FOUND",
    "message": "Chamado com ID req-999 não foi encontrado no sistema."
  }
  ```

---

### 2. Cadastro de Voluntários (`/api/volunteers`)

#### `GET /api/volunteers`
Retorna a listagem de voluntários cadastrados na rede solidária.

- **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "id": "vol-001",
      "name": "Mariana Costa",
      "email": "mariana.costa@ongacesso.org",
      "phone": "(11) 99123-4567",
      "city": "São Paulo",
      "state": "SP",
      "skills": ["tecnologia_reparos", "apoio_juridico_social"],
      "accessibilityExperience": ["NVDA / VoiceOver", "Libras Básico"],
      "availability": "finais_de_semana",
      "bio": "Desenvolvedora front-end com foco em acessibilidade.",
      "createdAt": "2026-08-01T12:00:00.000Z",
      "activeRequestsCount": 1
    }
  ]
  ```

---

#### `POST /api/volunteers`
Registra um novo voluntário com verificação de duplicidade de e-mail.

- **Corpo da Requisição (JSON):**
  ```json
  {
    "name": "Lucas Fernandes",
    "email": "lucas.fernandes@exemplo.com",
    "phone": "(11) 97777-6666",
    "city": "Campinas",
    "state": "SP",
    "skills": ["transporte_acessivel"],
    "accessibilityExperience": ["Treinamento em Mobilidade"],
    "availability": "manha",
    "bio": "Disponível para transporte e acompanhamento de consultas."
  }
  ```

- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "success": true,
    "message": "Bem-vindo(a), Lucas Fernandes! Seu cadastro como voluntário(a) solidário(a) foi concluído com sucesso.",
    "volunteer": { ... }
  }
  ```

- **Resposta de Conflito (409 Conflict):**
  ```json
  {
    "error": true,
    "code": "VOLUNTEER_ALREADY_REGISTERED",
    "message": "Este e-mail já está cadastrado como voluntário em nossa plataforma.",
    "field": "email"
  }
  ```

---

### 3. Monitoramento e Estatísticas

#### `GET /api/stats`
Retorna métricas consolidadas sobre os atendimentos e voluntários cadastrados.

- **Resposta (200 OK):**
  ```json
  {
    "totalRequests": 12,
    "pendingRequests": 5,
    "inProgressRequests": 3,
    "completedRequests": 4,
    "totalVolunteers": 8,
    "ruralZoneRequests": 3
  }
  ```

#### `GET /api/health`
Endpoint de checagem de saúde e verificação de latência do serviço.

- **Resposta (200 OK):**
  ```json
  {
    "status": "ok",
    "service": "Acesso Solidario API",
    "wcagVersion": "2.2 AA",
    "timestamp": "2026-08-28T02:00:00.000Z"
  }
  ```

---

## ♿ Diretrizes de Acessibilidade Implementadas (WCAG 2.2 AA)

1. **Estrutura Semântica HTML5:** Uso de `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>` com `aria-label` e hierarquia única de headings (`<h1>`–`<h3>`).
2. **Formulários Acessíveis:** Associação estrita de `<label htmlFor="...">`, agrupamento de dados com `<fieldset>` e `<legend>`, identificação de erros dinâmicos com `aria-invalid="true"` e `aria-describedby`.
3. **Navegação 100% por Teclado:**
   - **Skip Links (WCAG 2.4.1):** Atalhos rápidos no topo (`Alt + 1` para conteúdo principal).
   - **Focus Trap em Modais (ARIA APG):** Foco mantido dentro de diálogos abertos, fechamento via tecla `Esc` e restauração precisa para o botão disparador.
   - **Indicador de Foco Visível (WCAG 2.4.7):** `:focus-visible` com contorno de **3px sólido e 3px de offset**.
4. **Perceptibilidade Visual e Sonora:**
   - Relação de contraste superior a **4.5:1** em texto padrão e superior a **7:1** no modo de Alto Contraste (preto/amarelo).
   - Modo de Leitura Fácil (OpenDyslexic e espaçamento expandido).
   - Suporte a `prefers-reduced-motion` e botão de desativação de animações.
   - Leitor de voz sintetizada integrado via `Web Speech API`.
5. **Regiões Vivas (`aria-live`):**
   - `aria-live="polite"` para notificações e contadores de filtros.
   - `aria-live="assertive"` com `role="alert"` para validação de erros críticos.

---

## 🛰️ Resiliência para Conexões Rurais e Starlink

A plataforma inclui uma camada de tolerância a falhas para conexões rurais via satélite (Starlink) sujeitas a alta latência ou interrupções climáticas:
- **Fila Local Resiliente (`localStorage`):** Em caso de falha de conexão ou modo offline simulado, chamados são armazenados localmente no navegador e sincronizados automaticamente com o servidor assim que a rede é restabelecida.
- **Simulador de Latência:** Ferramenta interativa para teste em latências de 40ms a 250ms (simulação de chuva e perda de pacotes) com feedback em tempo real.

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor Express e Vite com compilação TypeScript em tempo real |
| `npm run build` | Compila o front-end estático no diretório `dist/` e empacota o servidor em `dist/server.cjs` |
| `npm run start` | Executa a versão compilada em ambiente de produção |
| `npm run lint` | Executa a verificação estática de tipos com o compilador TypeScript (`tsc --noEmit`) |
| `npm run clean` | Remove artefatos de compilação anteriores |
