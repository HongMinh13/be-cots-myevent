import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Guest, SENT_EMAIL_STATUS } from '@/db/entities/guest.entity';
import { emailService } from '@/service/smtp/service';
import { EmailSendLog } from '@/db/entities/emailSendLog.entity';
import { formatDateToString } from '@/providers/functionUtils';
import { SendEmailRequest } from './dto/request/getFileFromS3.request';
import * as xlsx from  'xlsx';
import { S3Adapter } from '@/service/aws/s3';
import dayjs from 'dayjs';

@Injectable()
export class MailService {
  private s3Adapter: S3Adapter;
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {
    this.s3Adapter = new S3Adapter();
  }

  async processEmails(input: SendEmailRequest) {
    const { emailAddresses: emails, fileName } = await this.readExcelFile(
      input,
    );

    const emailSendLog = new EmailSendLog();
    emailSendLog.contractId = input.contractId;
    emailSendLog.fileName = fileName;
    await EmailSendLog.save(emailSendLog);

    for (const email of emails) {
      const guest = new Guest();

      guest.emailSendLogId = emailSendLog.id;
      guest.email = email;
      guest.status = SENT_EMAIL_STATUS.QUEUED;
      await Guest.save(guest);

      await this.emailQueue.add('send-email', {
        email,
        guestId: guest.id,
      });
    }
  }

  async updateGuest(
    id: string,
    status: SENT_EMAIL_STATUS,
    error: string = null,
  ) {
    const guest = await Guest.findOne(id);
    if (guest) {
      guest.status = status;
      guest.error = error;
      await Guest.save(guest);
    }
  }

  async sendEmail(email: string, guestId: string) {
    const guest = await Guest.createQueryBuilder('guest')
      .leftJoinAndSelect('guest.emailSendLog', 'emailSendLog')
      .leftJoinAndSelect('emailSendLog.contract', 'contract')
      .leftJoinAndSelect('contract.customer', 'customer')
      .leftJoinAndSelect('contract.rental', 'rental')
      .leftJoinAndSelect('rental.timelines', 'timelines')
      .leftJoinAndSelect('rental.locationRentals', 'locationRentals')
      .leftJoinAndSelect('locationRentals.location', 'location')
      .leftJoinAndSelect('rental.event', 'event')
      .where('guest.id = :id', { id: guestId })
      .getOne();

    const addressHired =
      guest?.emailSendLog?.contract?.rental?.locationRentals?.[0]?.location
        ?.address;
    console.log('addressHired', addressHired);
    const customAddress = guest?.emailSendLog?.contract?.rental?.customLocation;

    const timelineData = guest?.emailSendLog?.contract?.rental?.timelines;

    const timeline = timelineData
      ?.map((item) => {
        return `<p><strong>${dayjs(item.timeStart).format(
          'YYYY-MM-DD HH:mm',
        )}</strong>: ${item.description}</p>`;
      })
      .join('');

    try {
      await emailService.sendEmailToGuest({
        receiverEmail: email,
        eventName: guest?.emailSendLog?.contract?.rental?.event?.name ?? '',
        startDate: formatDateToString(
          guest?.emailSendLog?.contract?.rental?.rentalStartTime ?? new Date(),
        ),
        address: customAddress || addressHired || '',
        customerName: guest?.emailSendLog?.contract?.customer?.name ?? '',
        customerPhoneNumber:
          guest?.emailSendLog?.contract?.customer?.phoneNumber ?? '',
        timeline,
      });
      await this.updateGuest(guestId, SENT_EMAIL_STATUS.SENT);
      console.log('Email sentt', email);
    } catch (error) {
      await this.updateGuest(guestId, SENT_EMAIL_STATUS.FAILED, error.message);
    }
  }

  public async readExcelFile(input: SendEmailRequest): Promise<any> {
    const { key } = input;

    const file = await this.s3Adapter.getObjectStream(key);

    return new Promise((resolve, reject) => {
      const buffers = [];

      file.on('data', function (data) {
        buffers.push(data);
      });

      file.on('end', function () {
        const buffer = Buffer.concat(buffers);
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const workSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[workSheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        const emailAddresses = data.map((item) => Object.values(item)[0]);
        const fileName = key;
        resolve({ emailAddresses, fileName });
      });

      file.on('error', (err) => {
        reject(err);
      });
    });
  }
}
