import { IsInt, IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentDto {
  @ApiProperty({
    description: "Registro acadêmico do aluno. Deve ser único.",
    type: "integer",
    minimum: 1,
    example: 258099,
  })
  @IsNotEmpty({ message: "O RA é obrigatório." })
  @IsInt({ message: "O RA deve ser um número inteiro." })
  @IsPositive({ message: "O RA deve ser um número positivo." })
  ra!: number;

  @ApiProperty({
    description: "Nome do aluno.",
    type: String,
    minLength: 3,
    maxLength: 100,
    example: "Mariana Souza",
  })
  @IsNotEmpty({ message: "O nome é obrigatório." })
  @IsString({ message: "O nome deve ser uma string." })
  @MinLength(3, { message: "O nome deve ter pelo menos 3 caracteres." })
  @MaxLength(100, { message: "O nome deve ter no máximo 100 caracteres." })
  name!: string;
}
