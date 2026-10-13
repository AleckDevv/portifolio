# Verificação dos projetos

Levantamento feito em **13/10/2026** para que o portfólio descreva cada projeto com informações verdadeiras.

## Método

- **Metadados pela API do GitHub:** data de criação, linguagens detectadas, `homepage` e registros de deploy (Vercel e GitHub Pages).
- **Leitura direta dos arquivos de cada repositório**, sem clonar e sem alterar nada: README, `package.json`/`pom.xml`, HTML, CSS e código-fonte dos pontos citados no site.
- **Demonstrações publicadas:**
  - abertas no Google Chrome (headless) em 1440 px e 390 px;
  - medição de rolagem horizontal em 390 e 768 px;
  - checagem de erros de JavaScript;
  - capturas de tela usadas no site.
- **Conveniência THR:** a demo começa vazia, então os produtos e as movimentações das capturas foram cadastrados pela própria interface, apenas no navegador de teste.

## Resumo

| # | Projeto | Demonstração | Imagens no site | Observações |
|---|---|---|---|---|
| 01 | Vieira Gestão Operacional | Vercel ✓ | Capturas da demo (10 módulos, tema escuro, celular) | — |
| 02 | Conveniência THR | Vercel ✓ | Capturas da demo com dados de exemplo | Repositório sem README |
| 03 | RestaurArt (repo *Fotos*) | Vercel ✓ | Capturas da demo (8 seções) | — |
| 04 | IaWorkout | **Sem demo pública** | Capturas que já existem no repositório | Ver nota sobre o README |
| 05 | CyborgGames | GitHub Pages ✓ | Capturas da demo (menu mobile aberto) | Layout de referência TemplateMo |
| 06 | Starbucks — estudo de interface | GitHub Pages ✓ | Capturas da demo | Projeto educacional, sem vínculo com a marca |
| 07 | B7 Burger | GitHub Pages ✓ | Capturas da demo | Interface estática |
| 08 | Agência XYZ | GitHub Pages ✓ (sem CSS) | Capturas do autor incluídas no repositório | **CSS vazio no repositório** |
| 09 | Medicenter | GitHub Pages ✓ | Capturas da demo | Não é responsivo |

Sem rolagem horizontal em 390 e 768 px: projetos 01, 02, 03, 05, 06 e 07. Com rolagem horizontal: 08 (+1618 px em 390) e 09 (+217 px em 390). Nenhuma demo apresentou erros de JavaScript.

## Pontos que pedem sua atenção

1. **Agência XYZ:** `src/style/style.css` tem 0 bytes nos dois commits do repositório.
   - Por isso a página publicada aparece sem estilos.
   - As capturas estilizadas que você incluiu em `src/resultado-site/` mostram que o CSS existia na sua máquina.
   - Commitar esse arquivo corrige a publicação; depois, a nota de transparência em `projects.ts` pode ser removida.
   - O link do README (`aaleckdev.github.io/alex-projeto-agencia-xyz…`) retorna 404; o portfólio usa o endereço correto.
2. **IaWorkout:**
   - O README diz que os treinos são gerados "baseados no perfil e avaliações físicas". No código (`IaWorkoutService`), o prompt usa **objetivo, nível e o último histórico de cargas**, sem as avaliações físicas, e o site descreve exatamente isso.
   - O chatbot do aluno funciona por menus, sem IA, e o site deixa isso claro.
   - Se houver uma demonstração publicada, informe a URL para ela ser incluída.
3. **B7 Burger:** o README fala em "fazer pedidos online", mas a página é só HTML e CSS. Os botões "Fazer pedido", a busca e o seletor de categoria são visuais, e o site não atribui pedidos ao projeto.
4. **Medicenter:**
   - O README diz "design responsivo", mas o CSS não tem media queries e a página transborda em telas pequenas; o site o descreve como layout de desktop.
   - O conteúdo é de exemplo (lorem ipsum) e "Make an Appointment" é só texto, sem agendamento.
5. **Vieira:**
   - O README recomenda compartilhar o endereço da demo "só com quem deve vê-lo", e o `vercel.json` aplica `noindex`.
   - Como o próprio repositório já exibe esse endereço publicamente (campo *homepage*), o link foi incluído.
   - Se preferir não divulgá-lo, remova `links.demo` do projeto 01 em `src/content/projects.ts`.
6. **E-mail de contato:** usei `alexsoareslopes688@gmail.com`, que aparece no README do B7 Burger. O README do seu perfil traz um modelo não preenchido (`SEU-EMAIL-AQUI`). Confirme em `src/content/profile.ts`.
7. **Formação:** não encontrei informação verificável e não inventei nada. Preencha `education` em `src/content/profile.ts` para o bloco aparecer em "Sobre".

## Detalhes por projeto

### 01 — Vieira Gestão Operacional (`sistema_prototipo_vieira`)

- **Confirmado:** protótipo de sistema de gestão de frota para apresentação à diretoria da Vieira Serviços e Transportes.
  - **Tecnologia:** HTML, CSS e JavaScript em módulos ES6, sem frameworks nem backend, com persistência em LocalStorage e dados fictícios.
  - **Módulos (10, conferidos em `js/router.js` e na demo):** dashboard, veículos, manutenção, compras, estoque, peças por veículo, abastecimento, despesas, relatórios e usuários.
  - **Perfis:** 8, com permissões simuladas.
- **Documentado no README, não conferido no repositório:** as 44 verificações ponta a ponta e as auditorias de responsividade e contraste. Os testes não estão versionados.

### 02 — Conveniência THR (`convenienciaTHR`)

- **Confirmado no código:**
  - React 18, Vite 6 e Context API.
  - Cadastro, edição e exclusão de produtos, com validações.
  - Entradas e saídas; uma saída maior que o saldo é bloqueada (testado na demo).
  - Alerta de estoque mínimo.
  - Busca com debounce.
  - Exportação `.xls` gerada por HTML com `mso-number-format`, sem dependências.
  - Backup e restauração em JSON com validação.
  - LocalStorage com migração de chaves antigas.

### 03 — RestaurArt (`Fotos`)

- **Confirmado:** landing page de um serviço de restauração de fotos.
  - **Tecnologia:** React 19, Vite 8, Tailwind 3, Framer Motion e Lucide.
  - **Recursos:**
    - comparador antes/depois (clip-path, mouse e toque);
    - planos com links `wa.me` e mensagem pré-preenchida;
    - rolagem suave;
    - rodapé com Instagram, WhatsApp e e-mail.
- **Limite da descrição:** o site apresenta o serviço; a restauração em si não é feita pela página, e o portfólio não diz que é.

### 04 — IaWorkout (`IaWorkout`)

- **Confirmado no código:**
  - **Back-end:** Java 17, Spring Boot 3.3 (Web, Data JPA, Security, Validation, AOP), JWT (`java-jwt`), MySQL 8, Flyway (22 migrations), Maven, Apache POI (importação de alunos por `.xlsx`).
  - **Front-end:** React 18, React Router, Axios, Recharts, `@react-pdf/renderer` (PDF da ficha).
  - **Infraestrutura:** Docker Compose e Nginx.
  - **IA:** chamada à API de Chat Completions da OpenAI (`gpt-3.5-turbo`) com `response_format: json_object`, `@Async`, até 3 tentativas em erros 5xx.
  - **Ciclo da ficha:** status `PENDENTE_IA` → `PENDENTE_INSTRUTOR` → `ATIVA` (`PUT /fichas/{id}/aprovar`). O portal do aluno só busca fichas ativas.
  - **Perfis:** ADMIN, INSTRUTOR, ALUNO e SUPER_ADMIN.
  - **Rotinas:** verificação diária de vencimentos (`@Scheduled`).
- **Sem demonstração pública:** nenhum registro de deploy no GitHub. Os endereços prováveis na Vercel, com o sufixo da sua equipe, retornam 404.
- **Imagens:** capturas existentes em `landing-page/src/assets/`.

### 05 — CyborgGames (`projeto-CyborgGames`)

- **Confirmado:**
  - HTML e CSS com variáveis em `:root`.
  - Três media queries (1000, 768 e 426 px).
  - Menu mobile em JavaScript, testado na demo.
  - Cards com hover e seção de biblioteca.
  - O rodapé credita o design à TemplateMo (Cyborg Gaming).

### 06 — Starbucks (`AleckDevv-projeto-starbucks.github.io`)

- **Confirmado:**
  - HTML e CSS com três media queries.
  - Campo de busca apenas visual.
  - Efeitos de hover.
  - Créditos do layout para a Nicepage.
  - README declara fins educacionais.
- **No site:** o selo "Projeto educacional · sem vínculo com a marca" aparece junto do título.

### 07 — B7 Burger (`AleckDevv-projeto-b7-burger.github.io`)

- **Confirmado:**
  - HTML e CSS, sem JavaScript.
  - Media queries com sintaxe de intervalo.
  - Grade de produtos em 3, 2 ou 1 coluna.
  - O ícone de menu mobile é decorativo.
  - O arquivo `.fig` (Figma) está no repositório; o rodapé credita a B7Web.

### 08 — Agência XYZ (`AleckDevv-projeto-agencia.github.io`)

- **Confirmado:** estrutura HTML de site institucional com início, sobre, serviços (ícones Font Awesome), portfólio em grade e formulário de contato.
- **Pendente:** a camada de estilos não está no repositório (ver "Pontos que pedem sua atenção").

### 09 — Medicenter (`AleckDevv-projeto-medcenter.github.io`)

- **Confirmado:**
  - Recriação, para estudo, do template MediCenter da QuanticaLabs, com crédito no rodapé.
  - HTML e CSS com Flexbox.
  - Hover no menu e nos botões.
  - Página estática, sem agendamento.
