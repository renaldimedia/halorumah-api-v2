import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { MailController } from './mail.controller';
import { globalConfig } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailDb } from './entity/mail.entity';
@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: globalConfig.MAIL_HOST,
        port: parseInt(globalConfig.MAIL_PORT),
        secure: globalConfig.MAIL_SSL_ENABLE == "true" ? true : false,
        auth: {
          user: globalConfig.MAIL_USER,
          pass: globalConfig.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${globalConfig.MAIL_ADDRESS}>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forFeature([MailDb])
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController], // 👈 export for DI
})
export class MailModule {}
