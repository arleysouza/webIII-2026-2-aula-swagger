import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description:
      "Novo nome da disciplina. Deve ser único. Quando omitido ou " +
      "informado como null, mantém o nome atual.",
    type: String,
    nullable: true,
    minLength: 3,
    maxLength: 100,
    example: "Programação para a Web III",
  })
  @IsOptional()
  @IsString({
    message: "O nome do curso deve ser um texto válido.",
  })
  @MinLength(3, {
    message: "O nome do curso deve ter pelo menos 3 caracteres.",
  })
  @MaxLength(100, {
    message: "O nome do curso deve ter no máximo 100 caracteres.",
  })
  name?: string | null;
}
