// ============================================================================
//  TECNOLOGIAS — sem escalas, porcentagens ou medidores.
//  Cada tecnologia tem uma explicação curta e um status:
//    "pratica" → usada nos projetos do portfólio (o site lista onde, a partir de projects.ts)
//    "estudo"  → aprendizado em andamento, ainda sem projeto no portfólio
// ============================================================================

export type TechCategory = "frontend" | "backend" | "dados" | "ferramentas" | "integracoes";
export type TechStatus = "pratica" | "estudo";

export interface Technology {
  name: string;
  /** Símbolo de duas letras exibido no bloco (estilo tabela periódica). */
  symbol: string;
  category: TechCategory;
  status: TechStatus;
  /** Como a tecnologia aparece no trabalho do Alex (fatos verificáveis). */
  description: string;
}

export const categories: Record<TechCategory, { label: string; description: string }> = {
  frontend: { label: "Front-end", description: "Interfaces, componentes e experiência no navegador." },
  backend: { label: "Back-end", description: "APIs, regras de negócio e segurança." },
  dados: { label: "Banco de dados", description: "Modelagem, migrações e persistência." },
  ferramentas: { label: "Ferramentas e deploy", description: "Versionamento, containers e publicação." },
  integracoes: { label: "Integrações e IA", description: "Serviços externos conectados aos sistemas." },
};

export const technologies = {
  html: {
    name: "HTML",
    symbol: "Ht",
    category: "frontend",
    status: "pratica",
    description:
      "Estrutura semântica de páginas e aplicações. Está em todos os projetos — das primeiras landing pages aos sistemas de gestão.",
  },
  css: {
    name: "CSS",
    symbol: "Cs",
    category: "frontend",
    status: "pratica",
    description:
      "Layouts com Flexbox e Grid, variáveis CSS, media queries, estados de hover e tema claro/escuro. A responsividade das demos foi conferida em 390 e 768 px.",
  },
  javascript: {
    name: "JavaScript",
    symbol: "Js",
    category: "frontend",
    status: "pratica",
    description:
      "Lógica de interface e de negócio no navegador: módulos ES6, manipulação do DOM, validações, cálculos e persistência local.",
  },
  react: {
    name: "React",
    symbol: "Re",
    category: "frontend",
    status: "pratica",
    description:
      "Componentes, hooks e Context API em aplicações criadas com Vite — do controle de estoque ao painel completo do IaWorkout.",
  },
  tailwind: {
    name: "Tailwind CSS",
    symbol: "Tw",
    category: "frontend",
    status: "pratica",
    description:
      "Estilização utilitária com tema estendido: cor “gold” e fontes próprias na RestaurArt e a paleta da interface em variáveis CSS no Sistema Pilates.",
  },
  vite: {
    name: "Vite",
    symbol: "Vi",
    category: "frontend",
    status: "pratica",
    description: "Ambiente de desenvolvimento e build dos projetos em React.",
  },
  "framer-motion": {
    name: "Framer Motion",
    symbol: "Fm",
    category: "frontend",
    status: "pratica",
    description: "Animações de entrada durante a rolagem e microinterações na landing page RestaurArt.",
  },
  recharts: {
    name: "Recharts",
    symbol: "Rc",
    category: "frontend",
    status: "pratica",
    description: "Gráficos de fluxo de caixa e de evolução corporal no IaWorkout e gráficos dos relatórios do Sistema Pilates.",
  },
  "tanstack-query": {
    name: "TanStack Query",
    symbol: "Tq",
    category: "frontend",
    status: "pratica",
    description:
      "Cache e sincronização das chamadas à API no Sistema Pilates: listas, indicadores e telas que se atualizam depois de cada operação.",
  },
  typescript: {
    name: "TypeScript",
    symbol: "Ts",
    category: "frontend",
    status: "pratica",
    description:
      "Linguagem do Sistema Pilates de ponta a ponta: API em Fastify, frontend em React e pacote de schemas compartilhado.",
  },
  java: {
    name: "Java",
    symbol: "Jv",
    category: "backend",
    status: "pratica",
    description:
      "Linguagem da API do IaWorkout (Java 17). O estudo continua no repositório Curso-Java, com exercícios do curso de Java básico.",
  },
  "spring-boot": {
    name: "Spring Boot",
    symbol: "Sb",
    category: "backend",
    status: "pratica",
    description:
      "API REST do IaWorkout com Spring Web, Data JPA, Validation, AOP, processamento assíncrono e tarefa agendada diária.",
  },
  "spring-security": {
    name: "Spring Security + JWT",
    symbol: "Jw",
    category: "backend",
    status: "pratica",
    description:
      "Autenticação com tokens JWT (biblioteca java-jwt) e perfis de acesso — administrador, instrutor, aluno e superadmin — no IaWorkout.",
  },
  "api-rest": {
    name: "APIs REST",
    symbol: "Ap",
    category: "backend",
    status: "pratica",
    description:
      "Controllers organizados por recurso (alunos, fichas, matrículas, pagamentos, suporte…) consumidos pelos frontends com Axios.",
  },
  nodejs: {
    name: "Node.js",
    symbol: "Nd",
    category: "backend",
    status: "pratica",
    description:
      "Executa a API do Sistema Pilates. Também está no ferramental dos projetos (npm, Vite) e no servidor local sem dependências do protótipo Vieira.",
  },
  fastify: {
    name: "Fastify",
    symbol: "Fy",
    category: "backend",
    status: "pratica",
    description:
      "API do Sistema Pilates organizada em módulos, com JWT e refresh token, perfis de acesso, Helmet e limite de requisições.",
  },
  zod: {
    name: "Zod",
    symbol: "Zd",
    category: "backend",
    status: "pratica",
    description:
      "Validação das entradas da API do Sistema Pilates com schemas reunidos no pacote compartilhado @pilates/shared, e dos formulários no frontend.",
  },
  sql: {
    name: "SQL",
    symbol: "Sq",
    category: "dados",
    status: "pratica",
    description: "Modelagem relacional, índices e scripts de migração versionados no IaWorkout.",
  },
  mysql: {
    name: "MySQL",
    symbol: "My",
    category: "dados",
    status: "pratica",
    description: "Banco de dados do IaWorkout e do Sistema Pilates (MySQL 8), executado em container com Docker Compose.",
  },
  prisma: {
    name: "Prisma ORM",
    symbol: "Pr",
    category: "dados",
    status: "pratica",
    description:
      "Modelagem e acesso a dados do Sistema Pilates: 32 modelos, migrations versionadas e transações nas operações financeiras.",
  },
  flyway: {
    name: "Flyway",
    symbol: "Fw",
    category: "dados",
    status: "pratica",
    description: "22 migrations versionadas no IaWorkout, aplicadas automaticamente quando a API inicia.",
  },
  jpa: {
    name: "JPA / Hibernate",
    symbol: "Hb",
    category: "dados",
    status: "pratica",
    description: "Mapeamento das entidades e repositórios Spring Data JPA da API do IaWorkout.",
  },
  localstorage: {
    name: "LocalStorage",
    symbol: "Ls",
    category: "dados",
    status: "pratica",
    description:
      "Persistência no navegador nos sistemas sem backend (Vieira e Conveniência THR), com tratamento de erros, backup e migração de chaves.",
  },
  git: {
    name: "Git",
    symbol: "Gt",
    category: "ferramentas",
    status: "pratica",
    description: "Versionamento de todos os projetos.",
  },
  github: {
    name: "GitHub",
    symbol: "Gh",
    category: "ferramentas",
    status: "pratica",
    description: "Hospedagem dos repositórios, documentação em README e integração com os deploys.",
  },
  docker: {
    name: "Docker",
    symbol: "Dk",
    category: "ferramentas",
    status: "pratica",
    description: "Dockerfiles e Docker Compose para subir banco MySQL, API e frontends do IaWorkout e do Sistema Pilates.",
  },
  nginx: {
    name: "Nginx",
    symbol: "Nx",
    category: "ferramentas",
    status: "pratica",
    description:
      "Servidor web dos frontends do IaWorkout e proxy reverso do Sistema Pilates, que encaminha /api/v1 para a API e o restante para o frontend.",
  },
  vitest: {
    name: "Vitest",
    symbol: "Vt",
    category: "ferramentas",
    status: "pratica",
    description: "Testes automatizados do Sistema Pilates: 56 arquivos de teste na API e 29 no frontend.",
  },
  "github-actions": {
    name: "GitHub Actions",
    symbol: "Ga",
    category: "ferramentas",
    status: "pratica",
    description:
      "Integração contínua do Sistema Pilates: formatação, lint, checagem de tipos, migrations, testes com cobertura e build a cada push e pull request.",
  },
  vercel: {
    name: "Vercel",
    symbol: "Vc",
    category: "ferramentas",
    status: "pratica",
    description:
      "Publicação de Vieira, Conveniência THR e RestaurArt. No Vieira, com cabeçalhos de segurança e noindex configurados em vercel.json.",
  },
  "github-pages": {
    name: "GitHub Pages",
    symbol: "Gp",
    category: "ferramentas",
    status: "pratica",
    description: "Publicação das landing pages de estudo direto dos repositórios.",
  },
  openai: {
    name: "API da OpenAI",
    symbol: "Ai",
    category: "integracoes",
    status: "pratica",
    description:
      "Geração de fichas de treino em JSON a partir do perfil do aluno no IaWorkout, com novas tentativas em falhas do serviço e revisão obrigatória do instrutor.",
  },
  "mercado-pago": {
    name: "Mercado Pago (PIX)",
    symbol: "Mp",
    category: "integracoes",
    status: "pratica",
    description:
      "Cobranças PIX com QR Code no Sistema Pilates, pelo SDK oficial: confirmação por webhook com assinatura verificada e expiração automática das cobranças.",
  },
} satisfies Record<string, Technology>;

export type TechId = keyof typeof technologies;

export function getTech(id: TechId): Technology {
  return technologies[id];
}

export const techIds = Object.keys(technologies) as TechId[];
