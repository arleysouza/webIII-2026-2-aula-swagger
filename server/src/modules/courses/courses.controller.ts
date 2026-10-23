import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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

import { CoursesService } from "./courses.service";
import { CourseResponseDto } from "./dto/course-response.dto";
import { CreateCourseDto } from "./dto/create-course.dto";
import { UpdateCourseDto } from "./dto/update-course.dto";

@ApiTags("Disciplinas")
@ApiProduces("application/json")
@Controller("api/courses")
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @Post()
  @ApiOperation({
    summary: "Cadastrar disciplina",
    description:
      "Cadastra uma disciplina com nome único, entre 3 e 100 caracteres. " +
      "O identificador é gerado pelo banco de dados. " +
      "Propriedades não previstas no DTO são rejeitadas.",
  })
  @ApiConsumes("application/json")
  @ApiBody({
    description: "Dados para cadastrar a disciplina. O nome é obrigatório.",
    type: CreateCourseDto,
    required: true,
    examples: {
      cadastro: {
        summary: "Cadastro de disciplina",
        value: {
          name: "Desenvolvimento Web III",
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Disciplina cadastrada com sucesso.",
    type: CourseResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      "Corpo inválido: nome ausente, tipo incorreto, comprimento " +
      "fora dos limites ou propriedades desconhecidas.",
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
          example: ["O nome do curso deve ter pelo menos 3 caracteres."],
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "Já existe uma disciplina com o nome informado.",
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
          example: "Já existe um curso com este nome.",
        },
        error: {
          type: "string",
          example: "Conflict",
        },
      },
    },
  })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.service.create(createCourseDto);
  }

  @Get()
  @ApiOperation({
    summary: "Listar disciplinas",
    description:
      "Retorna todas as disciplinas em ordem crescente de ID. " +
      "Retorna um array vazio quando não há disciplinas cadastradas. " +
      "Esta operação não possui paginação nem filtros.",
  })
  @ApiOkResponse({
    description: "Lista de disciplinas ordenada pelo ID.",
    type: CourseResponseDto,
    isArray: true,
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  @ApiOperation({
    summary: "Buscar disciplina pelo ID",
    description:
      "Retorna os dados da disciplina identificada pelo ID informado.",
  })
  @ApiParam({
    name: "id",
    description: "Identificador inteiro da disciplina a ser consultada.",
    required: true,
    example: 1,
    schema: {
      type: "integer",
    },
  })
  @ApiOkResponse({
    description: "Disciplina encontrada.",
    type: CourseResponseDto,
  })
  @ApiBadRequestResponse({
    description: "O ID informado no caminho não é um número inteiro.",
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
    description: "Não existe disciplina com o ID informado.",
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
          example: "Curso com ID 1 não encontrado.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({
    summary: "Atualizar disciplina",
    description:
      "Atualiza somente o nome da disciplina identificada pelo ID. " +
      "O novo nome deve ser único e conter entre 3 e 100 caracteres. " +
      "Um corpo vazio ou name com valor null mantém o nome atual. " +
      "Propriedades não previstas no DTO são rejeitadas.",
  })
  @ApiParam({
    name: "id",
    description: "Identificador inteiro da disciplina a ser atualizada.",
    required: true,
    example: 1,
    schema: {
      type: "integer",
    },
  })
  @ApiConsumes("application/json")
  @ApiBody({
    description: "Dados para atualização. O campo name é opcional.",
    type: UpdateCourseDto,
    required: true,
    examples: {
      alterarNome: {
        summary: "Alterar o nome da disciplina",
        value: {
          name: "Programação para a Web III",
        },
      },
      manterNome: {
        summary: "Manter o nome atual",
        value: {},
      },
      nomeNulo: {
        summary: "Manter o nome atual utilizando null",
        value: {
          name: null,
        },
      },
    },
  })
  @ApiOkResponse({
    description:
      "Disciplina atualizada. Quando nenhum novo nome é informado, " +
      "o nome atual é preservado.",
    type: CourseResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      "ID inválido no caminho ou corpo inválido: nome com tipo ou " +
      "comprimento incorreto ou propriedades desconhecidas.",
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
          example: ["O nome do curso deve ter pelo menos 3 caracteres."],
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Não existe disciplina com o ID informado.",
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
          example: "Curso com ID 1 não encontrado.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "Já existe outra disciplina com o nome informado.",
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
          example: "Já existe um curso com este nome.",
        },
        error: {
          type: "string",
          example: "Conflict",
        },
      },
    },
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.service.update(id, updateCourseDto);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Excluir disciplina",
    description:
      "Exclui a disciplina identificada pelo ID. A exclusão é impedida " +
      "quando existem matrículas vinculadas à disciplina.",
  })
  @ApiParam({
    name: "id",
    description: "Identificador inteiro da disciplina a ser excluída.",
    required: true,
    example: 1,
    schema: {
      type: "integer",
    },
  })
  @ApiOkResponse({
    description: "Disciplina excluída com sucesso.",
    schema: {
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "Curso removido com sucesso.",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "O ID informado no caminho não é um número inteiro.",
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
    description: "Não existe disciplina com o ID informado.",
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
          example: "Curso com ID 1 não encontrado.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "A disciplina possui matrículas e não pode ser excluída.",
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
          example: "O curso possui matrículas e não pode ser excluído.",
        },
        error: {
          type: "string",
          example: "Conflict",
        },
      },
    },
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
