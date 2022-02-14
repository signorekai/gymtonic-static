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
    host: process.env.CONTACT_EMAIL_HOST,
    port: process.env.CONTACT_EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Contact @ Gymtonic" <contact@gymtonic.sg>`, // sender address
      to: 'hello@gymtonic.sg', // list of receivers
      subject: 'Sign up', // Subject line
      text:
        data.type === 'myself'
          ? `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}\nContact: ${data.contact}\nAddress: ${data.myAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`
          : `Name: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nSenior's Name: ${data.seniorName}\nSenior's Age: ${data.seniorAge}\nSenior's Address: ${data.seniorAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`,
    });
    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ success: true });
  } catch (error: unknown) {
    res.status(400).json({ error });
  }

  return true;
}
