import nodemailer from 'nodemailer';
import Validator from 'validatorjs';

export default async function handler(req, res) {
  const testAccount = await nodemailer.createTestAccount();

  const rulesForSelf = {
    name: 'required|string',
    age: 'required|numeric',
    email: 'required|email',
    contact: 'required|string',
    myAddress: 'required|string',
    note: 'string',
    selectedGym: 'required|string',
  };

  const rulesForSomeoneElse = {
    name: 'required|string',
    email: 'required|email',
    contact: 'required|string',
    seniorName: 'required|string',
    seniorAge: 'required|numeric',
    seniorAddress: 'required|string',
    note: 'string',
    selectedGym: 'required|string',
  };

  const data = JSON.parse(req.body);
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
      replyTo: data.email,
      text:
        data.type === 'myself'
          ? `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}\nContact: ${data.contact}\nAddress: ${data.myAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`
          : `Name: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nSenior's Name: ${data.seniorName}\nSenior's Age: ${data.seniorAge}\nSenior's Address: ${data.seniorAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`,
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error });
  }

  return true;
}
