import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // P2002: Unique constraint violation
    if (exception.code === 'P2002') {
      const status = HttpStatus.CONFLICT;
      response.status(status).json({
        statusCode: status,
        message:
          'Conflito de dados: o registro que você tentou inserir possui informações que já existem.',
        error: 'Conflict',
      });
      return;
    }

    // P2025: Record not found
    if (exception.code === 'P2025') {
      const status = HttpStatus.NOT_FOUND;
      response.status(status).json({
        statusCode: status,
        message: 'O registro solicitado não foi encontrado no banco de dados.',
        error: 'Not Found',
      });
      return;
    }

    super.catch(exception, host);
  }
}
