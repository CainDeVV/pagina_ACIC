import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // STARTTLS
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendOtpEmail(name: string, email: string, code: string): Promise<void> {
    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto; border: 1px solid #e2e8f0; padding: 32px; border-radius: 12px; text-align: center;">
        <h2 style="color: #1a365d; margin-bottom: 8px;">Verificação de Acesso</h2>
        <p style="color: #4a5568; margin-bottom: 4px;">Olá, <strong>${name}</strong>!</p>
        <p style="color: #718096; font-size: 14px;">Use o código abaixo para concluir seu login no Portal ACIC Crateús:</p>

        <div style="background: #f7fafc; border: 2px dashed #3182ce; border-radius: 10px; padding: 20px; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #2b6cb0;">${code}</span>
        </div>

        <p style="color: #e53e3e; font-size: 13px;">⚠️ Este código expira em <strong>10 minutos</strong>.</p>
        <p style="color: #a0aec0; font-size: 12px; margin-top: 24px;">
          Se você não tentou fazer login, ignore este e-mail.
        </p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'ACIC — Código de verificação',
        html,
      });
      this.logger.log(`OTP enviado para ${email}`);
    } catch (error) {
      this.logger.error(`Falha ao enviar OTP para ${email}`, error);
      throw error;
    }
  }
}
