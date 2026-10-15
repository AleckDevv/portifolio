// ============================================================================
//  PERFIL — edite aqui os textos pessoais do portfólio.
//  Tudo o que aparece no hero, em "Sobre" e em "Contato" vem deste arquivo.
//  Regra do projeto: só publique informações verdadeiras e verificáveis.
// ============================================================================

export type HeadlineStyle = "strike" | "outline" | "accent" | "solid";

export interface HeadlineLine {
  text: string;
  /** strike: riscado em laranja · outline: contorno · accent: amarelo ácido · solid: branco */
  style: HeadlineStyle;
  /** Alinhamento no desktop (cria a composição assimétrica). */
  align: "start" | "end";
}

export interface Education {
  course: string;
  institution: string;
  period: string;
  status?: "concluído" | "em andamento";
}

export interface Profile {
  name: string;
  handle: string;
  role: string;
  location: string;
  headline: HeadlineLine[];
  intro: string;
  about: { lead: string; paragraphs: string[]; focus: string[] };
  education: Education[];
  goals: string[];
  contact: { email: string; github: string; linkedin: string };
}

export const profile: Profile = {
  name: "Alex Soares Lopes",
  handle: "AleckDevv",
  role: "Desenvolvedor Full Stack",
  location: "Teresina, PI",

  // Título do hero. Cada item é uma linha; o texto completo é lido por leitores de tela.
  headline: [
    { text: "Problemas", style: "strike", align: "start" },
    { text: "entram.", style: "outline", align: "end" },
    { text: "Software", style: "accent", align: "start" },
    { text: "sai.", style: "solid", align: "end" },
  ],

  intro:
    "Sou Alex Soares Lopes, o AleckDevv. Construo sistemas de gestão, interfaces web e APIs — do banco de dados à última tela — com Java, Spring Boot, TypeScript, React e SQL.",

  about: {
    lead: "Comecei recriando interfaces em HTML e CSS. Hoje desenho regras de negócio, modelo bancos de dados e entrego sistemas completos.",
    paragraphs: [
      "Gosto de pegar um processo confuso — uma frota, um estoque, a agenda de um estúdio, a rotina de uma academia — e transformá-lo em telas claras, regras consistentes e dados confiáveis. Meus projetos mais recentes cobrem esse caminho inteiro: APIs em Spring Boot e em Fastify com MySQL, painéis em React e protótipos que rodam direto no navegador.",
      "Fora do código, a inspiração vem de jogos, de música e dos momentos com o violão e a guitarra.",
    ],
    focus: [
      "Desenvolvimento full stack com Java, TypeScript e React",
      "Sistemas de gestão e regras de negócio",
      "Interfaces web responsivas e acessíveis",
      "Resolução de problemas com software",
    ],
  },

  // Formação: adicione cursos e graduações reais. Lista vazia = bloco oculto no site.
  // Exemplo: { course: "Análise e Desenvolvimento de Sistemas", institution: "Nome", period: "2024 – 2026", status: "em andamento" }
  education: [],

  // Objetivos profissionais (edite livremente).
  goals: [
    "Atuar como desenvolvedor full stack em equipes que constroem sistemas usados no dia a dia.",
    "Aprofundar a arquitetura de back-end, com Java e Spring e com Node.js e TypeScript.",
  ],

  contact: {
    // E-mail informado no README do projeto B7 Burger — confirme antes de publicar.
    email: "alexsoareslopes688@gmail.com",
    github: "https://github.com/AleckDevv",
    // Perfil citado nos READMEs do GitHub (perfil e CyborgGames).
    linkedin: "https://www.linkedin.com/in/alex-soares-lopes-448b79226/",
  },
};
