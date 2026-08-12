# Copa de Ex-Alunos de Futsal — publicar o site

Duas etapas: (1) criar o banco de dados grátis no Supabase, (2) me mandar
as chaves pra eu terminar de preparar o site pronto pra publicar.

## Etapa 1 — Criar o banco (Supabase, grátis)

1. Acesse **https://supabase.com** e clique em "Start your project" /
   "Sign up". Pode entrar com o Google.
2. Clique em **New project**.
   - Nome: `copa-santa-ursula` (ou o que preferir)
   - Senha do banco: crie uma senha forte e **guarde ela** (não é a
     mesma coisa das senhas de login do app)
   - Região: escolha a mais perto (South America - São Paulo, se
     aparecer)
   - Plano: **Free**
3. Espere o projeto terminar de criar (leva ~1-2 minutos).
4. No menu da esquerda, clique em **SQL Editor** → **New query**.
5. Abra o arquivo `supabase-setup.sql` (que está junto com este),
   copie todo o conteúdo, cole no editor e clique em **Run**.
   Isso cria a "tabela" onde o app guarda tudo.
6. No menu da esquerda, clique em **Settings** (ícone de engrenagem) →
   **API**.
7. Copie dois valores:
   - **Project URL** (algo como `https://xxxxx.supabase.co`)
   - **anon public** key (uma chave longa)

## Etapa 2 — Me manda esses dois valores

Cola aqui no chat:
- Project URL: `...`
- anon public key: `...`

Assim que eu tiver isso, eu termino de configurar o site e te devolvo
uma pasta pronta (`dist`) — você só vai precisar arrastar essa pasta
pro **https://app.netlify.com/drop** (não precisa de conta, não precisa
digitar nenhum código) e o site fica no ar na hora, com um link público
que funciona em qualquer lugar. Se quiser manter esse link permanente
(em vez de expirar), o Netlify vai te oferecer criar uma conta grátis
na hora — vale fazer.

## Se eu precisar mudar algo no site depois

É só eu atualizar o código aqui e te mandar a pasta `dist` de novo —
você arrasta ela de novo pro mesmo site do Netlify (se já tiver
"reivindicado" com uma conta) e ele atualiza sozinho.
