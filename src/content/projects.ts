// ============================================================================
//  PROJETOS — fonte única dos 10 projetos do portfólio, do mais recente ao
//  mais antigo.
//
//  Todas as informações foram verificadas nos repositórios (README, código,
//  dependências) e nas demonstrações publicadas em 13/10/2026. O Sistema
//  Pilates, de repositório privado, foi verificado no código e executado
//  localmente com dados fictícios. Ao editar:
//   • não invente funcionalidades nem URLs de demonstração;
//   • as imagens são referenciadas por ID (veja images.generated.json);
//   • as tecnologias por ID (veja technologies.ts).
// ============================================================================

import type { ImageId } from "./images";
import type { TechId } from "./technologies";

export type ProjectSlug =
  | "vieira"
  | "conveniencia"
  | "pilates"
  | "fotos"
  | "iaworkout"
  | "cyborg"
  | "starbucks"
  | "b7burger"
  | "agencia"
  | "medcenter";

/** Cada projeto tem uma composição própria na página inicial. */
export type SpreadLayout =
  | "modules"
  | "stack"
  | "portals"
  | "filmstrip"
  | "pipeline"
  | "hud"
  | "magazine"
  | "plate"
  | "triptych"
  | "browser";

export interface Shot {
  image: ImageId;
  alt: string;
  caption: string;
  device: "desktop" | "mobile" | "page";
}

export interface ProjectModule {
  id: string;
  label: string;
  description: string;
  shot: Shot;
}

export interface PipelineStep {
  title: string;
  detail: string;
}

/** Repositório público (com link) ou privado (sem link; o aviso aparece no lugar). */
type RepoLink = { repo: string; privateRepo?: never } | { repo?: never; privateRepo: string };

export interface Project {
  slug: ProjectSlug;
  number: string;
  name: string;
  /** Nome do repositório no GitHub. */
  repoName: string;
  kind: "sistema" | "interface";
  category: string;
  /** Data de criação do repositório (API do GitHub) ou, se ele for privado, do primeiro commit. */
  createdAt: string;
  tagline: string;
  summary: string[];
  features: string[];
  stack: Array<{ id: TechId; note?: string }>;
  links: RepoLink & {
    demo?: { url: string; host: "Vercel" | "GitHub Pages"; note?: string };
  };
  /** Galeria (a primeira imagem é a capa). */
  shots: Shot[];
  /** De onde vêm as imagens (exibido junto da galeria). */
  imageSource: string;
  /** Barra de endereço das capturas feitas fora de uma demo publicada. */
  captureAddress?: string;
  /** Observações públicas de contexto/transparência. */
  notes?: string[];
  /**
   * Identidade visual do projeto dentro do portfólio.
   * color: cor-assinatura (preenchimentos) · ink: texto sobre color ·
   * text: cor-assinatura legível como texto sobre o papel (#f3f2ed) ·
   * surface/onSurface: painel do projeto e o texto sobre ele.
   * Todas as combinações de texto têm contraste mínimo de 4,5:1.
   */
  accent: { color: string; ink: string; text: string; surface: string; onSurface: string };
  layout: SpreadLayout;
  modules?: ProjectModule[];
  pipeline?: PipelineStep[];
  /** Ficha técnica (exibida na página do projeto e no modo técnico). */
  sheet: {
    languages: string[];
    architecture: string[];
    persistence: string;
    deploy: string;
    files?: string[];
    verification: string[];
  };
}

const GH = "https://github.com/AleckDevv";

const CAPTURE_NOTE = "Capturas feitas na demonstração publicada em 13/10/2026.";

export const projects: Project[] = [
  // ------------------------------------------------------------------ 01
  {
    slug: "vieira",
    number: "01",
    name: "Vieira Gestão Operacional",
    repoName: "sistema_prototipo_vieira",
    kind: "sistema",
    category: "Sistema web · Gestão de frota (protótipo)",
    createdAt: "2026-10-09",
    tagline:
      "Protótipo navegável de um sistema de gestão de frota: 10 módulos integrados, perfis com permissões simuladas e nenhum framework.",
    summary: [
      "Protótipo de um Sistema de Gestão Operacional de Frota feito para apresentação à diretoria da Vieira Serviços e Transportes. Cobre o dia a dia da operação — veículos, manutenção, compras, estoque, abastecimento e despesas — com módulos que se conectam: aprovar e receber uma compra gera entrada no estoque; aplicar uma peça em uma ordem de serviço dá baixa uma única vez; cada abastecimento atualiza a quilometragem e lança a despesa.",
      "Foi construído com HTML, CSS e JavaScript puro em módulos ES6, sem frameworks e sem backend. Os dados são fictícios, gerados a cada demonstração e salvos no navegador.",
    ],
    features: [
      "10 módulos integrados: dashboard, veículos, manutenção, compras, estoque, peças por veículo, abastecimento, despesas, relatórios e usuários",
      "8 perfis de demonstração (diretor, comprador, gerente, financeiro, dois fiscais, operacional e chefe de oficina) com menus e ações adaptados às permissões simuladas",
      "Fluxo de compras com aprovação exclusiva da diretoria, pedido, recebimento com entrada no estoque e despesa vinculada",
      "Ordens de serviço integradas ao estoque e controle individual de pneus e baterias",
      "Abastecimento com cálculo automático, bloqueio de quilometragem menor que a anterior e consumo por trecho",
      "Despesas sem dupla contagem e 10 relatórios com filtros, exportação CSV e versão para impressão",
      "Tema claro/escuro, rotas com links diretos (#/compras/SC-0013) e layout responsivo de 320 px a monitores largos",
    ],
    stack: [
      { id: "javascript", note: "Módulos ES6, sem frameworks: telas em js/modules e regras em js/services." },
      { id: "html", note: "Shell único da aplicação (index.html) e página 404." },
      { id: "css", note: "Identidade visual, tema escuro, impressão e tabelas que viram cartões no celular." },
      { id: "localstorage", note: "Estado da demonstração salvo no navegador de cada visitante." },
      { id: "nodejs", note: "servidor.js: servidor local sem dependências para rodar a demo." },
      { id: "vercel", note: "Site estático com CSP restritiva, nosniff e noindex em vercel.json." },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/sistema_prototipo_vieira`,
      demo: {
        url: "https://sistemaprototipovieira.vercel.app/",
        host: "Vercel",
        note: "Dados fictícios. Cada visitante usa a própria cópia, salva no navegador.",
      },
    },
    shots: [
      {
        image: "vieira/dashboard",
        alt: "Dashboard do Vieira Gestão Operacional com oito indicadores da frota, filtros por cidade e período, despesas por categoria e situação da frota por cidade.",
        caption: "Dashboard com indicadores calculados a partir dos registros.",
        device: "desktop",
      },
      {
        image: "vieira/compras-detalhe",
        alt: "Detalhe da solicitação de compra SC-0013 com as etapas do fluxo, botões Aprovar e Rejeitar da diretoria, itens solicitados e histórico.",
        caption: "Solicitação de compra aguardando a decisão da diretoria.",
        device: "desktop",
      },
      {
        image: "vieira/dashboard-escuro",
        alt: "Dashboard do Vieira no tema escuro, com superfícies em azul-marinho.",
        caption: "Tema escuro, que segue a preferência do sistema.",
        device: "desktop",
      },
      {
        image: "vieira/dashboard-mobile",
        alt: "Dashboard do Vieira em um celular, com indicadores empilhados.",
        caption: "Dashboard no celular.",
        device: "mobile",
      },
      {
        image: "vieira/compras-mobile",
        alt: "Lista de solicitações de compra no celular, exibida em cartões.",
        caption: "No celular, tabelas largas viram cartões.",
        device: "mobile",
      },
      {
        image: "vieira/abastecimento-mobile",
        alt: "Tela de abastecimento e quilometragem no celular.",
        caption: "Abastecimento no celular.",
        device: "mobile",
      },
    ],
    imageSource: `${CAPTURE_NOTE} Todos os dados exibidos são fictícios.`,
    accent: { color: "#2f6bd9", ink: "#ffffff", text: "#24509f", surface: "#173a6e", onSurface: "#ffffff" },
    layout: "modules",
    modules: [
      {
        id: "dashboard",
        label: "Dashboard",
        description: "8 indicadores calculados, filtros por cidade, período e situação, despesas por categoria e frota por cidade.",
        shot: {
          image: "vieira/dashboard",
          alt: "Dashboard com indicadores da frota, filtros e gráficos de despesas por categoria e situação por cidade.",
          caption: "Dashboard",
          device: "desktop",
        },
      },
      {
        id: "veiculos",
        label: "Veículos",
        description: "Busca e filtros, cadastro, mudança de situação com motivo e ficha com manutenções, abastecimentos e peças.",
        shot: {
          image: "vieira/veiculos",
          alt: "Lista de veículos com placa, modelo, ano, cidade, quilometragem e situação, com filtros por cidade, situação e tipo.",
          caption: "Veículos",
          device: "desktop",
        },
      },
      {
        id: "manutencao",
        label: "Manutenção",
        description: "Solicitações com prioridade e 6 status, e ordens de serviço com diagnóstico, peças, executor e custos.",
        shot: {
          image: "vieira/manutencao",
          alt: "Solicitações mecânicas com prioridade, solicitante, responsável e status, separadas por abas de situação.",
          caption: "Manutenção",
          device: "desktop",
        },
      },
      {
        id: "compras",
        label: "Compras",
        description: "Aprovação exclusiva do diretor, pedido ao fornecedor, recebimento com entrada no estoque e despesa vinculada.",
        shot: {
          image: "vieira/compras",
          alt: "Solicitações de compra com totais por etapa e a lista de pedidos com status e decisão da diretoria.",
          caption: "Solicitações de compra",
          device: "desktop",
        },
      },
      {
        id: "estoque",
        label: "Estoque",
        description: "Saldo, mínimo, custo médio, entradas, saídas, ajustes justificados e controle de pneus e baterias.",
        shot: {
          image: "vieira/estoque",
          alt: "Estoque e inventário com materiais, saldo, mínimo, custo unitário, valor e situação, além de indicadores de estoque baixo.",
          caption: "Estoque e inventário",
          device: "desktop",
        },
      },
      {
        id: "pecas",
        label: "Peças por veículo",
        description: "Destinação por placa (instalação, substituição, reposição) e consulta do que está instalado em cada veículo.",
        shot: {
          image: "vieira/pecas",
          alt: "Registro de peças destinadas por placa, com tipo de movimento, responsável e referência à ordem de serviço.",
          caption: "Peças por veículo",
          device: "desktop",
        },
      },
      {
        id: "abastecimento",
        label: "Abastecimento",
        description: "Registro com cálculo automático, leituras de hodômetro e consumo por veículo, cidade e mês.",
        shot: {
          image: "vieira/abastecimento",
          alt: "Abastecimento e quilometragem com litros abastecidos, gasto, consumo médio, preço médio e a lista de abastecimentos.",
          caption: "Abastecimento e quilometragem",
          device: "desktop",
        },
      },
      {
        id: "despesas",
        label: "Despesas",
        description: "6 categorias, filtros, resumo por cidade e categoria, conferência e exportação CSV.",
        shot: {
          image: "vieira/despesas",
          alt: "Despesas com total no período, resumos por cidade e por categoria e a lista de lançamentos aguardando conferência.",
          caption: "Despesas",
          device: "desktop",
        },
      },
      {
        id: "relatorios",
        label: "Relatórios",
        description: "10 relatórios com filtros, totais, exportação CSV e versão para impressão.",
        shot: {
          image: "vieira/relatorios",
          alt: "Relatório de despesas por cidade com totais por categoria e botões para exportar CSV e imprimir.",
          caption: "Relatórios",
          device: "desktop",
        },
      },
      {
        id: "usuarios",
        label: "Usuários",
        description: "Usuários e setores, ativação, matriz de permissões e registro de atividades.",
        shot: {
          image: "vieira/usuarios",
          alt: "Lista de usuários fictícios com função, setor, perfil de acesso, cidade e situação, com ações de usar perfil e desativar.",
          caption: "Usuários",
          device: "desktop",
        },
      },
    ],
    sheet: {
      languages: ["JavaScript", "CSS", "HTML"],
      architecture: [
        "Camada de serviços (js/services) valida, aplica a permissão simulada, registra histórico e grava — as telas nunca alteram dados diretamente.",
        "Uma tela por arquivo em js/modules; rotas por hash no formato #/pagina/identificador?filtro=valor.",
        "Operações em transação: se uma validação falha no meio, a alteração inteira é desfeita.",
        "js/responsivo.js mede o espaço real e converte tabelas em cartões quando elas não cabem.",
      ],
      persistence: "LocalStorage (estado em memória + gravação local), com restauração dos dados da demonstração.",
      deploy: "Vercel — site estático, sem etapa de build.",
      files: ["index.html", "js/app.js", "js/router.js", "js/services/core.js", "js/modules/compras.js", "vercel.json"],
      verification: [
        "Os 10 módulos foram abertos e capturados na demo publicada (desktop 1440 px e celular 390 px).",
        "Sem rolagem horizontal em 390 px e 768 px e sem erros de JavaScript no carregamento.",
        "O README documenta 44 verificações ponta a ponta, auditoria de responsividade em 25 larguras e de contraste WCAG AA nos dois temas.",
      ],
    },
  },

  // ------------------------------------------------------------------ 02
  {
    slug: "conveniencia",
    number: "02",
    name: "Conveniência THR",
    repoName: "convenienciaTHR",
    kind: "sistema",
    category: "Sistema web · Controle de estoque",
    createdAt: "2026-06-18",
    tagline:
      "Controle de estoque da loja de conveniência do Posto THR: produtos, entradas e saídas, alertas e exportação para Excel.",
    summary: [
      "Aplicação em React para gerenciar o estoque da conveniência do Posto THR. Centraliza o cadastro de produtos, registra entradas e saídas com validação, sinaliza os itens abaixo do mínimo e gera relatórios e backups.",
      "Tudo funciona no navegador, sem servidor: os dados ficam no LocalStorage e podem ser exportados para Excel ou salvos em um arquivo JSON de backup.",
    ],
    features: [
      "Dashboard com produtos cadastrados, valor total em estoque, itens com estoque baixo e movimentações recentes",
      "Cadastro, edição e exclusão de produtos com validação de campos",
      "Entradas e saídas com observação — uma saída maior que o saldo é bloqueada",
      "Busca por nome com debounce e filtro “somente estoque baixo”",
      "Exportação para Excel (.xls com abas de produtos e movimentações) sem bibliotecas externas",
      "Backup e restauração em JSON, com validação da estrutura do arquivo",
      "Persistência local com migração de chaves antigas e avisos de sucesso ou erro",
    ],
    stack: [
      { id: "react", note: "React 18 com Context API para produtos e movimentações." },
      { id: "vite", note: "Vite 6." },
      { id: "javascript", note: "Serviços e validadores puros, separados dos componentes." },
      { id: "css" },
      { id: "localstorage", note: "Chaves thr_products e thr_movements, com migração das chaves antigas." },
      { id: "vercel" },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/convenienciaTHR`,
      demo: {
        url: "https://conveniencia-zeta.vercel.app/",
        host: "Vercel",
        note: "A demonstração começa vazia; os dados ficam no navegador de quem usa.",
      },
    },
    shots: [
      {
        image: "conveniencia/dashboard",
        alt: "Dashboard do Posto THR com produtos cadastrados, valor total em estoque, três itens com estoque baixo e as movimentações recentes.",
        caption: "Dashboard com alertas de estoque baixo e movimentações recentes.",
        device: "desktop",
      },
      {
        image: "conveniencia/produtos",
        alt: "Tabela de produtos com preço, quantidade, quantidade mínima e data de cadastro; linhas com estoque baixo destacadas.",
        caption: "Produtos com destaque para os itens abaixo do mínimo.",
        device: "desktop",
      },
      {
        image: "conveniencia/modal-saida-bloqueada",
        alt: "Janela de saída de estoque com a mensagem “Quantidade insuficiente em estoque para esta saída”.",
        caption: "Validação: a saída maior que o saldo é bloqueada.",
        device: "desktop",
      },
      {
        image: "conveniencia/estoque-baixo",
        alt: "Lista de produtos filtrada para mostrar somente os itens com estoque baixo.",
        caption: "Filtro “somente estoque baixo”.",
        device: "desktop",
      },
      {
        image: "conveniencia/modal-produto",
        alt: "Formulário de cadastro de produto com nome, preço de venda, quantidade e quantidade mínima.",
        caption: "Cadastro de produto.",
        device: "desktop",
      },
      {
        image: "conveniencia/dashboard-mobile",
        alt: "Dashboard do Posto THR no celular.",
        caption: "Dashboard no celular.",
        device: "mobile",
      },
      {
        image: "conveniencia/produtos-mobile",
        alt: "Lista de produtos no celular.",
        caption: "Produtos no celular.",
        device: "mobile",
      },
    ],
    imageSource: `${CAPTURE_NOTE} Os produtos e movimentações de exemplo foram cadastrados pela própria interface, apenas para as capturas.`,
    accent: { color: "#1b7a4b", ink: "#ffffff", text: "#1b7a4b", surface: "#1b6b43", onSurface: "#ffffff" },
    layout: "stack",
    sheet: {
      languages: ["JavaScript", "CSS", "HTML"],
      architecture: [
        "AppContext concentra produtos e movimentações; a movimentação e o ajuste de saldo acontecem na mesma operação.",
        "Serviços puros (productService, movementService, backupService, exportService) separados dos componentes.",
        "Validadores isolados em utils/validators.js, com mensagens exibidas no próprio formulário.",
        "Excel gerado como documento HTML com formatos mso-number-format, sem dependências.",
      ],
      persistence: "LocalStorage, com backup/restauração em arquivo JSON.",
      deploy: "Vercel.",
      files: ["src/App.jsx", "src/context/AppContext.jsx", "src/services/exportService.js", "src/services/backupService.js"],
      verification: [
        "8 produtos e 6 movimentações cadastrados pela interface da demo publicada para as capturas.",
        "Bloqueio de saída maior que o saldo confirmado na demo.",
        "Sem rolagem horizontal em 390 px e 768 px e sem erros de JavaScript no carregamento.",
      ],
    },
  },

  // ------------------------------------------------------------------ 03
  {
    slug: "pilates",
    number: "03",
    name: "Sistema Pilates",
    repoName: "Sistema-Pilates",
    kind: "sistema",
    category: "Sistema web full stack · Gestão de estúdio de Pilates e fisioterapia",
    createdAt: "2026-05-26",
    tagline:
      "Gestão de um estúdio de Pilates e fisioterapia: agenda, presença, mensalidades com PIX e um portal para cada aluno — em TypeScript de ponta a ponta.",
    summary: [
      "Sistema feito para a rotina de um estúdio de Pilates e fisioterapia. A equipe trabalha em um painel administrativo com quatro perfis de acesso — administração, professor, recepção e financeiro — e cada aluno tem o próprio portal para acompanhar aulas, frequência, avaliações e pagamentos.",
      "A API em Fastify concentra as regras: conflito de horário do professor, capacidade das turmas, mensalidade seguinte gerada assim que a anterior é quitada, vencimentos conferidos por tarefas agendadas e cobrança PIX pelo Mercado Pago. O frontend usa React com TanStack Query, e o ambiente sobe com Docker Compose (MySQL, API, frontend e Nginx).",
    ],
    features: [
      "Agenda em lista e em visão semanal, com aulas individuais, em dupla ou em grupo, lançamento em lote para vários dias e bloqueio de conflito de horário do professor",
      "Registro de presença por aula, frequência do aluno em calendário e anotações de evolução vinculadas à aula",
      "Cancelamento, suspensão e exclusão de aulas com justificativa obrigatória, além de reagendamento e reposições",
      "Mensalidades por plano com geração automática, baixa manual com data, reembolsos e comprovantes enviados pelo aluno e analisados pela equipe",
      "Cobrança PIX com QR Code pelo Mercado Pago, confirmada por webhook com assinatura verificada",
      "Acompanhamento do risco de evasão a partir da frequência dos últimos 30 dias e da situação financeira de cada aluno",
      "Pacotes de sessões, avaliações físicas com medidas e relatórios com gráficos e exportação para Excel",
      "Portal do aluno com aulas, frequência, financeiro, avaliações, notificações e assistente de dúvidas por menus (sem IA)",
      "Termos de uso versionados, com aceite obrigatório da versão vigente e cópia em PDF",
      "Perfis de acesso, JWT com refresh token, limite de requisições e registro de auditoria das operações",
    ],
    stack: [
      { id: "typescript", note: "API, frontend e pacote compartilhado @pilates/shared." },
      { id: "nodejs", note: "Node 20 no CI." },
      { id: "fastify", note: "Fastify 4 com @fastify/jwt, Helmet, CORS e rate limit." },
      { id: "api-rest", note: "127 rotas em 21 módulos, sob /api/v1." },
      { id: "zod", note: "Zod 3 na API e Zod 4 nos formulários com React Hook Form." },
      { id: "prisma", note: "Prisma 5: 32 modelos e 14 migrations." },
      { id: "mysql", note: "MySQL 8 em container." },
      { id: "react", note: "React 19 com React Router 7." },
      { id: "vite", note: "Vite 8." },
      { id: "tailwind", note: "Tailwind 3 com componentes Radix no estilo shadcn/ui." },
      { id: "tanstack-query" },
      { id: "recharts", note: "Gráficos da tela de relatórios." },
      { id: "mercado-pago", note: "SDK mercadopago 3." },
      { id: "vitest", note: "56 arquivos de teste na API e 29 no frontend." },
      { id: "github-actions", note: "CI com MySQL, migrations, seed, testes com cobertura e build." },
      { id: "docker", note: "Compose com MySQL, API, frontend e Nginx." },
      { id: "nginx", note: "Proxy reverso: /api/v1 para a API e o restante para o frontend." },
      { id: "git" },
      { id: "github", note: "Repositório privado." },
    ],
    links: {
      privateRepo: "O código-fonte não é público.",
    },
    shots: [
      {
        image: "pilates/agenda",
        alt: "Agenda semanal do painel administrativo de 12 a 18 de outubro, com aulas de Aparelhos, Mat e Fisioterapia por professor e sala, marcadas como realizada, agendada ou cancelada no feriado de segunda-feira.",
        caption: "Agenda semanal com o status de cada aula.",
        device: "desktop",
      },
      {
        image: "pilates/dashboard",
        alt: "Dashboard da equipe com total de alunos, aulas de hoje, receita do mês, inadimplentes e professores ativos, além das listas de aulas de hoje e de pagamentos recentes.",
        caption: "Dashboard da equipe.",
        device: "desktop",
      },
      {
        image: "pilates/presenca",
        alt: "Janela Registrar Presenças de uma aula de Aparelhos com três alunos, dois marcados como presentes, e o botão Salvar e Finalizar Aula.",
        caption: "Registro de presença da turma.",
        device: "desktop",
      },
      {
        image: "pilates/acompanhamento",
        alt: "Acompanhamento de alunos com os totais em risco de evasão, requer atenção e em dia, e a tabela com última presença, frequência em 30 dias, situação financeira e risco de cada aluno.",
        caption: "Risco de evasão por frequência e financeiro.",
        device: "desktop",
      },
      {
        image: "pilates/financeiro",
        alt: "Lista de mensalidades com aluno, plano, valor, vencimento e status pago ou vencido, com o botão Dar baixa nas mensalidades vencidas.",
        caption: "Mensalidades e baixa manual.",
        device: "desktop",
      },
      {
        image: "pilates/alunos",
        alt: "Lista de alunos fictícios com e-mail, telefone, plano, status ativo e ações por aluno.",
        caption: "Cadastro de alunos.",
        device: "desktop",
      },
      {
        image: "pilates/aluno-dashboard",
        alt: "Início do portal do aluno com boas-vindas, aviso de mensalidade em aberto, resumo de aulas e da situação financeira, ações rápidas e a próxima aula.",
        caption: "Portal do aluno.",
        device: "desktop",
      },
      {
        image: "pilates/aluno-financeiro",
        alt: "Financeiro do portal do aluno com mensalidade atual, próximo vencimento, valor em aberto, total pago e a área Pagar via PIX, que informa a data em que o QR Code fica disponível.",
        caption: "Financeiro do aluno, com pagamento via PIX.",
        device: "desktop",
      },
      {
        image: "pilates/aluno-presenca",
        alt: "Frequência do aluno com aulas realizadas, taxa de presença, calendário de comparecimento de outubro e gráfico de evolução mensal.",
        caption: "Frequência em calendário.",
        device: "desktop",
      },
      {
        image: "pilates/aluno-dashboard-mobile",
        alt: "Portal do aluno no celular com boas-vindas, aviso de mensalidade em aberto e resumo de aulas, com navegação na parte de baixo da tela.",
        caption: "Portal do aluno no celular.",
        device: "mobile",
      },
      {
        image: "pilates/aluno-agenda-mobile",
        alt: "Minhas Aulas no celular com as aulas do dia, horário, professor, sala e status.",
        caption: "Aulas do dia no celular.",
        device: "mobile",
      },
      {
        image: "pilates/aluno-presenca-mobile",
        alt: "Frequência no celular com aulas realizadas, taxa de presença e calendário de comparecimento.",
        caption: "Frequência no celular.",
        device: "mobile",
      },
    ],
    imageSource:
      "Sem demonstração publicada. Capturas feitas em 13/10/2026 com o sistema rodando localmente, em um banco de demonstração separado e com dados fictícios (nomes, CPFs 000.000.001-xx e e-mails @exemplo.test). As telas de login e de termos ficaram de fora porque exibem a marca do estúdio.",
    captureAddress: "127.0.0.1:5174 · execução local, dados fictícios",
    notes: [
      "O repositório é privado e o sistema ainda não tem demonstração pública: o deploy em servidor próprio (VPS) está em preparação.",
    ],
    accent: { color: "#d8385e", ink: "#ffffff", text: "#b3264b", surface: "#403e3c", onSurface: "#fbf8ec" },
    layout: "portals",
    sheet: {
      languages: ["TypeScript", "SQL", "CSS", "Shell", "Dockerfile"],
      architecture: [
        "Monorepo com backend/ (API Fastify), frontend/ (React + Vite) e packages/shared (schemas Zod usados pela API).",
        "API em módulos — routes → controller → service → repository — com middlewares de autenticação e de perfil de acesso.",
        "Eventos internos (aula realizada, presença registrada, pagamento confirmado) disparam notificações, fecham reposições e cancelam cobranças PIX pendentes.",
        "Tarefas agendadas: aulas encerradas (a cada hora), mensalidades vencidas (a cada 6 h), cobranças PIX expiradas (a cada 5 min) e geração de mensalidades por expressão cron configurável.",
      ],
      persistence: "MySQL 8 com Prisma ORM: 32 modelos, 25 enums e 14 migrations.",
      deploy: "Docker Compose (MySQL, API, frontend e Nginx). Ainda sem publicação; o deploy em VPS está em preparação.",
      files: [
        "backend/prisma/schema.prisma",
        "backend/src/modules/agenda/agenda.service.ts",
        "backend/src/modules/pagamentos-pix/",
        "frontend/src/features/aluno/",
        "docker-compose.yml",
      ],
      verification: [
        "Executado localmente em 13/10/2026 com um banco de demonstração separado, criado pelas migrations e pelo seed do próprio projeto.",
        "Os dados fictícios foram cadastrados pela API do sistema, com as mesmas validações das telas; só as datas de registro foram ajustadas no banco de demonstração para simular algumas semanas de uso.",
        "Funcionalidades e números de modelos, rotas e testes conferidos no código-fonte. Como o repositório é privado, a data exibida é a do primeiro commit.",
      ],
    },
  },

  // ------------------------------------------------------------------ 04
  {
    slug: "fotos",
    number: "04",
    name: "RestaurArt",
    repoName: "Fotos",
    kind: "interface",
    category: "Landing page · Serviço de restauração de fotos",
    createdAt: "2026-03-17",
    tagline:
      "Landing page de um serviço de restauração de fotografias, com comparador antes/depois e pedidos pelo WhatsApp.",
    summary: [
      "Página de apresentação e conversão do RestaurArt, um serviço de restauração digital de fotos antigas e danificadas. A interface aposta em uma paleta escura com detalhes dourados, animações de entrada durante a rolagem e um comparador antes/depois programado do zero.",
      "O site apresenta o serviço; o atendimento e os pedidos acontecem pelo WhatsApp, com mensagens pré-preenchidas para cada pacote.",
    ],
    features: [
      "Comparador antes/depois arrastável com mouse ou toque, construído com clip-path",
      "Seções de abertura, como funciona (3 passos), galeria, benefícios, planos, depoimentos e chamada final",
      "Botões de cada plano abrem o WhatsApp com uma mensagem pré-preenchida",
      "Animações de entrada na rolagem com Framer Motion",
      "Rolagem suave para âncoras internas",
      "Rodapé com Instagram, WhatsApp e e-mail",
    ],
    stack: [
      { id: "react", note: "React 19, uma seção por arquivo em src/sections." },
      { id: "tailwind", note: "Tailwind 3 com tema estendido (cor gold e fontes próprias)." },
      { id: "framer-motion", note: "Animações de entrada com whileInView." },
      { id: "vite" },
      { id: "javascript" },
      { id: "vercel" },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/Fotos`,
      demo: { url: "https://fotosrestaurar.vercel.app/", host: "Vercel" },
    },
    shots: [
      {
        image: "fotos/desktop",
        alt: "Abertura do RestaurArt com o título “Transforme suas fotos simples em memórias eternas” sobre fundo escuro.",
        caption: "Abertura com chamada principal.",
        device: "desktop",
      },
      {
        image: "fotos/secao-02",
        alt: "Seção “O Poder da Restauração Digital” com o comparador antes/depois entre uma foto sépia e a versão restaurada.",
        caption: "Comparador antes/depois feito do zero.",
        device: "desktop",
      },
      {
        image: "fotos/secao-03",
        alt: "Seção “Simples, rápido e emocionante” com os três passos: envie sua foto, nós restauramos e memória salva.",
        caption: "Como funciona, em três passos.",
        device: "desktop",
      },
      {
        image: "fotos/secao-04",
        alt: "Galeria “Nossa Arte” com fotografias organizadas em colunas.",
        caption: "Galeria em colunas.",
        device: "desktop",
      },
      {
        image: "fotos/secao-05",
        alt: "Seção “Por que escolher nosso serviço?” com seis cartões de benefícios.",
        caption: "Benefícios em cartões.",
        device: "desktop",
      },
      {
        image: "fotos/secao-06",
        alt: "Planos e preços com três pacotes e o destaque “Mais escolhido”.",
        caption: "Planos com pedido pelo WhatsApp.",
        device: "desktop",
      },
      {
        image: "fotos/secao-07",
        alt: "Seção “Histórias de Emoção” com três depoimentos em cartões.",
        caption: "Depoimentos.",
        device: "desktop",
      },
      {
        image: "fotos/secao-08",
        alt: "Chamada final “Algumas memórias merecem ser preservadas para sempre” com botões para começar a restauração e falar com o atendimento.",
        caption: "Chamada final.",
        device: "desktop",
      },
      {
        image: "fotos/mobile",
        alt: "Abertura do RestaurArt no celular.",
        caption: "Versão para celular.",
        device: "mobile",
      },
      {
        image: "fotos/desktop-full",
        alt: "Página inteira do RestaurArt, da abertura ao rodapé.",
        caption: "Página completa.",
        device: "page",
      },
    ],
    imageSource: CAPTURE_NOTE,
    accent: { color: "#f2b705", ink: "#0b1026", text: "#8a6100", surface: "#0a0f1e", onSurface: "#f8fafc" },
    layout: "filmstrip",
    sheet: {
      languages: ["JavaScript", "CSS", "HTML"],
      architecture: [
        "Componentes reutilizáveis em src/components (Button, Section, BeforeAfterSlider).",
        "Uma seção por arquivo em src/sections (Hero, Demo, HowItWorks, Gallery, Benefits, Pricing, Testimonials…).",
        "Utilitário cn (clsx + tailwind-merge) para compor classes.",
      ],
      persistence: "Não se aplica (página estática).",
      deploy: "Vercel.",
      files: ["src/components/BeforeAfterSlider.jsx", "src/sections/Pricing.jsx", "tailwind.config.js"],
      verification: [
        "Página percorrida inteira na demo publicada para disparar as animações antes das capturas.",
        "Sem rolagem horizontal em 390 px e 768 px e sem erros de JavaScript no carregamento.",
      ],
    },
  },

  // ------------------------------------------------------------------ 05
  {
    slug: "iaworkout",
    number: "05",
    name: "IaWorkout",
    repoName: "IaWorkout",
    kind: "sistema",
    category: "Plataforma full stack · Gestão de academias com IA",
    createdAt: "2025-11-06",
    tagline:
      "Plataforma para academias com API em Java, painéis em React e fichas de treino geradas pela API da OpenAI — sempre revisadas pelo instrutor.",
    summary: [
      "Sistema de gestão para academias organizado em monorepo: API REST em Spring Boot com MySQL, aplicação web para a academia e para o aluno, painel de superadministração da plataforma e landing page.",
      "A IA entra em um ponto específico: gerar a ficha de treino a partir do objetivo, do nível e do último histórico de cargas do aluno. A ficha gerada fica pendente até a revisão do instrutor — o aluno só vê fichas ativas.",
    ],
    features: [
      "Fichas de treino geradas com a API da OpenAI no formato definido pelo prompt (6 dias, 4 exercícios por dia), com resposta em JSON, processamento assíncrono e novas tentativas em falhas do serviço",
      "Revisão obrigatória: o instrutor é notificado, pode editar exercícios, séries, repetições, carga e descanso e aprova a ficha antes que ela chegue ao aluno",
      "Alunos, matrículas, planos, avaliações físicas e histórico de fichas, com download da ficha em PDF",
      "Importação de alunos por planilha Excel, com modelo para download",
      "Financeiro com envio e verificação de comprovantes, histórico de pagamentos, despesas, relatórios e fluxo de caixa",
      "Funcionários com registro e histórico de ponto",
      "Portal do aluno: ficha ativa, registro de cargas, cronômetro de descanso, evolução corporal e notificações",
      "Assistente do aluno baseado em menus (sem IA): ficha atual, situação financeira, PIX, cálculo de IMC e horários",
      "Autenticação JWT com perfis de acesso e licença por academia (SaaS) verificada com AOP",
      "Painel de superadmin: academias, planos da plataforma, pagamentos de licença, anúncios e tickets de suporte",
    ],
    stack: [
      { id: "java", note: "Java 17." },
      { id: "spring-boot", note: "Spring Boot 3.3: Web, Data JPA, Validation, AOP, @Async e @Scheduled." },
      { id: "spring-security", note: "JWT (java-jwt) e perfis ADMIN, INSTRUTOR, ALUNO e SUPER_ADMIN." },
      { id: "api-rest", note: "Controllers por recurso consumidos via Axios." },
      { id: "mysql", note: "MySQL 8." },
      { id: "sql" },
      { id: "flyway", note: "22 migrations versionadas." },
      { id: "jpa" },
      { id: "react", note: "React 18 + React Router nos dois frontends." },
      { id: "vite" },
      { id: "recharts", note: "Fluxo de caixa e evolução corporal." },
      { id: "javascript" },
      { id: "css" },
      { id: "openai", note: "Chat Completions com resposta em JSON (modelo gpt-3.5-turbo)." },
      { id: "docker", note: "Docker Compose com MySQL, API e frontends." },
      { id: "nginx", note: "Serve os frontends nos containers." },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/IaWorkout`,
    },
    shots: [
      {
        image: "iaworkout/dashboard-indicadores",
        alt: "Dashboard do IaWorkout com o gráfico de fluxo de caixa dos últimos 12 meses e os totais de alunos, novos alunos e fichas geradas.",
        caption: "Dashboard com fluxo de caixa e indicadores.",
        device: "desktop",
      },
      {
        image: "iaworkout/fichas-ia",
        alt: "Editor de ficha de treino com observações gerais e a tabela de exercícios de segunda-feira, com séries, repetições, carga e descanso.",
        caption: "Ficha gerada pela IA aberta para revisão do instrutor.",
        device: "desktop",
      },
      {
        image: "iaworkout/alunos",
        alt: "Lista de alunos em cartões com objetivo, plano e status, e botões para importar e cadastrar alunos.",
        caption: "Gestão de alunos com importação por planilha.",
        device: "desktop",
      },
      {
        image: "iaworkout/matriculas",
        alt: "Status das matrículas em cartões com plano, vencimento e situação ativa ou suspensa.",
        caption: "Status das matrículas.",
        device: "desktop",
      },
      {
        image: "iaworkout/dashboard",
        alt: "Painel da academia com menu lateral (dashboard, licença, funcionários, alunos, matrículas, planos, despesas, pagamentos, relatórios e suporte), gráfico de fluxo de caixa e indicadores.",
        caption: "Navegação completa do painel da academia.",
        device: "desktop",
      },
      {
        image: "iaworkout/treino-mobile",
        alt: "Ficha de treino no celular com exercícios, campos para registrar repetições e carga e botões para finalizar o treino e dar feedback.",
        caption: "Treino do dia no portal do aluno.",
        device: "mobile",
      },
      {
        image: "iaworkout/portal-aluno-mobile",
        alt: "Gráfico de evolução corporal do aluno no celular, com peso e gordura, e comparação de resultados entre datas.",
        caption: "Evolução corporal do aluno.",
        device: "mobile",
      },
      {
        image: "iaworkout/assistente-mobile",
        alt: "Assistente virtual do aluno com opções Meus Treinos, Financeiro, Minha Evolução e Dúvidas.",
        caption: "Assistente por menus (sem IA).",
        device: "mobile",
      },
      {
        image: "iaworkout/login-aluno-mobile",
        alt: "Tela de login da Área do Aluno no celular.",
        caption: "Área do Aluno.",
        device: "mobile",
      },
    ],
    imageSource:
      "Sem demonstração publicada. As imagens são capturas reais do sistema incluídas no próprio repositório (landing-page/src/assets).",
    notes: ["O projeto não possui demonstração pública; o código completo está no repositório."],
    accent: { color: "#3b82f6", ink: "#0b1026", text: "#1d4ed8", surface: "#1e293b", onSurface: "#f8fafc" },
    layout: "pipeline",
    pipeline: [
      { title: "Perfil do aluno", detail: "Objetivo, nível e o último treino com as cargas registradas." },
      { title: "API Spring Boot", detail: "Monta o prompt e processa a geração de forma assíncrona (@Async)." },
      { title: "API da OpenAI", detail: "Chat Completions com resposta em JSON e até 3 tentativas em falhas do serviço." },
      { title: "Ficha estruturada", detail: "6 dias × 4 exercícios com séries, repetições, carga e descanso." },
      { title: "Revisão do instrutor", detail: "A ficha fica pendente até ser revisada; o aluno só vê fichas ativas." },
    ],
    sheet: {
      languages: ["JavaScript", "Java", "CSS", "HTML", "Dockerfile"],
      architecture: [
        "Monorepo: backend/, frontend/ (academia e aluno), superadmin-frontend/ e landing-page/.",
        "Controllers → Services → Repositories (Spring Data JPA), DTOs e tratamento global de exceções.",
        "IaWorkoutService: prompt com objetivo, nível e histórico; response_format json_object; status PENDENTE_INSTRUTOR → ATIVA.",
        "Licença por academia verificada por aspecto (@CheckLicencaAtiva) e verificação diária de vencimentos (@Scheduled).",
      ],
      persistence: "MySQL 8 com 22 migrations Flyway.",
      deploy: "Docker Compose (MySQL, backend e frontends servidos por Nginx). Sem demonstração pública.",
      files: [
        "backend/…/services/IaWorkoutService.java",
        "backend/…/security/SecurityConfigurations.java",
        "backend/src/main/resources/db/migration/",
        "docker-compose.yml",
      ],
      verification: [
        "Integração com a OpenAI, status da ficha e filtro de fichas ativas no portal conferidos no código-fonte.",
        "O assistente do aluno foi verificado como fluxo de menus, sem chamada à IA.",
        "Rotas dos módulos conferidas em frontend/src/main.jsx.",
      ],
    },
  },

  // ------------------------------------------------------------------ 06
  {
    slug: "cyborg",
    number: "06",
    name: "CyborgGames",
    repoName: "projeto-CyborgGames",
    kind: "interface",
    category: "Landing page · Universo dos games",
    createdAt: "2025-06-04",
    tagline:
      "Página de jogos inspirada em plataformas de games e streaming, com menu mobile em JavaScript e três pontos de quebra.",
    summary: [
      "Recriação, para estudo, do layout Cyborg Gaming (design da TemplateMo, creditado no rodapé). O objetivo foi treinar HTML, CSS e responsividade com media queries em uma interface densa: cabeçalho com busca, chamada principal, cards de jogos populares e uma biblioteca com detalhes de cada jogo.",
    ],
    features: [
      "Menu mobile com botão hambúrguer controlado por JavaScript",
      "Responsividade em três pontos de quebra (1000, 768 e 426 px): cards em 3, 2 ou 1 coluna",
      "Cards de jogos com avaliação e downloads e efeitos de hover",
      "Seção de biblioteca com data de inclusão, horas jogadas e status",
      "Cores e tipografia centralizadas em variáveis CSS (:root)",
    ],
    stack: [
      { id: "html" },
      { id: "css", note: "Media queries em 1000, 768 e 426 px e variáveis em :root." },
      { id: "javascript", note: "Alternância do menu mobile." },
      { id: "github-pages" },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/projeto-CyborgGames`,
      demo: { url: "https://aleckdevv.github.io/projeto-CyborgGames/", host: "GitHub Pages" },
    },
    shots: [
      {
        image: "cyborg/desktop",
        alt: "Página CyborgGames com o banner “Browse Our Popular Games Here” e a seção “Most Popular Right Now” com cards de jogos.",
        caption: "Abertura e cards de jogos populares.",
        device: "desktop",
      },
      {
        image: "cyborg/mobile-menu",
        alt: "CyborgGames no celular com o menu aberto mostrando Home, Browse, Details e Streams.",
        caption: "Menu mobile aberto pelo botão hambúrguer.",
        device: "mobile",
      },
      {
        image: "cyborg/mobile",
        alt: "CyborgGames no celular com o banner principal e os cards em uma coluna.",
        caption: "Versão para celular.",
        device: "mobile",
      },
      {
        image: "cyborg/desktop-full",
        alt: "Página inteira do CyborgGames, incluindo a biblioteca de jogos e o rodapé.",
        caption: "Página completa.",
        device: "page",
      },
    ],
    imageSource: CAPTURE_NOTE,
    notes: ["Layout de referência: Cyborg Gaming, da TemplateMo (crédito no rodapé do projeto)."],
    accent: { color: "#e75b9c", ink: "#0b1026", text: "#b0246a", surface: "#1f2122", onSurface: "#ffffff" },
    layout: "hud",
    sheet: {
      languages: ["HTML", "CSS", "JavaScript"],
      architecture: [
        "Página única (index.html) com estilos em src/styles/style.css e script em src/script/script.js.",
        "Fontes Poppins, Grandstander, Roboto e Lato (Google Fonts) e ícones Font Awesome.",
      ],
      persistence: "Não se aplica (página estática).",
      deploy: "GitHub Pages.",
      files: ["index.html", "src/styles/style.css", "src/script/script.js"],
      verification: [
        "Menu mobile testado na demo publicada (390 px): o clique no botão abre o menu.",
        "Sem rolagem horizontal em 390 px e 768 px.",
      ],
    },
  },

  // ------------------------------------------------------------------ 07
  {
    slug: "starbucks",
    number: "07",
    name: "Starbucks — estudo de interface",
    repoName: "AleckDevv-projeto-starbucks.github.io",
    kind: "interface",
    category: "Landing page · Estudo de interface",
    createdAt: "2024-11-28",
    tagline:
      "Estudo de interface baseado em um layout da Nicepage: projeto educacional, sem vínculo com a Starbucks.",
    summary: [
      "Landing page construída para praticar HTML e CSS a partir de um layout de referência da Nicepage, com a temática de bebidas da marca. É um projeto educacional e de demonstração — não é um site oficial nem foi feito para a Starbucks.",
      "A composição alterna blocos de texto e imagens de fundo em seções de destaque, com cabeçalho, campo de busca estilizado e rodapé com créditos.",
    ],
    features: [
      "Banner “Happy Hour” com três destaques de bebidas",
      "Quatro seções de destaque alternando texto e imagens de fundo",
      "Campo de busca estilizado no cabeçalho (visual, sem busca funcional)",
      "Responsividade com três media queries (até 425 px, 426–1024 px e 769–1440 px)",
      "Efeitos de hover em imagens e botões",
    ],
    stack: [
      { id: "html" },
      { id: "css", note: "Três media queries e efeitos de hover." },
      { id: "github-pages" },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/AleckDevv-projeto-starbucks.github.io`,
      demo: { url: "https://aleckdevv.github.io/AleckDevv-projeto-starbucks.github.io/", host: "GitHub Pages" },
    },
    shots: [
      {
        image: "starbucks/desktop",
        alt: "Abertura da landing page com o título “Starbucks Happy Hour”, três bebidas em destaque e a foto de um copo erguido.",
        caption: "Abertura com destaques de bebidas.",
        device: "desktop",
      },
      {
        image: "starbucks/mobile",
        alt: "Abertura da landing page no celular.",
        caption: "Versão para celular.",
        device: "mobile",
      },
      {
        image: "starbucks/mobile-full",
        alt: "Página inteira no celular com as seções de destaque empilhadas.",
        caption: "Página completa no celular.",
        device: "page",
      },
      {
        image: "starbucks/desktop-full",
        alt: "Página inteira no desktop com as seções alternando texto e imagens.",
        caption: "Página completa.",
        device: "page",
      },
    ],
    imageSource: CAPTURE_NOTE,
    notes: [
      "Projeto educacional, sem vínculo com a Starbucks. Marcas e imagens pertencem aos seus proprietários.",
      "Layout de referência: Nicepage (crédito no rodapé do projeto).",
    ],
    accent: { color: "#00704a", ink: "#ffffff", text: "#00704a", surface: "#e3efe8", onSurface: "#0b1026" },
    layout: "magazine",
    sheet: {
      languages: ["CSS", "HTML"],
      architecture: ["index.html com estilos em assets/style/style.css e imagens em assets/images."],
      persistence: "Não se aplica (página estática).",
      deploy: "GitHub Pages.",
      files: ["index.html", "assets/style/style.css"],
      verification: ["Sem rolagem horizontal em 390 px e 768 px."],
    },
  },

  // ------------------------------------------------------------------ 08
  {
    slug: "b7burger",
    number: "08",
    name: "B7 Burger",
    repoName: "AleckDevv-projeto-b7-burger.github.io",
    kind: "interface",
    category: "Interface web · Hamburgueria",
    createdAt: "2024-08-02",
    tagline:
      "Interface de cardápio para uma hamburgueria, construída em HTML e CSS a partir de um layout no Figma.",
    summary: [
      "Interface de uma hamburgueria fictícia desenvolvida a partir de um layout no Figma (o arquivo .fig está no repositório; o rodapé credita a B7Web). O foco é a construção visual: tema escuro, destaque em laranja, hero com o hambúrguer em camadas e uma grade de produtos.",
      "É uma interface estática: os botões “Fazer pedido”, a busca e o seletor de categoria são visuais — não há sistema de pedidos, pagamentos ou integrações.",
    ],
    features: [
      "Cabeçalho com navegação e chamada para ação",
      "Hero com imagem do hambúrguer e chamada principal",
      "Área de busca e seletor de categoria (elementos visuais)",
      "Grade de produtos com selo de promoção e efeito de hover",
      "Responsividade: grade em 3, 2 ou 1 coluna, hero empilhado e navegação oculta abaixo de 600 px (o ícone de menu é apenas visual)",
      "Cores centralizadas em variáveis CSS",
    ],
    stack: [
      { id: "html" },
      { id: "css", note: "Media queries com a sintaxe de intervalo (width < 600px) e variáveis CSS." },
      { id: "github-pages" },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/AleckDevv-projeto-b7-burger.github.io`,
      demo: { url: "https://aleckdevv.github.io/AleckDevv-projeto-b7-burger.github.io/", host: "GitHub Pages" },
    },
    shots: [
      {
        image: "b7burger/desktop",
        alt: "Hero da B7 Burger com o título “O Hamburger mais delecioso”, botão laranja “Fazer pedido” e um hambúrguer em camadas.",
        caption: "Hero e área de busca.",
        device: "desktop",
      },
      {
        image: "b7burger/mobile",
        alt: "B7 Burger no celular com o hero centralizado.",
        caption: "Versão para celular.",
        device: "mobile",
      },
      {
        image: "b7burger/desktop-full",
        alt: "Página inteira da B7 Burger com a grade de produtos.",
        caption: "Página completa com a grade de produtos.",
        device: "page",
      },
      {
        image: "b7burger/mobile-full",
        alt: "Página inteira da B7 Burger no celular com os produtos em uma coluna.",
        caption: "Produtos em uma coluna no celular.",
        device: "page",
      },
    ],
    imageSource: CAPTURE_NOTE,
    notes: ["Interface estática: não há pedidos, pagamentos ou integrações comerciais."],
    accent: { color: "#fe6a0f", ink: "#141414", text: "#141414", surface: "#fe6a0f", onSurface: "#141414" },
    layout: "plate",
    sheet: {
      languages: ["HTML", "CSS"],
      architecture: ["index.html com estilos em src/style/style.css; tipografia Inter e ícones Font Awesome."],
      persistence: "Não se aplica (página estática).",
      deploy: "GitHub Pages.",
      files: ["index.html", "src/style/style.css", "src/__MACOSX/b7burger.fig"],
      verification: ["Sem rolagem horizontal em 390 px e 768 px.", "Confirmado no código: não há JavaScript nem formulários de pedido."],
    },
  },

  // ------------------------------------------------------------------ 09
  {
    slug: "agencia",
    number: "09",
    name: "Agência XYZ",
    repoName: "AleckDevv-projeto-agencia.github.io",
    kind: "interface",
    category: "Site institucional · Agência",
    createdAt: "2024-07-31",
    tagline: "Site institucional de uma agência fictícia: apresentação, serviços, portfólio e contato.",
    summary: [
      "Um dos primeiros projetos do repositório: o site institucional da Agência XYZ, com navegação para início, sobre, serviços, portfólio e contato. A estrutura HTML organiza a chamada principal, a apresentação da equipe, três serviços com ícones, uma galeria de portfólio e um formulário de contato.",
    ],
    features: [
      "Seção de abertura com o nome da agência e chamada para ação",
      "Apresentação da equipe (Sobre nós)",
      "Três serviços com ícones do Font Awesome",
      "Galeria de portfólio em grade",
      "Formulário de contato com nome, e-mail e mensagem",
    ],
    stack: [{ id: "html" }, { id: "github-pages" }, { id: "git" }, { id: "github" }],
    links: {
      repo: `${GH}/AleckDevv-projeto-agencia.github.io`,
      demo: {
        url: "https://aleckdevv.github.io/AleckDevv-projeto-agencia.github.io/",
        host: "GitHub Pages",
        note: "A versão publicada está sem a folha de estilos.",
      },
    },
    shots: [
      {
        image: "agencia/autor-inicio",
        alt: "Agência XYZ com menu azul, faixa de destaque com o botão “Saiba Mais” e a seção “Sobre Nós” com a foto da equipe.",
        caption: "Abertura e Sobre nós.",
        device: "desktop",
      },
      {
        image: "agencia/autor-servicos",
        alt: "Seção “Nossos serviços” com três cartões e ícones e a galeria “Nosso Portfólio” com quatro trabalhos.",
        caption: "Serviços e portfólio.",
        device: "desktop",
      },
      {
        image: "agencia/autor-final",
        alt: "Galeria de portfólio, formulário de contato e rodapé azul com os créditos.",
        caption: "Contato e rodapé.",
        device: "desktop",
      },
    ],
    imageSource:
      "Capturas incluídas pelo autor no repositório (pasta src/resultado-site), feitas executando o projeto localmente.",
    notes: [
      "No repositório, o arquivo src/style/style.css está vazio. Por isso, a página publicada no GitHub Pages aparece sem estilos; as capturas acima mostram a versão estilizada que o autor executou localmente.",
    ],
    accent: { color: "#0a7cff", ink: "#0b1026", text: "#0057c8", surface: "#0057c8", onSurface: "#ffffff" },
    layout: "triptych",
    sheet: {
      languages: ["HTML"],
      architecture: [
        "index.html com header/nav, seções e footer; Open Sans (Google Fonts) e Font Awesome.",
        "A folha de estilos referenciada (src/style/style.css) está sem conteúdo no repositório.",
      ],
      persistence: "Não se aplica (página estática).",
      deploy: "GitHub Pages.",
      files: ["index.html", "src/style/style.css (vazio)", "src/resultado-site/"],
      verification: [
        "Página publicada aberta em 13/10/2026: carrega, mas sem CSS.",
        "Capturas estilizadas obtidas do próprio repositório.",
      ],
    },
  },

  // ------------------------------------------------------------------ 10
  {
    slug: "medcenter",
    number: "10",
    name: "Medicenter",
    repoName: "AleckDevv-projeto-medcenter.github.io",
    kind: "interface",
    category: "Landing page · Clínica (estudo de layout)",
    createdAt: "2024-07-31",
    tagline: "Recriação, para estudo, da página inicial do template MediCenter, da QuanticaLabs.",
    summary: [
      "Exercício de construção de layout a partir do template MediCenter (QuanticaLabs), creditado no rodapé do projeto. A página reproduz a estrutura de um site de clínica: menu, banner com chamada principal, caixas de atendimento e horário de funcionamento, notícias, widgets laterais e rodapé em colunas.",
      "O conteúdo é de exemplo (em inglês e com textos lorem ipsum) e a página é estática: não há agendamento, formulários ou integrações.",
    ],
    features: [
      "Banner com chamada principal e três caixas de informação, incluindo horário de funcionamento",
      "Grade de notícias com data, comentários, imagem e resumo",
      "Widgets laterais de departamentos e contato",
      "Rodapé em três colunas com créditos",
      "Efeitos de hover no menu e nos botões do banner",
    ],
    stack: [
      { id: "html" },
      { id: "css", note: "Layout em Flexbox pensado para telas de desktop." },
      { id: "github-pages" },
      { id: "git" },
      { id: "github" },
    ],
    links: {
      repo: `${GH}/AleckDevv-projeto-medcenter.github.io`,
      demo: { url: "https://aleckdevv.github.io/AleckDevv-projeto-medcenter.github.io/", host: "GitHub Pages" },
    },
    shots: [
      {
        image: "medcenter/desktop",
        alt: "Página da Medicenter com logotipo, menu, banner “Top notch experience” e três caixas: dois atendimentos de emergência e o horário de funcionamento.",
        caption: "Banner e caixas de informação.",
        device: "desktop",
      },
      {
        image: "medcenter/desktop-full",
        alt: "Página inteira da Medicenter com notícias, widgets laterais e rodapé em colunas.",
        caption: "Página completa.",
        device: "page",
      },
    ],
    imageSource: CAPTURE_NOTE,
    notes: [
      "Layout pensado para desktop: a versão publicada não tem media queries e exige rolagem horizontal em telas pequenas.",
    ],
    accent: { color: "#2a9fd6", ink: "#0b1026", text: "#1a6e99", surface: "#e2f2fa", onSurface: "#0b1026" },
    layout: "browser",
    sheet: {
      languages: ["HTML", "CSS"],
      architecture: ["index.html com estilos em src/assets/css/style.css; fonte Tilt Neon e ícones Font Awesome."],
      persistence: "Não se aplica (página estática).",
      deploy: "GitHub Pages.",
      files: ["index.html", "src/assets/css/style.css"],
      verification: [
        "Página publicada aberta em 13/10/2026 (1440 px).",
        "Em 390 px a página ultrapassa a largura da tela em 217 px — por isso não é descrita como responsiva.",
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: ProjectSlug): { prev: Project; next: Project } {
  const index = projects.findIndex((p) => p.slug === slug);
  const count = projects.length;
  return {
    prev: projects[(index - 1 + count) % count]!,
    next: projects[(index + 1) % count]!,
  };
}

/** Projetos que usam uma tecnologia, com a observação específica de cada um. */
export function projectsUsing(tech: TechId): Array<{ project: Project; note?: string }> {
  return projects.flatMap((project) => {
    const item = project.stack.find((s) => s.id === tech);
    return item ? [{ project, note: item.note }] : [];
  });
}

/** Ordem cronológica (criação do repositório), da mais antiga para a mais recente. */
export function projectsByDate(): Project[] {
  return [...projects].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
