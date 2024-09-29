import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '.';
import { verificationCodeTemplate } from './email-templates/verificationCodeTemplate.template';
import { invitationTemplate } from './email-templates/invitation.template';

@Injectable()
export class EmailService extends EmailAdapter {
  sendEmailVerificationCode = async ({
    receiverEmail,
    customerName,
    verifyCode,
  }: {
    receiverEmail: string;
    customerName: string;
    verifyCode: string;
  }) => {
    const htmlTemplate = verificationCodeTemplate;
    const content = await this.renderHtml(htmlTemplate, {
      customerName,
      verifyCode,
      emailTitle: 'Verification account',
    });

    const subject = 'Verification Request User';

    return await this.sendEmail({ receiverEmail, subject, html: content });
  };
  sendEmailToGuest = async ({
    receiverEmail,
    eventName,
    startDate,
    address,
    customerName,
    customerPhoneNumber,
    timeline,
  }: {
    receiverEmail: string;
    eventName: string;
    startDate: string;
    address: string;
    customerName: string;
    customerPhoneNumber: string;
    timeline: string;
  }) => {
    const htmlTemplate = invitationTemplate;
    const content = await this.renderHtml(htmlTemplate, {
      eventName,
      startDate,
      address,
      customerName,
      customerPhoneNumber,
      timeline,
    });

    const subject = 'Thư mời tham gia sự kiện';

    return await this.sendEmail({ receiverEmail, subject, html: content });
  };
}

export const emailService = new EmailService();
