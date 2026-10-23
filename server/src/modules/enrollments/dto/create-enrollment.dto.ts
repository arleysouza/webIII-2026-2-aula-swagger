import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentDto {
  @ApiProperty({
    description: "RA de um aluno já cadastrado.",
    type: "integer",
    minimum: 1,
    example: 2026001,
  })
  @IsNotEmpty({ message: "O RA do estudante é obrigatório." })
  @IsInt({ message: "O RA do estudante deve ser um número inteiro." })
  @IsPositive({ message: "O RA do estudante deve ser um número positivo." })
  studentRa!: number;

  @ApiProperty({
    description: "ID de uma disciplina já cadastrada.",
    type: "integer",
    minimum: 1,
    example: 1,
  })
  @IsNotEmpty({ message: "O ID do curso é obrigatório." })
  @IsInt({ message: "O ID do curso deve ser um número inteiro." })
  @IsPositive({ message: "O ID do curso deve ser um número positivo." })
  courseId!: number;
}
