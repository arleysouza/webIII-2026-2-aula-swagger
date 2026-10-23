import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty({
    description: "Nome da disciplina. Deve ser único.",
    type: String,
    minLength: 3,
    maxLength: 100,
    example: "Desenvolvimento Web III",
  })
  @IsNotEmpty({ message: "O nome do curso é obrigatório." })
  @IsString({ message: "O nome do curso deve ser um texto válido." })
  @MinLength(3, {
    message: "O nome do curso deve ter pelo menos 3 caracteres.",
  })
  @MaxLength(100, {
    message: "O nome do curso deve ter no máximo 100 caracteres.",
  })
  name!: string;
}
