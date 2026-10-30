# Madeira de Quintal — base de e-commerce

Projeto Next.js + TypeScript + PostgreSQL/Prisma. A identidade visual inicial está em `public/homepage-concept.png`; a homepage usa esse conceito visual como banner de referência. Não há produtos, avaliações, preços comerciais ou contatos fictícios sem marcação.

## Estado real do projeto

Implementado no código-base: homepage responsiva; esquema persistente para usuários, endereços, categorias, produtos, pedidos, itens, pagamentos, cupons, configurações e auditoria; login por cookie HttpOnly e JWT assinado; rotas de catálogo e cadastro administrativo de produtos; consulta/atualização administrativa de pedidos; criação de pedido com revalidação de preços e decremento de estoque transacional; criação de preferência de checkout Mercado Pago quando as credenciais estiverem configuradas; endpoint de webhook que verifica assinatura e consulta o pagamento no provedor antes de atualizar estado.

Ainda requer desenvolvimento/configuração antes de produção: frontend completo de catálogo/carrinho/checkout e gestão visual de produtos/pedidos; cadastro/recuperação de clientes; upload de imagens; cálculo de frete real e consulta CEP; cupons aplicados no servidor; política LGPD revisada para a operação real; rate limiting; testes automatizados; observabilidade; configuração de domínio, SMTP e deploy. O formulário de pedido ainda aceita frete informado pelo cliente e precisa ser alterado para usar somente cotações confiáveis do servidor antes de publicar. Não operar com dados reais até corrigir este ponto.

## Requisitos
- Node.js 20.9+ (recomendado LTS atual)
- PostgreSQL 15+
- npm

## Executar localmente
1. Instale Node.js e PostgreSQL.
2. Crie banco e usuário, por exemplo `madeira_quintal`.
3. Copie `.env.example` para `.env` e ajuste `DATABASE_URL` e `AUTH_SECRET` (mínimo 32 caracteres aleatórios). Não versionar `.env`.
4. Instale dependências: `npm install`.
5. Gere Prisma e aplique migrações: `npx prisma generate` e `npx prisma migrate dev --name init`.
6. Cadastre categorias iniciais: `npm run db:seed`.
7. Crie administrador: `npm run admin:create -- "Nome do Admin" admin@seu-dominio.com "use-uma-senha-forte-com-14-caracteres-ou-mais"`.
8. Inicie: `npm run dev`; acesse `http://localhost:3000` e `/admin`.

## Mercado Pago
1. Crie/configure uma aplicação na conta do Mercado Pago.
2. Use credenciais de TESTE primeiro. Defina `MERCADOPAGO_ACCESS_TOKEN` somente no ambiente do servidor e `APP_URL` com URL HTTPS pública de teste.
3. Configure webhook para `https://SEU_DOMINIO/api/webhooks/mercadopago` e copie o segredo de assinatura para `MERCADOPAGO_WEBHOOK_SECRET`.
4. Configure no painel do provedor os eventos de pagamento adequados; teste aprovado, pendente, rejeitado, repetição de notificação, valor divergente e assinatura inválida.
5. Confirme a assinatura de webhook conforme a documentação atual do Mercado Pago e valide a integração no ambiente de teste antes de usar credenciais de produção.
6. Não use `init_point` de produção até concluir os testes. O endpoint de checkout retorna erro 503 se o token não estiver configurado.

## Frete e CEP
Nenhum serviço logístico está ativo. Escolha um provedor compatível (Correios/transportadora/agregador), configure credenciais no servidor e implemente cotação autenticada usando CEP, peso, dimensões, origem e prazo de fabricação. O servidor deve calcular e gravar o valor final do frete, nunca confiar no valor enviado pelo navegador.

## Deploy em servidor próprio
- Linux com atualizações de segurança, firewall, SSH por chave e usuário sem privilégios.
- PostgreSQL não exposto publicamente; backup automatizado e teste de restauração.
- Reverse proxy (ex.: Nginx/Caddy) com TLS, `APP_URL` HTTPS e processo Next.js gerido por systemd/Docker.
- Variáveis secretas no gerenciador de segredos/ambiente do servidor, logs sem dados de cartão/senhas, monitorização e alertas.
- Em deploy, executar `npx prisma migrate deploy`, `npm run build` e `npm start`.
- Antes de abrir vendas, completar testes automatizados, proteção de força bruta/rate limit, recuperação de senha, e-mail transacional, consentimentos/cookies conforme aplicável, termos e política revisados, acessibilidade e testes de ponta a ponta.

## Rotas atuais
- `POST /api/auth/login`, `POST /api/auth/logout`
- `GET /api/products?q=&category=&sort=&page=`
- `POST /api/admin/products` (ADMIN)
- `GET /api/admin/orders` e `PATCH /api/admin/orders` (ADMIN)
- `POST /api/orders` (cria pedido e reserva/decrementa estoque; ainda não inicia pagamento)
- `POST /api/checkout` (cria preferência de pagamento, se configurado)
- `POST /api/webhooks/mercadopago` (verifica assinatura e consulta pagamento)

## Aviso de produção
Esta entrega é uma base funcional de desenvolvimento, não uma certificação de segurança nem uma loja pronta para faturar. A integração de pagamento/frete só pode ser declarada operacional após configuração de credenciais e testes reais documentados. Faça revisão técnica e jurídica antes de processar dados pessoais ou aceitar pedidos reais.
