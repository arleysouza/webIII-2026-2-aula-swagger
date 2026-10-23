# Aula — Documentação de APIs com OpenAPI e Swagger

Projeto didático de uma API acadêmica para cadastrar alunos, disciplinas e matrículas. O foco da aula é descrever o contrato da API com OpenAPI, gerar documentação a partir do código NestJS e explorar as operações pela interface Swagger UI.

A aplicação utiliza NestJS, TypeScript, `@nestjs/swagger`, Drizzle ORM e PostgreSQL. O Nginx publica um cliente HTML/JavaScript e encaminha as chamadas da API e da documentação ao servidor.

## Objetivos da aula

- Diferenciar a especificação OpenAPI da interface Swagger UI.
- Documentar operações, parâmetros de caminho e corpos de requisição.
- Descrever modelos de entrada e saída com DTOs.
- Registrar respostas de sucesso e erro, com exemplos e códigos HTTP.
- Comparar o contrato publicado com o comportamento real da API.
- Executar chamadas pelo Swagger UI e consultar o documento OpenAPI em JSON ou YAML.

## OpenAPI e Swagger

**OpenAPI** é uma especificação para descrever APIs HTTP de forma estruturada, em JSON ou YAML. O documento apresenta caminhos, operações, parâmetros, schemas e respostas, permitindo que pessoas e ferramentas compreendam o contrato. Consulte a [especificação OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3).

**Swagger UI** é a interface que apresenta esse documento no navegador e permite executar requisições. Neste projeto, `@nestjs/swagger` integra os metadados dos controllers e DTOs à geração do documento.

O projeto segue uma abordagem **code-first**: as rotas e os decoradores do código são a origem da documentação. Não é necessário escrever manualmente um arquivo OpenAPI completo.

## Executar o projeto

Tenha Docker com Docker Compose e o mecanismo Docker em execução. Execute os comandos na raiz, onde está `compose.yml`. Pelo Docker, não é necessário instalar Node.js ou PostgreSQL no computador.

### 1. Configurar o ambiente

Se ainda não houver um `.env`, copie o modelo. No PowerShell:

```powershell
Copy-Item .env.example .env
```

No Bash:

```bash
cp .env.example .env
```

| Variável | Finalidade | Valor do modelo |
| --- | --- | --- |
| `SERVER_PORT` | Porta interna da API | `3000` |
| `SERVER_PORT_HOST` | Porta da API no computador | `3002` |
| `FRONT_PORT_HOST` | Porta do Nginx no computador | `8080` |
| `DB_HOST` | Serviço do banco na rede do Compose | `database` |
| `DB_PORT` | Porta interna do PostgreSQL | `5432` |
| `DB_PORT_HOST` | Porta do banco no computador | `5433` |
| `DB_NAME` | Nome do banco | `postgres` |
| `DB_USER` | Usuário do banco | `postgres` |
| `DB_PASSWORD` | Senha do exemplo local | `postgres` |

No Compose, a API acessa o banco pelo serviço `database` e pela porta interna `5432`.

### 2. Construir e iniciar

```bash
docker compose up -d --build
```

O servidor aguarda o banco ficar saudável, e o frontend aguarda o healthcheck do servidor. Para consultar o estado e acompanhar os logs:

```bash
docker compose ps
docker compose logs -f server database front
```

Use `Ctrl+C` para sair dos logs; os containers continuam em execução.

### 3. Acessar a documentação

Com as portas do modelo:

| Endereço | Finalidade |
| --- | --- |
| [localhost:8080/docs](http://localhost:8080/docs) | Swagger UI pelo Nginx; endereço principal da aula |
| [localhost:8080/docs-json](http://localhost:8080/docs-json) | Documento OpenAPI em JSON |
| [localhost:8080/docs-yaml](http://localhost:8080/docs-yaml) | Documento OpenAPI em YAML |
| [localhost:3002/docs](http://localhost:3002/docs) | Swagger UI diretamente no servidor |
| [localhost:8080](http://localhost:8080) | Cliente HTTP complementar |
| [localhost:8080/api/students](http://localhost:8080/api/students) | Consulta à API pelo proxy |
| [localhost:3002/health](http://localhost:3002/health) | Verificação da resposta da API |

Ajuste os endereços caso altere as portas publicadas. `/health` retorna `{"status":"ok"}` e não consulta o banco.

### 4. Atualizar ou encerrar

Após modificar controllers, DTOs ou a configuração Swagger, reconstrua o servidor:

```bash
docker compose up -d --build server
```

Após modificar `front/nginx.conf`, reconstrua o frontend:

```bash
docker compose up -d --build front
```

Para encerrar:

```bash
docker compose down
```

O volume `aula3_database_data` preserva os dados. Os scripts `database/init.sql` e `database/seed.sql` são executados apenas na primeira inicialização de um diretório de dados vazio. Reconstruir as imagens não reinicializa o banco.

## Organização da documentação no código

| Arquivo ou pasta | Papel na aula |
| --- | --- |
| `server/src/main.ts` | Metadados, geração do documento e publicação do Swagger |
| `server/src/health.controller.ts` | Endpoint operacional excluído da documentação |
| `server/src/modules/students/students.controller.ts` | Documentação das operações de alunos |
| `server/src/modules/courses/courses.controller.ts` | Documentação das operações de disciplinas |
| `server/src/modules/enrollments/enrollments.controller.ts` | Documentação das operações de matrículas |
| `server/src/modules/*/dto/create-*.dto.ts` | Campos de entrada, exemplos e validações de cadastro |
| `server/src/modules/*/dto/update-*.dto.ts` | Campos opcionais de atualização de alunos e disciplinas |
| `server/src/modules/*/dto/*-response.dto.ts` | Modelos de resposta |
| `front/nginx.conf` | Proxy dos caminhos `/api` e `/docs` |
| `compose.yml` | Serviços, portas, volume e healthchecks |

Os services implementam as operações e as regras de negócio. Os arquivos `*.schema.ts` representam tabelas e restrições no Drizzle. Os schemas do banco não substituem automaticamente os DTOs de resposta do Swagger.

## Configuração global em main.ts

O trecho responsável pela documentação é:

```ts
const config = new DocumentBuilder()
  .setTitle("API acadêmica")
  .setDescription(
    "API para gerenciamento de alunos, disciplinas e matrículas.",
  )
  .setVersion("1.0")
  .build();

const documentFactory = () => SwaggerModule.createDocument(app, config);

SwaggerModule.setup("docs", app, documentFactory);
```

`DocumentBuilder` define os metadados. `createDocument()` reúne as informações das rotas e dos modelos. `setup()` publica a interface em `/docs` e os documentos em `/docs-json` e `/docs-yaml`.

O valor `1.0` identifica a versão da API documentada; ele não é a versão da especificação OpenAPI. Consulte a [integração OpenAPI do NestJS](https://docs.nestjs.com/openapi/introduction).

## Decoradores utilizados

| Decorador | Responsabilidade |
| --- | --- |
| `@ApiTags()` | Agrupar operações em Alunos, Disciplinas e Matrículas |
| `@ApiOperation()` | Informar resumo e descrição da operação |
| `@ApiParam()` | Descrever parâmetros de caminho, como RA e ID |
| `@ApiBody()` | Descrever o corpo, seu DTO e exemplos de requisição |
| `@ApiConsumes()` | Informar o tipo de conteúdo recebido |
| `@ApiProduces()` | Informar o tipo de conteúdo retornado |
| `@ApiCreatedResponse()` | Documentar respostas `201` |
| `@ApiOkResponse()` | Documentar respostas `200` e seus modelos |
| `@ApiBadRequestResponse()` | Documentar respostas `400` |
| `@ApiNotFoundResponse()` | Documentar respostas `404` |
| `@ApiConflictResponse()` | Documentar respostas `409` |
| `@ApiProperty()` | Descrever campos obrigatórios de modelos |
| `@ApiPropertyOptional()` | Descrever campos opcionais de modelos |
| `@ApiExcludeController()` | Omitir um controller da documentação |

O controller de saúde usa `@ApiExcludeController()`: `/health` continua disponível para o healthcheck do Docker, mas não aparece no Swagger. Esse decorador não bloqueia o acesso ao endpoint. O Nginx atual não encaminha `/health` pela porta 8080.

Referências: [operações e respostas](https://docs.nestjs.com/openapi/operations) e [tipos e parâmetros](https://docs.nestjs.com/openapi/types-and-parameters).

## Documentação e validação

Os decoradores Swagger descrevem o contrato. A validação na execução é feita por `class-validator`, pelo `ValidationPipe` global e pelos pipes de parâmetros.

Por exemplo, o RA no cadastro de aluno é documentado como inteiro positivo; `@IsInt()` e `@IsPositive()` verificam essa entrada. `@MinLength()` e `@MaxLength()` verificam o tamanho do nome. O `ValidationPipe` rejeita campos desconhecidos com `whitelist: true` e `forbidNonWhitelisted: true`.

Nos parâmetros de caminho, `ParseIntPipe` exige um inteiro. Não há validação de positividade nesses parâmetros, por isso seus schemas não declaram `minimum: 1`.

Nas atualizações de aluno e disciplina, `name` é opcional e aceita `null`. O Swagger registra `nullable: true`, e o tipo TypeScript é `name?: string | null`. Tanto `{}` quanto `{"name":null}` preservam o nome atual.

Os DTOs de resposta documentam o retorno; eles não validam nem transformam automaticamente o objeto devolvido pelo serviço. Na matrícula, `enrolledAt` é um `Date` no servidor e é serializado como texto com formato `date-time` no JSON.

## Operações documentadas

As chaves indicam parâmetros de caminho no OpenAPI. Nos controllers NestJS, esses parâmetros são declarados com dois-pontos, como `:ra`.

| Método | Caminho | Sucesso | Erros previstos |
| --- | --- | --- | --- |
| POST | `/api/students` | `201`: aluno cadastrado | `400`, `409` |
| GET | `/api/students` | `200`: alunos ordenados pelo nome | — |
| GET | `/api/students/{ra}` | `200`: aluno | `400`, `404` |
| PATCH | `/api/students/{ra}` | `200`: aluno atualizado | `400`, `404` |
| DELETE | `/api/students/{ra}` | `200`: mensagem de exclusão | `400`, `404`, `409` |
| POST | `/api/courses` | `201`: disciplina cadastrada | `400`, `409` |
| GET | `/api/courses` | `200`: disciplinas ordenadas pelo ID | — |
| GET | `/api/courses/{id}` | `200`: disciplina | `400`, `404` |
| PATCH | `/api/courses/{id}` | `200`: disciplina atualizada | `400`, `404`, `409` |
| DELETE | `/api/courses/{id}` | `200`: mensagem de exclusão | `400`, `404`, `409` |
| POST | `/api/enrollments` | `201`: matrícula cadastrada | `400`, `404`, `409` |
| GET | `/api/enrollments` | `200`: matrículas, sem ordenação definida | — |
| GET | `/api/enrollments/student/{studentRa}/course/{courseId}` | `200`: matrícula | `400`, `404` |
| DELETE | `/api/enrollments/student/{studentRa}/course/{courseId}` | `200`: mensagem de exclusão | `400`, `404` |

A tabela apresenta as regras previstas pelo código. Falhas inesperadas de infraestrutura também podem ocorrer. As listagens não possuem filtros nem paginação e retornam `[]` quando não há registros.

## Regras de negócio presentes no contrato

- O RA do aluno é único e não pode ser alterado pela operação de atualização.
- Nomes de alunos podem se repetir; nomes de disciplinas são únicos.
- Os nomes recebidos devem conter de 3 a 100 caracteres.
- Uma matrícula depende de um aluno e de uma disciplina existentes.
- A combinação `studentRa` e `courseId` identifica a matrícula e impede duplicidade.
- O banco gera o ID da disciplina e a data da matrícula automaticamente.
- Alunos e disciplinas com matrículas vinculadas não podem ser excluídos.
- Excluir uma matrícula preserva os cadastros do aluno e da disciplina.
- As exclusões retornam `200` com mensagem, e não `204` sem corpo.

## Roteiro prático com Swagger UI

1. Abra [a documentação](http://localhost:8080/docs) e localize Alunos, Disciplinas e Matrículas. Expanda uma operação e identifique parâmetros, corpo e respostas possíveis.
2. Consulte a seção **Schemas**. Compare modelos de criação, atualização e resposta. Observe campos obrigatórios, limites, exemplos e `nullable`.
3. Em `GET /api/students`, clique em **Try it out** e **Execute**. Compare o array recebido com o modelo documentado.
4. Cadastre um aluno com RA de teste disponível, como `2026099`, e nome `Aluno da aula Swagger`. Observe `201`. Reenvie os mesmos dados para observar `409`.
5. Envie um cadastro com nome de dois caracteres e observe `400`. Compare a mensagem real com o schema documentado.
6. Busque o aluno pelo RA e atualize seu nome com `PATCH`. Experimente `{}` e `{"name":null}` para verificar a preservação do nome.
7. Cadastre uma disciplina com nome único e anote o ID retornado. Use esse ID nas próximas chamadas, sem presumir um valor fixo.
8. Crie uma matrícula com o RA e o ID criados. Observe `enrolledAt`. Reenvie para verificar o conflito por duplicidade.
9. Tente excluir o aluno ou a disciplina enquanto a matrícula existe. Compare o `409` real com a documentação.
10. Consulte a matrícula pela combinação de RA e ID. Exclua a matrícula e depois o aluno e a disciplina de teste.
11. Informe `abc` como parâmetro de caminho em uma consulta e observe `400`. Consulte um recurso inexistente para observar `404`.
12. Abra [o JSON OpenAPI](http://localhost:8080/docs-json). Localize `info`, `paths`, `operationId`, `requestBody`, `responses` e `components.schemas` e relacione-os à interface.

**Execute realiza chamadas reais:** cadastros, atualizações e exclusões afetam o banco. Se um registro de teste já existir, escolha outro identificador ou nome e ajuste as chamadas seguintes.

## Swagger pela porta 8080

```text
Navegador → localhost:8080/docs → Nginx → server:3000/docs
Navegador → localhost:8080/api/... → Nginx → server:3000/api/...
```

A porta interna `3000` corresponde a `SERVER_PORT` no modelo. `front/nginx.conf` é utilizado como template, e `${SERVER_PORT}` é substituído na inicialização do container. `server` é o nome do serviço na rede do Compose.

O proxy preserva os caminhos. O bloco `/docs` encaminha também os arquivos da interface, `/docs-json` e `/docs-yaml`. Ao abrir o Swagger pela porta 8080, as chamadas à API usam a mesma origem e passam pelo bloco `/api`.

## Revisão do contrato e exercícios de melhoria

A documentação deve acompanhar o código. Ao revisar uma operação, confira método, caminho, campos obrigatórios, parâmetros, exemplos, status HTTP e formato da resposta.

Os seguintes aprimoramentos podem ser explorados como exercícios; ainda não estão implementados:

- Extrair schemas de erro repetidos para DTOs compartilhados, preservando exemplos específicos por operação.
- Reutilizar um DTO para as mensagens de sucesso das exclusões.
- Representar `additionalProperties: false` nos schemas de entrada, refletindo a rejeição de campos desconhecidos já aplicada pelo servidor.
- Ampliar o schema de `400` do cadastro de aluno para admitir `message` como texto ou array, cobrindo também erros de leitura de JSON.
- Padronizar exemplos de RA entre cadastro, resposta e matrícula.
- Automatizar a validação do documento OpenAPI e a comparação de contratos entre versões.

O projeto usa decoradores explícitos e não depende do plugin CLI do Swagger. Não há autenticação implementada; o contrato não declara esquemas de autenticação.

## Cliente HTTP e desenvolvimento local

A página em [localhost:8080](http://localhost:8080) permite montar requisições manualmente e observar status, headers e corpo. Ela complementa o Swagger na comparação entre documentação e execução. As respostas da API incluem `Cache-Control: no-store`.

Para desenvolver o servidor fora do Docker, utilize Node.js na faixa `^24.15.0`, conforme `server/package.json`. Na pasta `server`, execute `npm ci` para instalar dependências, `npm run build` para compilar e `npm run dev` para executar com observação de arquivos.

Nessa modalidade, mantenha o banco acessível e configure `DB_HOST=localhost` e `DB_PORT` com a porta publicada, normalmente `5433`. Ao voltar ao Compose, restaure `DB_PORT=5432` para a comunicação interna. A porta da API local é definida por `SERVER_PORT`.

## Referências

- [Especificação OpenAPI 3.0](https://spec.openapis.org/oas/v3.0.3)
- [NestJS: introdução ao OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [NestJS: tipos e parâmetros](https://docs.nestjs.com/openapi/types-and-parameters)
- [NestJS: operações e respostas](https://docs.nestjs.com/openapi/operations)
