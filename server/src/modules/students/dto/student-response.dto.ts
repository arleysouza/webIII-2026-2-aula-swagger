import { ApiProperty } from "@nestjs/swagger";

export class StudentResponseDto {
  @ApiProperty({
    description: "Registro acadêmico do aluno.",
    type: "integer",
    example: 258001,
  })
  ra!: number;

  @ApiProperty({
    description: "Nome do aluno.",
    type: String,
    example: "Ana Clara",
  })
  name!: string;
}
