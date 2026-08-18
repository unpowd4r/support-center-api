export const swaggerDocument = {
  openapi: "3.0.0",

  info: {
    title: "Support Center API",
    version: "1.0.0",
    description:
      "REST API для поддержки тикетов: создание обращений, просмотр карточек, назначение операторов и работа с сообщениями.",
  },

  servers: [
    {
      url: "http://localhost:3030",
      description: "Локальный сервер разработки",
    },
  ],

  tags: [
    {
      name: "Tickets",
      description: "Операции с тикетами поддержки",
    },
    {
      name: "Messages",
      description: "Переписка внутри тикета",
    },
  ],

  components: {
    schemas: {
      TicketStatus: {
        type: "string",
        enum: ["NEW", "IN_PROGRESS", "WAITING_CUSTOMER", "RESOLVED"],
        example: "IN_PROGRESS",
      },

      TicketPriority: {
        type: "string",
        enum: ["LOW", "NORMAL", "HIGH", "CRITICAL"],
        example: "NORMAL",
      },

      MessageAuthor: {
        type: "string",
        enum: ["CLIENT", "OPERATOR"],
        example: "OPERATOR",
      },

      Ticket: {
        type: "object",
        required: [
          "id",
          "subject",
          "status",
          "priority",
          "createdAt",
          "lastMessageAt",
          "assignedTo",
        ],
        properties: {
          id: {
            type: "string",
            example: "1",
            description: "Уникальный идентификатор тикета",
          },
          subject: {
            type: "string",
            example: "Не проходит оплата",
            description: "Краткое описание проблемы",
          },
          status: {
            $ref: "#/components/schemas/TicketStatus",
          },
          priority: {
            $ref: "#/components/schemas/TicketPriority",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-18T16:00:00.000Z",
          },
          lastMessageAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-18T16:05:00.000Z",
          },
          assignedTo: {
            type: "string",
            nullable: true,
            example: "operator-7",
            description: "ID назначенного оператора или null",
          },
        },
      },

      TicketStatusResponse: {
        type: "object",
        required: ["id", "status"],
        properties: {
          id: {
            type: "string",
            example: "1",
            description: "ID тикета",
          },
          status: {
            $ref: "#/components/schemas/TicketStatus",
          },
        },
      },

      Message: {
        type: "object",
        required: ["id", "ticketId", "author", "text", "createdAt"],
        properties: {
          id: {
            type: "string",
            example: "message-1",
          },
          ticketId: {
            type: "string",
            example: "1",
          },
          author: {
            $ref: "#/components/schemas/MessageAuthor",
          },
          text: {
            type: "string",
            example:
              "Здравствуйте, уточните, пожалуйста, какой способ оплаты используете?",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-18T16:10:00.000Z",
          },
        },
      },

      CreateTicketRequest: {
        type: "object",
        required: ["subject"],
        properties: {
          subject: {
            type: "string",
            example: "Не проходит оплата",
            description: "Тема нового обращения",
          },
          priority: {
            $ref: "#/components/schemas/TicketPriority",
          },
        },
      },

      AssignTicketRequest: {
        type: "object",
        required: ["operatorId"],
        properties: {
          operatorId: {
            type: "string",
            example: "operator-7",
            description: "ID оператора, которому назначается тикет",
          },
        },
      },

      CreateTicketMessageRequest: {
        type: "object",
        required: ["text"],
        properties: {
          text: {
            type: "string",
            example: "Проверил логи, проблема воспроизводится.",
            description: "Текст сообщения от оператора",
          },
        },
      },

      UpdateTicketStatusRequest: {
        type: "object",
        required: ["newTicketStatus"],
        properties: {
          newTicketStatus: {
            $ref: "#/components/schemas/TicketStatus",
          },
        },
      },

      ValidationError: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            example: "Поле subject обязательно",
          },
        },
      },

      AppErrorCode: {
        type: "string",
        enum: [
          "TICKET_NOT_FOUND",
          "TICKET_ALREADY_ASSIGNED",
          "TICKET_RESOLVED",
          "INTERNAL_SERVER_ERROR",
        ],
        example: "TICKET_NOT_FOUND",
      },

      AppError: {
        type: "object",
        required: ["code", "message"],
        properties: {
          code: {
            $ref: "#/components/schemas/AppErrorCode",
          },
          message: {
            type: "string",
            example: "Тикет не найден",
          },
        },
      },
    },

    parameters: {
      TicketId: {
        name: "id",
        in: "path",
        required: true,
        description: "ID тикета",
        schema: {
          type: "string",
          example: "1",
        },
      },
    },

    responses: {
      BadRequest: {
        description: "Некорректные входные данные",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ValidationError",
            },
            example: {
              message: "Неверный формат ID",
            },
          },
        },
      },

      UnprocessableEntity: {
        description:
          "Запрос синтаксически корректен, но не прошёл бизнес-валидацию",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ValidationError",
            },
            example: {
              message: "Поле operatorId обязательно",
            },
          },
        },
      },

      NotFound: {
        description: "Ресурс не найден",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AppError",
            },
            example: {
              code: "TICKET_NOT_FOUND",
              message: "Тикет не найден",
            },
          },
        },
      },

      ConflictResolved: {
        description: "Операция недоступна для закрытого тикета",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AppError",
            },
            example: {
              code: "TICKET_RESOLVED",
              message: "Тикет уже закрыт",
            },
          },
        },
      },

      ConflictAssigned: {
        description: "Тикет уже назначен другому оператору",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AppError",
            },
            example: {
              code: "TICKET_ALREADY_ASSIGNED",
              message: "У тикета уже есть назначенный оператор",
            },
          },
        },
      },

      InternalServerError: {
        description: "Внутренняя ошибка сервера",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AppError",
            },
            example: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Внутренняя ошибка сервера",
            },
          },
        },
      },
    },
  },

  paths: {
    "/api/tickets": {
      get: {
        tags: ["Tickets"],
        summary: "Получить список тикетов",
        description: "Возвращает все тикеты из текущего in-memory хранилища.",
        responses: {
          "200": {
            description: "Список тикетов",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Ticket",
                  },
                },
                example: [
                  {
                    id: "1",
                    subject: "Не проходит оплата",
                    status: "NEW",
                    priority: "HIGH",
                    createdAt: "2026-08-18T16:00:00.000Z",
                    lastMessageAt: "2026-08-18T16:00:00.000Z",
                    assignedTo: null,
                  },
                  {
                    id: "2",
                    subject: "Не могу войти",
                    status: "NEW",
                    priority: "NORMAL",
                    createdAt: "2026-08-18T16:03:00.000Z",
                    lastMessageAt: "2026-08-18T16:03:00.000Z",
                    assignedTo: null,
                  },
                ],
              },
            },
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },

      post: {
        tags: ["Tickets"],
        summary: "Создать тикет",
        description:
          "Создаёт новый тикет со статусом NEW. Если priority не передан, используется NORMAL.",
        requestBody: {
          required: true,
          description: "Данные нового тикета",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTicketRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Тикет создан",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Ticket",
                },
                example: {
                  id: "9b0c9f96-6dd2-4e16-ae55-bf63176d9d64",
                  subject: "Ошибка при сохранении профиля",
                  status: "NEW",
                  priority: "HIGH",
                  createdAt: "2026-08-18T16:20:00.000Z",
                  lastMessageAt: "2026-08-18T16:20:00.000Z",
                  assignedTo: null,
                },
              },
            },
          },
          "400": {
            description: "Не передано обязательное поле subject",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                example: {
                  message: "Поле subject обязательно",
                },
              },
            },
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },

    "/api/tickets/{id}": {
      get: {
        tags: ["Tickets"],
        summary: "Получить тикет по ID",
        description: "Возвращает карточку конкретного тикета.",
        parameters: [
          {
            $ref: "#/components/parameters/TicketId",
          },
        ],
        responses: {
          "200": {
            description: "Тикет найден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Ticket",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            description: "Тикет с указанным ID не найден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                example: {
                  message: "Тикет не найден",
                },
              },
            },
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },

    "/api/tickets/{id}/status": {
      get: {
        tags: ["Tickets"],
        summary: "Получить статус тикета",
        description:
          "Возвращает текущий статус тикета по его ID в компактном формате.",
        parameters: [
          {
            $ref: "#/components/parameters/TicketId",
          },
        ],
        responses: {
          "200": {
            description: "Статус тикета",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TicketStatusResponse",
                },
                example: {
                  id: "1",
                  status: "IN_PROGRESS",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },

      post: {
        tags: ["Tickets"],
        summary: "Обновить статус тикета",
        description:
          "Изменяет текущий статус тикета по ID и возвращает обновлённое состояние в компактном формате.",
        parameters: [
          {
            $ref: "#/components/parameters/TicketId",
          },
        ],
        requestBody: {
          required: true,
          description: "Новый статус тикета",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/UpdateTicketStatusRequest",
              },
              example: {
                newTicketStatus: "RESOLVED",
              },
            },
          },
        },
        responses: {
          "202": {
            description: "Статус тикета принят и обновлён",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/TicketStatusResponse",
                },
                example: {
                  id: "1",
                  status: "RESOLVED",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },

    "/api/tickets/{id}/assign": {
      post: {
        tags: ["Tickets"],
        summary: "Назначить тикет оператору",
        description:
          "Назначает тикет оператору и переводит его в статус IN_PROGRESS. Операция недоступна для уже назначенных или закрытых тикетов.",
        parameters: [
          {
            $ref: "#/components/parameters/TicketId",
          },
        ],
        requestBody: {
          required: true,
          description: "Данные для назначения тикета",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AssignTicketRequest",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Тикет успешно назначен",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Ticket",
                },
                example: {
                  id: "1",
                  subject: "Не проходит оплата",
                  status: "IN_PROGRESS",
                  priority: "HIGH",
                  createdAt: "2026-08-18T16:00:00.000Z",
                  lastMessageAt: "2026-08-18T16:00:00.000Z",
                  assignedTo: "operator-7",
                },
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "422": {
            $ref: "#/components/responses/UnprocessableEntity",
          },
          "404": {
            $ref: "#/components/responses/NotFound",
          },
          "409": {
            description: "Конфликт состояния тикета",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/AppError",
                },
                examples: {
                  ticketResolved: {
                    summary: "Тикет уже закрыт",
                    value: {
                      code: "TICKET_RESOLVED",
                      message: "Тикет уже закрыт",
                    },
                  },
                  alreadyAssigned: {
                    summary: "Тикет уже назначен",
                    value: {
                      code: "TICKET_ALREADY_ASSIGNED",
                      message: "У тикета уже есть назначенный оператор",
                    },
                  },
                },
              },
            },
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },

    "/api/tickets/{id}/messages": {
      get: {
        tags: ["Messages"],
        summary: "Получить сообщения тикета",
        description: "Возвращает все сообщения, привязанные к тикету.",
        parameters: [
          {
            $ref: "#/components/parameters/TicketId",
          },
        ],
        responses: {
          "200": {
            description: "Список сообщений тикета",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Message",
                  },
                },
                example: [
                  {
                    id: "message-1",
                    ticketId: "1",
                    author: "OPERATOR",
                    text: "Уточните, пожалуйста, номер заказа.",
                    createdAt: "2026-08-18T16:15:00.000Z",
                  },
                ],
              },
            },
          },
          "400": {
            $ref: "#/components/responses/BadRequest",
          },
          "404": {
            description: "Тикет с указанным ID не найден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                example: {
                  message: "Тикет не найден",
                },
              },
            },
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },

      post: {
        tags: ["Messages"],
        summary: "Добавить сообщение в тикет",
        description:
          "Создаёт новое сообщение от оператора и обновляет поле lastMessageAt у тикета.",
        parameters: [
          {
            $ref: "#/components/parameters/TicketId",
          },
        ],
        requestBody: {
          required: true,
          description: "Текст нового сообщения",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateTicketMessageRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Сообщение создано",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Message",
                },
                example: {
                  id: "16e59969-f068-4456-90b2-39aa2975a409",
                  ticketId: "1",
                  author: "OPERATOR",
                  text: "Проблема локализована, работаем над исправлением.",
                  createdAt: "2026-08-18T16:25:00.000Z",
                },
              },
            },
          },
          "400": {
            description:
              "Не передано обязательное поле text или указан невалидный ID",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                examples: {
                  invalidId: {
                    summary: "Неверный формат ID",
                    value: {
                      message: "Неверный формат ID",
                    },
                  },
                  missingText: {
                    summary: "Отсутствует текст сообщения",
                    value: {
                      message: "Поле text обязательно",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Тикет с указанным ID не найден",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ValidationError",
                },
                example: {
                  message: "Тикет не найден",
                },
              },
            },
          },
          "500": {
            $ref: "#/components/responses/InternalServerError",
          },
        },
      },
    },
  },
};
