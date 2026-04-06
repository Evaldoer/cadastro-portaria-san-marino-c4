# Cadastro Portaria San Marino

Sistema de portaria desenvolvido com Next.js 16 e Supabase.

## Funcionalidades

- painel inicial com atalhos rapidos
- cadastro e listagem de visitantes
- busca por nome, apartamento, RG e CPF
- cadastro e listagem de entregas com foto

## Requisitos

- Node.js 20 ou superior
- npm
- projeto Supabase configurado

## Configuracao

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env.local` com base em `.env.example`.

3. Preencha as variaveis de ambiente:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Rodando localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Observacoes

- `.env.local` nao deve ser enviado para o GitHub porque contem credenciais.
- `.next` e `node_modules` sao gerados localmente e nao devem ser versionados.
- `next-env.d.ts` pode ser recriado automaticamente pelo Next.js.
