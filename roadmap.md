# Dia 1

## FASE 0 — Base do Projeto

#### [x] Criar repositório
#### [x] Setup NestJS
#### [x] Configurar Prisma + PostgreSQL
#### [x] Docker, Docker Compose

## FASE 1 — Usuários

#### [x] Schema Prisma: User
#### [x] Rota POST /users
#### [x] Validação unique email
#### [x] Teste manual

## FASE 2 — Sessões de Cinema

#### [ ] Schema Prisma: Session
#### [ ] Schema Prisma: Seat
#### [ ] Criar sessão com: filme, horário, sala, preço, geração automática de assentos (mín. 16)
#### [ ] Rota POST /sessions

## FASE 3 — Consulta de Disponibilidade

#### [ ] Rota GET /sessions/:id/seats
#### [ ] Retornar: seatNumber, status (AVAILABLE / RESERVED / SOLD)

# Dia 2