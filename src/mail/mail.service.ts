import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MailDb } from './entity/mail.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, @InjectRepository(MailDb) private readonly repo:Repository<MailDb>) {}

  async sendUserConfirmation(user: User, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;

    const res = await this.mailerService.sendMail({
      to: user.email,
    
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.full_name,
        url,
      },
    });

    this.saveToDb(res, "USER_CONFIRMATION");
  }

  async sendPasswordReset(email: string, token: string) {
    // const url = `example.com/auth/confirm?token=${token}`;

    const res = await this.mailerService.sendMail({
      to: email,
    
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset Password',
      template: './password-reset', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: email,
        ResetCode: token
      },
    });

    this.saveToDb(res, "USER_CONFIRMATION");
  }

  async testMail() {
    // const url = `example.com/auth/confirm?token=${token}`;

    const res = await this.mailerService.sendMail({
      to: "renaldimedia@gmail.com",
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Reapp Confirm your Email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: "Ardi Renaldi",
        url: "https://halorumah.id",
      },
    });
    this.saveToDb(res, "TEST MAIL");
   
    console.log(res);
  }

  async saveToDb(res: any, subject: string = null){
    if(res != null && typeof res.accepted != 'undefined'){
        let ins = [];
        // let rej = [];
        if(res.accepted.length > 0){
            for(let i = 0 ; i < res.accepted.length ; i++){
                let ml = res.accepted[i];
                let dt = new MailDb();
                dt.from_email = res.envelope.from;
                dt.to_email = ml;
                dt.status = 'ACCEPTED';
                if(subject != null){
                    dt.subject = subject;
                }
                ins.push(dt);
            }
        }
        if(res.rejected.length > 0){
            for(let i = 0 ; i < res.rejected.length ; i++){
                let ml = res.rejected[i];
                let dt = new MailDb();
                dt.from_email = res.envelope.from;
                dt.to_email = ml;
                dt.status = 'REJECTED';
                if(subject != null){
                    dt.subject = subject;
                }
                ins.push(dt);
            }
        }

        if(ins.length > 0){
            await this.repo.createQueryBuilder().insert().into(MailDb).values(ins).execute();
        }
       
    }
  }
}
