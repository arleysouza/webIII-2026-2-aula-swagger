import { ApiProperty } from "@nestjs/swagger";

export class EnrollmentResponseDto {
  @ApiProperty({
    description: "RA do aluno vinculado à matrícula.",
    type: "integer",
    example: 258001,
  })
  studentRa!: number;

  @ApiProperty({
    description: "Identificador da disciplina vinculada à matrícula.",
    type: "integer",
    example: 1,
  })
  courseId!: number;

  @ApiProperty({
    description:
      "Data e hora da matrícula, geradas automaticamente pelo banco de dados.",
    type: String,
    format: "date-time",
    example: "2026-10-23T14:30:00.000Z",
  })
  enrolledAt!: Date;
}
