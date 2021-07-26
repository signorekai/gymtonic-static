import nodemailer from 'nodemailer';
import Validator from 'validatorjs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const testAccount = await nodemailer.createTestAccount();

  const rulesForSelf: Validator.Rules = {
    name: 'required|string',
    age: 'required|numeric',
    email: 'required|email',
    contact: 'required|string',
    myAddress: 'required|string',
    note: 'string',
    selectedGym: 'required|string',
  };

  const rulesForSomeoneElse: Validator.Rules = {
    name: 'required|string',
    email: 'required|email',
    contact: 'required|string',
    seniorName: 'required|string',
    seniorAge: 'required|numeric',
    seniorAddress: 'required|string',
    note: 'string',
    selectedGym: 'required|string',
  };

  interface FormSubmission {
    type: 'myself' | 'someone else';
    name: string;
    age: string;
    email: string;
    contact: string;
    myAddress: string;
    note: string;
    seniorName: string;
    seniorAge: number;
    seniorAddress: string;
    selectedGym: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: FormSubmission = JSON.parse(req.body);
  const validation = new Validator(
    data,
    data.type === 'myself' ? rulesForSelf : rulesForSomeoneElse,
  );

  if (validation.fails()) {
    res.status(400).json({ errors: validation.errors.all });
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Automated 👻" <${testAccount.user}>`, // sender address
      to: testAccount.user, // list of receivers
      subject: 'New Request from GymTonic', // Subject line
      text:
        data.type === 'myself'
          ? `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}\nContact: ${data.contact}\nAddress: ${data.myAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`
          : `Name: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nSenior's Name: ${data.seniorName}\nSenior's Age: ${data.seniorAge}\nSenior's Address: ${data.seniorAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`,
    });
    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.status(200).json({ success: true });
  } catch (error: unknown) {
    res.status(400).json({ error });
  }

  return true;
}
