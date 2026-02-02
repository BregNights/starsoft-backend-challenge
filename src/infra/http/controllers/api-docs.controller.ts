import { Controller, Get, Header } from '@nestjs/common'

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Starcine API',
    version: '1.0.0',
    description: 'API de venda e reserva de ingressos para cinema.',
  },
  servers: [{ url: 'http://localhost:3333' }],
  paths: {
    '/accounts': {
      post: {
        summary: 'Criar conta de usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Daniel Silva' },
                  email: { type: 'string', example: 'daniel@example.com' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Conta criada' },
          '409': { description: 'Conflito de dados' },
        },
      },
    },
    '/sessions': {
      post: {
        summary: 'Criar sessao',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['movieTitle', 'room', 'startsAt', 'price'],
                properties: {
                  movieTitle: { type: 'string', example: 'Filme X' },
                  room: { type: 'string', example: 'Sala 1' },
                  startsAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2026-02-03T19:00:00.000Z',
                  },
                  price: { type: 'number', example: 25 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Sessao criada' },
          '409': { description: 'Conflito de regra de negocio' },
        },
      },
    },
    '/seats': {
      post: {
        summary: 'Registrar assentos para sessao',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['sessionId', 'seatNumbers'],
                properties: {
                  sessionId: { type: 'string', example: 'session-id' },
                  seatNumbers: {
                    type: 'array',
                    minItems: 16,
                    items: { type: 'string' },
                    example: [
                      'A1',
                      'A2',
                      'A3',
                      'A4',
                      'B1',
                      'B2',
                      'B3',
                      'B4',
                      'C1',
                      'C2',
                      'C3',
                      'C4',
                      'D1',
                      'D2',
                      'D3',
                      'D4',
                    ],
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Assentos registrados' },
          '400': { description: 'Erro de validacao' },
          '409': { description: 'Conflito de regra de negocio' },
        },
      },
    },
    '/sessions/{id}/seats': {
      get: {
        summary: 'Listar assentos da sessao',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Assentos retornados',
          },
          '409': { description: 'Sessao nao encontrada' },
        },
      },
    },
    '/reservations': {
      post: {
        summary: 'Criar reserva',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['seatId', 'sessionId', 'userId'],
                properties: {
                  seatId: { type: 'string' },
                  sessionId: { type: 'string' },
                  userId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Reserva criada',
          },
          '409': { description: 'Conflito de concorrencia ou dados invalidos' },
        },
      },
    },
    '/reservations/confirm': {
      post: {
        summary: 'Confirmar pagamento da reserva',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reservationId', 'userId'],
                properties: {
                  reservationId: { type: 'string' },
                  userId: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '204': { description: 'Reserva confirmada e assento vendido' },
          '409': { description: 'Conflito de regra de negocio' },
        },
      },
    },
    '/users/{id}/purchases': {
      get: {
        summary: 'Historico de compras por usuario',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'Compras confirmadas retornadas' },
          '409': { description: 'Usuario nao encontrado' },
        },
      },
    },
  },
}

@Controller()
export class ApiDocsController {
  @Get('/api-docs/openapi.json')
  getOpenApiJson() {
    return openApiDocument
  }

  @Get('/api-docs')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getSwaggerUi() {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Starcine API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/api-docs/openapi.json',
        dom_id: '#swagger-ui',
      })
    </script>
  </body>
</html>`
  }
}
