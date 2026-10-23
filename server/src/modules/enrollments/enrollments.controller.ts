import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from "@nestjs/swagger";

import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { EnrollmentResponseDto } from "./dto/enrollment-response.dto";
import { EnrollmentsService } from "./enrollments.service";

@ApiTags("Matrículas")
@ApiProduces("application/json")
@Controller("api/enrollments")
export class EnrollmentsController {
  constructor(private readonly service: EnrollmentsService) {}

  @Post()
  @ApiOperation({
    summary: "Cadastrar matrícula",
    description:
      "Matricula um aluno em uma disciplina. O aluno e a disciplina " +
      "devem estar previamente cadastrados. A combinação de RA e ID " +
      "da disciplina deve ser única. A data da matrícula é gerada " +
      "automaticamente pelo banco de dados. Propriedades não previstas " +
      "no DTO são rejeitadas.",
  })
  @ApiConsumes("application/json")
  @ApiBody({
    description:
      "RA do aluno e ID da disciplina. Ambos são obrigatórios " +
      "e devem ser números inteiros positivos.",
    type: CreateEnrollmentDto,
    required: true,
    examples: {
      cadastro: {
        summary: "Matricular um aluno em uma disciplina",
        value: {
          studentRa: 2026001,
          courseId: 1,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Matrícula cadastrada com sucesso.",
    type: EnrollmentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      "Corpo inválido: campos obrigatórios ausentes, tipos incorretos, " +
      "valores não positivos ou propriedades desconhecidas.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 400,
        },
        message: {
          oneOf: [
            { type: "string" },
            {
              type: "array",
              items: { type: "string" },
            },
          ],
          example: ["O RA do estudante deve ser um número positivo."],
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "O aluno ou a disciplina informados não estão cadastrados.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 404,
        },
        message: {
          type: "string",
          example:
            "Estudante ou curso não encontrado para realizar a matrícula.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "O aluno já está matriculado na disciplina informada.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 409,
        },
        message: {
          type: "string",
          example: "Este estudante já está matriculado neste curso.",
        },
        error: {
          type: "string",
          example: "Conflict",
        },
      },
    },
  })
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.service.create(createEnrollmentDto);
  }

  @Get()
  @ApiOperation({
    summary: "Listar matrículas",
    description:
      "Retorna todas as matrículas cadastradas. Retorna um array vazio " +
      "quando não há matrículas. Esta operação não possui paginação, " +
      "filtros ou ordenação definida.",
  })
  @ApiOkResponse({
    description: "Lista de matrículas cadastradas.",
    type: EnrollmentResponseDto,
    isArray: true,
  })
  findAll() {
    return this.service.findAll();
  }

  @Get("student/:studentRa/course/:courseId")
  @ApiOperation({
    summary: "Buscar matrícula",
    description:
      "Retorna a matrícula identificada pela combinação do RA " +
      "do aluno com o ID da disciplina.",
  })
  @ApiParam({
    name: "studentRa",
    description: "Registro acadêmico do aluno vinculado à matrícula.",
    required: true,
    example: 2026001,
    schema: {
      type: "integer",
    },
  })
  @ApiParam({
    name: "courseId",
    description: "Identificador da disciplina vinculada à matrícula.",
    required: true,
    example: 1,
    schema: {
      type: "integer",
    },
  })
  @ApiOkResponse({
    description: "Matrícula encontrada.",
    type: EnrollmentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      "O RA do aluno ou o ID da disciplina informado no caminho " +
      "não é um número inteiro.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 400,
        },
        message: {
          type: "string",
          example: "Validation failed (numeric string is expected)",
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description:
      "Não existe matrícula para a combinação de aluno e disciplina informada.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 404,
        },
        message: {
          type: "string",
          example:
            "Matrícula não encontrada para o estudante RA 2026001 no curso ID 1.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  findOne(
    @Param("studentRa", ParseIntPipe) studentRa: number,
    @Param("courseId", ParseIntPipe) courseId: number,
  ) {
    return this.service.findOne(studentRa, courseId);
  }

  @Delete("student/:studentRa/course/:courseId")
  @ApiOperation({
    summary: "Excluir matrícula",
    description:
      "Exclui a matrícula identificada pela combinação do RA do aluno " +
      "com o ID da disciplina. O aluno e a disciplina permanecem cadastrados.",
  })
  @ApiParam({
    name: "studentRa",
    description: "Registro acadêmico do aluno cuja matrícula será excluída.",
    required: true,
    example: 2026001,
    schema: {
      type: "integer",
    },
  })
  @ApiParam({
    name: "courseId",
    description: "Identificador da disciplina cuja matrícula será excluída.",
    required: true,
    example: 1,
    schema: {
      type: "integer",
    },
  })
  @ApiOkResponse({
    description: "Matrícula excluída com sucesso.",
    schema: {
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "Matrícula removida com sucesso.",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      "O RA do aluno ou o ID da disciplina informado no caminho " +
      "não é um número inteiro.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 400,
        },
        message: {
          type: "string",
          example: "Validation failed (numeric string is expected)",
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description:
      "Não existe matrícula para a combinação de aluno e disciplina informada.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 404,
        },
        message: {
          type: "string",
          example:
            "Matrícula não encontrada para o estudante RA 2026001 no curso ID 1.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  remove(
    @Param("studentRa", ParseIntPipe) studentRa: number,
    @Param("courseId", ParseIntPipe) courseId: number,
  ) {
    return this.service.remove(studentRa, courseId);
  }
}
