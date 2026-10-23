import { ApiProperty } from "@nestjs/swagger";

export class CourseResponseDto {
  @ApiProperty({
    description: "Identificador da disciplina gerado pelo banco de dados.",
    type: "integer",
    example: 1,
  })
  id!: number;

  @ApiProperty({
    description: "Nome da disciplina.",
    type: String,
    minLength: 3,
    maxLength: 100,
    example: "Desenvolvimento Web III",
  })
  name!: string;
}
