import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.full_name,
        url,
      },
    });
  }

  async testMail() {
    // const url = `example.com/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: "renaldimedia@gmail.com",
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Reapp Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: "Ardi Renaldi",
        url: "https://halorumah.id",
      },
    });
  }
}
