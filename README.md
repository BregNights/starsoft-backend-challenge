# Starcine Backend Challenge

API para gestao de sessoes, assentos, reservas temporarias e confirmacao de compra de ingressos.

## 1) Visao Geral

Esta solucao implementa:
- Cadastro de usuarios
- Criacao de sessao de cinema
- Registro de assentos por sessao (minimo 16 por requisicao)
- Consulta de disponibilidade de assentos
- Reserva temporaria com expiracao
- Confirmacao de pagamento (converte reserva em venda)
- Historico de compras por usuario

## 2) Tecnologias Escolhidas

- **NestJS**: estrutura modular e facil separacao entre controller/use case/repository.
- **PostgreSQL + Prisma**: persistencia relacional e operacoes atomicas para controle de concorrencia.
- **Redis (ioredis)**: controle de expiracao de reserva (TTL) e coordenacao leve entre instancias.
- **Vitest + Supertest**: testes unitarios e E2E.

### Por que essas escolhas
- PostgreSQL garante consistencia transacional e suporte forte para concorrencia.
- Redis reduz custo de verificacao de expiracao e ajuda no fluxo temporario de reserva.
- Prisma acelera modelagem e acesso ao banco com tipagem.

## 3) Como Executar

### Pre-requisitos
- Node.js 20+
- pnpm
- Docker + Docker Compose

### Subir infraestrutura
```bash
docker compose up -d
```

### Configurar ambiente
Crie o arquivo `.env` (ou use o existente) com:
```env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/starcine?schema=public"
```

### Instalar dependencias
```bash
pnpm install
```

### Rodar migrations
```bash
pnpm prisma migrate deploy
```

### Subir API
```bash
pnpm start:dev
```

### Executar testes
```bash
pnpm test
pnpm test:e2e
```

## 4) Estrategias Implementadas

### Race condition
- A reserva usa operacao atomica no banco para trocar status do assento de `AVAILABLE` para `RESERVED`.
- Em corrida para o mesmo assento, apenas uma requisicao consegue reservar; a outra recebe conflito.
- Existe teste E2E validando 2 compras simultaneas para o mesmo assento.

### Coordenacao entre multiplas instancias
- O estado principal fica no PostgreSQL.
- Redis guarda expiracao da reserva (TTL), evitando dependencia de estado local da instancia.
- Jobs de expiracao consultam estado compartilhado (DB + Redis), nao memoria local.

### Deadlocks
- O fluxo atual reserva 1 assento por requisicao de compra, reduzindo risco de deadlock por lock ordering multiplo.
- Para multiplos assentos em uma unica compra, ainda nao ha estrategia completa de ordenacao global/lock pessimista.

## 5) Endpoints da API (com exemplos)

### Swagger/OpenAPI
- UI: `GET /api-docs`
- JSON OpenAPI: `GET /api-docs/openapi.json`

### Criar conta
`POST /accounts`
```json
{
  "name": "Daniel Silva",
  "email": "daniel@example.com"
}
```

### Criar sessao
`POST /sessions`
```json
{
  "movieTitle": "Filme X",
  "room": "Sala 1",
  "startsAt": "2026-02-03T19:00:00.000Z",
  "price": 25
}
```

### Registrar assentos
`POST /seats`
```json
{
  "sessionId": "SESSION_ID",
  "seatNumbers": [
    "A1","A2","A3","A4",
    "B1","B2","B3","B4",
    "C1","C2","C3","C4",
    "D1","D2","D3","D4"
  ]
}
```

### Buscar assentos da sessao
`GET /sessions/:id/seats`

### Criar reserva
`POST /reservations`
```json
{
  "seatId": "SEAT_ID",
  "sessionId": "SESSION_ID",
  "userId": "USER_ID"
}
```

### Confirmar pagamento
`POST /reservations/confirm`
```json
{
  "reservationId": "RESERVATION_ID",
  "userId": "USER_ID"
}
```

### Historico de compras por usuario
`GET /users/:id/purchases`

## 6) Decisoes Tecnicas

- Arquitetura em camadas (controller -> use case -> repository) para isolar regra de negocio.
- Validacao de entrada com Zod via pipe customizado.
- Entidade `Seat` com status (`AVAILABLE`, `RESERVED`, `SOLD`) para deixar fluxo explicito.
- Confirmacao de pagamento separada da criacao da reserva (simula processo real assicrono).
- Uso de testes E2E para validar comportamento real da API sob concorrencia.

## 7) Limitacoes Conhecidas

- Mensageria (Kafka/RabbitMQ) ainda nao foi implementada.
- Historico de compras retorna dados de reserva confirmada, sem detalhes da sessão.
- Nao foi implementado a compra de multiplos assentos.
- Não foi implementado logs.

## 8) Melhorias Futuras

- Integrar mensageria para eventos: reserva criada, pagamento confirmado, reserva expirada, assento liberado.
- Adicionar autenticacao (JWT) e usar usuario autenticado no historico/compras.
- Expandir historico com dados da sessao e valor pago.
- Implementar compra de multiplos assentos
- Adicionar logs e metricas.
- Adicionar autenticacao