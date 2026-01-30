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

#### [x] Schema Prisma: Session
#### [x] Schema Prisma: Seat
#### [x] Criar sessão com: filme, horário, sala, preço
#### [x] Rota POST /sessions

## FASE 3 — Consulta de Disponibilidade

#### [x] Rota POST /seats
#### [x] Rota GET /sessions/:id/seats (Retornar: seatNumber, status (AVAILABLE / RESERVED / SOLD))

# Dia 2

## FASE 4 — Reservas

#### [ ] Schema Prisma: Reservation
#### [ ] Schema Prisma: ReservationSeat
#### [ ] Rota POST /reservations