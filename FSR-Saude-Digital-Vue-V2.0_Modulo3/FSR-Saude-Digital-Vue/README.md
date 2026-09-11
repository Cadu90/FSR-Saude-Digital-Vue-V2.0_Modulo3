# FSR Saúde Digital — 11º RC Mec

MVP acadêmico evoluído para o **Módulo 3 — Banco de Dados e Controle de Versão**, com front-end Vue.js, API Node.js e banco SQLite.

## Tecnologias
- HTML5 semântico
- CSS3 responsivo
- Vue.js 3 (framework front-end)
- JavaScript ES2022
- Node.js 22+ (servidor HTTP/API)
- SQLite (persistência local)
- SQL (schema, seed e CRUD)
- Git/GitHub

## Estrutura
- `index.html` — interface e estrutura semântica
- `app.js` — estado e interações Vue.js
- `styles.css` — layout responsivo
- `vue.global.js` — Vue 3 local
- `server.js` — servidor web + API + inicialização SQLite
- `database/schema.sql` — entidades, chaves, relacionamentos, restrições e índices
- `database/seed.sql` — dados demonstrativos
- `database/crud.sql` — exemplos de INSERT, SELECT, UPDATE e DELETE
- `database/diagrama-banco-dados.png` — diagrama ER

## Execução
Requer Node.js 22 ou superior. Na pasta do projeto:

```bash
npm start
```

Depois acesse `http://localhost:3000`.

O banco `database/fsr_saude.db` é criado automaticamente na primeira execução e está no `.gitignore`.

## API demonstrativa
- `GET /api/health` — verifica servidor e banco
- `GET /api/agendamentos?usuario_id=1` — lista agendamentos
- `POST /api/agendamentos` — cria agendamento
- `PATCH /api/agendamentos/:id/cancelar` — cancela agendamento
- `GET /api/dependentes?usuario_id=1` — lista dependentes
- `GET /api/historico?usuario_id=1` — consulta histórico
- `GET /api/notificacoes?usuario_id=1` — consulta notificações
- `PATCH /api/notificacoes/marcar-lidas` — atualiza notificações
- `POST /api/suporte` — registra solicitação

## Controle de versão
Fluxo sugerido: branch `main` para a versão estável e branches `feature/*` para mudanças isoladas. Os commits devem ser pequenos e descritivos.

## Repositório GitHub
https://github.com/Cadu90/FSR-Saude-Digital-Vue-V2.0/tree/main/FSR-Saude-Digital-Vue

> O endereço acima é o repositório informado para o projeto. A publicação efetiva de novos commits depende da autenticação e permissão de escrita na conta GitHub.

## Limitações
A aplicação continua sendo um MVP acadêmico. Não há integração real com o 11º RC Mec, FSR, FUSEX, prontuário eletrônico ou autenticação institucional. Os dados são demonstrativos.
