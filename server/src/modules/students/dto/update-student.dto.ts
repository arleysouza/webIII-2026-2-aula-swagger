import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStudentDto {
  @ApiPropertyOptional({
    description:
      "Novo nome do aluno. Quando omitido ou informado como null, mantém o nome atual.",
    type: String,
    nullable: true,
    minLength: 3,
    maxLength: 100,
    example: "Mariana Ferreira",
  })
  @IsOptional()
  @IsString({ message: "O nome deve ser um texto válido." })
  @MinLength(3, { message: "O nome deve ter pelo menos 3 caracteres." })
  @MaxLength(100, { message: "O nome deve ter no máximo 100 caracteres." })
  name?: string | null;
}
