# FitPulse

**Your Health. Your Coach. Your Progress.**

Projeto Next.js único (sem monorepo) — App Router + TypeScript + Tailwind +
Firebase + Stripe (Phase 10+) + OpenAI (Phase 11+).

## Rodar localmente
```
npm install
npm run dev
```
Abra http://localhost:3000

## Deploy
Ver `docs/DEPLOY_GITHUB_VERCEL.md` para o passo a passo completo de
GitHub → Vercel.

## Idiomas
O site vive em 3 idiomas por URL: `/pt-br`, `/en`, `/es`. A raiz `/` redireciona
para `/pt-br`. Cada item do menu (Início, Recursos, Planos, Sobre, Contato) é
uma página própria dentro de cada idioma — ex: `/pt-br/recursos`, `/en/pricing`... 
na verdade os slugs de página são fixos (`recursos`, `planos`, `sobre`, `contato`)
em todos os idiomas por simplicidade; só o conteúdo é traduzido.

## Status
Phase 0-2 (fundação + design system) — sem integrações reais ainda.
Onde aparecer `[CONFIGURATION REQUIRED]` no código, é porque falta você
colar uma credencial real (Firebase, Stripe, OpenAI) nas variáveis de
ambiente da Vercel.
