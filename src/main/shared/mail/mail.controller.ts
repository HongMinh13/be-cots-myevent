// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UseInterceptors,
//   Body,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { MailService } from './mail.service';
// import * as xlsx from 'xlsx';
// import { SendEmailRequest } from './dto/sendEmail.request';

// @Controller('mail')
// export class MailController {
//   constructor(private readonly mailService: MailService) {}

//   @Post('upload')
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadFile(
//     @UploadedFile() file: Express.Multer.File,
//     @Body() input: SendEmailRequest,
//   ): Promise<string> {
//     const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const emails = xlsx.utils.sheet_to_json(sheet);
//     const emailAddresses = emails.map((item) => Object.values(item)[0]);
//     const fileName = file.originalname;

//     await this.mailService.processEmails(
//       emailAddresses,
//       input.contractId,
//       fileName,
//     );
//     return 'File uploaded and processed successfully';
//   }
// }
