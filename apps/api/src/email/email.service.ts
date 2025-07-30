import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async sendMagicLink(email: string, token: string) {
    const appUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:5173';
    const magicLinkUrl = `${appUrl}/auth/verify?token=${token}`;

    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Linq <onboarding@resend.dev>',
        to: email,
        subject: 'Your magic link to sign in',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Sign in to Linq</h2>
            <p>Click the link below to sign in to your account:</p>
            <p style="margin: 30px 0;">
              <a href="${magicLinkUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Sign in to Linq
              </a>
            </p>
            <p>Or copy and paste this URL into your browser:</p>
            <p style="color: #6B7280; word-break: break-all;">${magicLinkUrl}</p>
            <p style="color: #6B7280; margin-top: 30px;">This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.</p>
          </div>
        `,
      });

      if (error) {
        throw new Error(error.message || 'Failed to send email');
      }

      return data;
    } catch (error) {
      console.error('Failed to send magic link email:', error);
      throw new Error('Failed to send magic link email');
    }
  }

  async sendWelcomeEmail(email: string, firstName?: string) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: 'Linq <onboarding@resend.dev>',
        to: email,
        subject: 'Welcome to Linq!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to Linq${firstName ? `, ${firstName}` : ''}!</h2>
            <p>Thank you for creating an account. We're excited to have you on board.</p>
            <p>Linq helps you manage your business with powerful tools for quotations, client management, and job tracking.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p style="color: #6B7280; margin-top: 30px;">Best regards,<br>The Linq Team</p>
          </div>
        `,
      });

      if (error) {
        console.error('Failed to send welcome email:', error);
      }

      return data;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
    }
  }
}
