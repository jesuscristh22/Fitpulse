# Deploy: GitHub → Vercel (passo a passo)

1. Crie um repositório novo no GitHub (ex: `fitpulse`).
2. Extraia este zip numa pasta local.
3. No terminal, dentro da pasta:
   ```
   git init
   git add .
   git commit -m "FitPulse - fundação inicial"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/fitpulse.git
   git push -u origin main
   ```
4. Na Vercel: New Project → Import o repositório `fitpulse`.
5. Como é um projeto Next.js normal na raiz, a Vercel detecta tudo sozinha
   (Framework Preset: Next.js, Root Directory: `.`, Build Command: `next build`).
   Não precisa mexer em nada.
6. Antes de clicar em Deploy, adicione as variáveis de ambiente do
   `.env.example` em Environment Variables (pode deixar em branco por
   enquanto — o app builda mesmo sem elas nesta fase).
7. Clique em Deploy.
