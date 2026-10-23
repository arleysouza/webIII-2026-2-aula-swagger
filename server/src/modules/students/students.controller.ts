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

import { CreateStudentDto } from "./dto/create-student.dto";
import { StudentResponseDto } from "./dto/student-response.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";
import { StudentsService } from "./students.service";

@ApiTags("Alunos")
@ApiProduces("application/json")
@Controller("api/students")
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  @ApiOperation({
    summary: "Cadastrar aluno",
    description:
      "Cadastra um aluno com RA inteiro positivo e único e nome entre " +
      "3 e 100 caracteres. Propriedades não previstas no DTO são rejeitadas.",
  })
  @ApiConsumes("application/json")
  @ApiBody({
    description: "RA e nome do aluno. Ambos os campos são obrigatórios.",
    type: CreateStudentDto,
    required: true,
    examples: {
      cadastro: {
        summary: "Cadastro de aluno",
        value: {
          ra: 258099,
          name: "Mariana Souza",
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Aluno cadastrado com sucesso.",
    type: StudentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      "Corpo inválido: campos obrigatórios ausentes, tipos incorretos, " +
      "RA não positivo, nome fora dos limites ou propriedades desconhecidas.",
    schema: {
      type: "object",
      required: ["statusCode", "message", "error"],
      properties: {
        statusCode: {
          type: "integer",
          example: 400,
        },
        message: {
          type: "array",
          items: { type: "string" },
          example: ["O nome deve ter pelo menos 3 caracteres."],
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "Já existe um aluno com o RA informado.",
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
          example: "Já existe um estudante com este RA.",
        },
        error: {
          type: "string",
          example: "Conflict",
        },
      },
    },
  })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.service.create(createStudentDto);
  }

  @Get()
  @ApiOperation({
    summary: "Listar alunos",
    description:
      "Retorna todos os alunos ordenados pelo nome, em ordem crescente. " +
      "Retorna um array vazio quando não há alunos cadastrados. " +
      "Esta operação não possui paginação nem filtros.",
  })
  @ApiOkResponse({
    description: "Lista de alunos ordenada pelo nome.",
    type: StudentResponseDto,
    isArray: true,
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(":ra")
  @ApiOperation({
    summary: "Buscar aluno pelo RA",
    description: "Retorna os dados do aluno identificado pelo RA informado.",
  })
  @ApiParam({
    name: "ra",
    description: "Registro acadêmico do aluno a ser consultado.",
    required: true,
    example: 258099,
    schema: {
      type: "integer",
    },
  })
  @ApiOkResponse({
    description: "Aluno encontrado.",
    type: StudentResponseDto,
  })
  @ApiBadRequestResponse({
    description: "O RA informado no caminho não é um número inteiro.",
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
    description: "Não existe aluno com o RA informado.",
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
          example: "Estudante com RA 258099 não encontrado.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  findOne(@Param("ra", ParseIntPipe) ra: number) {
    return this.service.findOne(ra);
  }

  @Patch(":ra")
  @ApiOperation({
    summary: "Atualizar aluno",
    description:
      "Atualiza somente o nome do aluno identificado pelo RA. " +
      "O RA não pode ser alterado. O nome, quando informado como texto, " +
      "deve conter entre 3 e 100 caracteres. Um corpo vazio ou name " +
      "com valor null mantém os dados atuais. Propriedades não previstas " +
      "no DTO são rejeitadas.",
  })
  @ApiParam({
    name: "ra",
    description: "Registro acadêmico do aluno a ser atualizado.",
    required: true,
    example: 258099,
    schema: {
      type: "integer",
    },
  })
  @ApiConsumes("application/json")
  @ApiBody({
    description: "Dados para atualização. O campo name é opcional.",
    type: UpdateStudentDto,
    required: true,
    examples: {
      alterarNome: {
        summary: "Alterar o nome do aluno",
        value: {
          name: "Mariana Ferreira",
        },
      },
      manterDados: {
        summary: "Manter os dados atuais",
        value: {},
      },
    },
  })
  @ApiOkResponse({
    description:
      "Aluno atualizado ou retornado sem alterações quando nenhum " +
      "novo nome é informado.",
    type: StudentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      "RA inválido no caminho ou corpo inválido: nome com tipo ou " +
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
          example: ["O nome deve ter pelo menos 3 caracteres."],
        },
        error: {
          type: "string",
          example: "Bad Request",
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Não existe aluno com o RA informado.",
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
          example: "Estudante com RA 258099 não encontrado.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  update(
    @Param("ra", ParseIntPipe) ra: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.service.update(ra, updateStudentDto);
  }

  @Delete(":ra")
  @ApiOperation({
    summary: "Excluir aluno",
    description:
      "Exclui o aluno identificado pelo RA. A exclusão é impedida " +
      "quando existem matrículas vinculadas ao aluno.",
  })
  @ApiParam({
    name: "ra",
    description: "Registro acadêmico do aluno a ser excluído.",
    required: true,
    example: 258099,
    schema: {
      type: "integer",
    },
  })
  @ApiOkResponse({
    description: "Aluno excluído com sucesso.",
    schema: {
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "Estudante removido com sucesso.",
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "O RA informado no caminho não é um número inteiro.",
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
    description: "Não existe aluno com o RA informado.",
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
          example: "Estudante com RA 258099 não encontrado.",
        },
        error: {
          type: "string",
          example: "Not Found",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "O aluno possui matrículas e não pode ser excluído.",
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
          example:
            "O estudante possui matrículas e não pode ser excluído.",
        },
        error: {
          type: "string",
          example: "Conflict",
        },
      },
    },
  })
  remove(@Param("ra", ParseIntPipe) ra: number) {
    return this.service.remove(ra);
  }
}