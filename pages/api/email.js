import { gql, ApolloClient, InMemoryCache } from '@apollo/client';
import nodemailer from 'nodemailer';
import Validator from 'validatorjs';
require('cross-fetch/polyfill');

export default async function handler(req, res) {
  // const testAccount = await nodemailer.createTestAccount();

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
    throw new Error({message: validation.errors.all})
  }

  const transporter = nodemailer.createTransport({
    host: process.env.CONTACT_EMAIL_HOST,
    port: process.env.CONTACT_EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.CONTACT_EMAIL,
      pass: process.env.CONTACT_EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const client = new ApolloClient({
    // link: createHttpLink({ uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql` }),
    uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
    cache: new InMemoryCache(),
  })

  function replaceTemplate(template, data) {
    let returnTemplate = "Hello, Thank you for signing up for Gym Tonic. \nWe will follow up with your enquiry within the next 7 working days. Thank you for your patience. \n\nName:  {%name%}\nAge: {%age%}\nContact: {%contact%}\nSelected Gym: {%selectedGym%}"
    if (typeof template !== undefined) {
      returnTemplate = template;
    }

    return returnTemplate.replace(/{%(\w+)%}/g, (match, key) => {
      return data.hasOwnProperty(key) ? data[key] : match;
    });
  }

  function removeParentheses(str) {
    if (typeof str === 'string') {
      return str.replace(/\s*\([^)]*\)/g, '').trim();
    } else {
      return str;
    }
  }

  async function sendToTelegram(message) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: 177731198,
          text: message
        })
      });
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError);
    }
  }

  async function searchLocations(searchTerm) {
    console.log(57, searchTerm)
    try {
      const query = gql`
        query SearchLocationsByTitle($searchTerm: ID!) {
          location(id: $searchTerm) {
            locationFields {
              emailTemplate
            }
          }
        }
      `;

      const searchTerm = removeParentheses(searchTerm);

      const { data } = await client.query({
        query,
        variables: { searchTerm }
      });

      // console.log('Query and variables:', JSON.stringify({ query: query.loc.source.body, variables: { searchTerm } }));
      
      if (data.location) {
        return data.location.locationFields.emailTemplate;
      } else {
        console.log('No locations found for:', searchTerm);
        return null;
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      console.error(data)
      return "Hello, Thank you for signing up for Gym Tonic. \nWe will follow up with your enquiry within the next 7 working days. Thank you for your patience. \n\nName:  {%name%}\nAge: {%age%}\nContact: {%contact%}\nSelected Gym: {%selectedGym%}";
    }
  }

  try {
    const template = await searchLocations(data.selectedGymId)

    if (template === null) {
      await sendToTelegram(`Unable to find location template, using default`)
    }

    let email;
    if (data.type === 'myself') {
      email = replaceTemplate(template, data)
    } else {
      email = replaceTemplate(template, {
        name: `${data.name} on behalf of ${data.seniorName}`,
        age: data.seniorAge,
        selectedGym: data.selectedGym,
        contact: data.contact,
      })
    }

    const text = 
      data.type === 'myself'
    ? `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}\nContact: ${data.contact}\nAddress: ${data.myAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`
    : `Name: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nSenior's Name: ${data.seniorName}\nSenior's Age: ${data.seniorAge}\nSenior's Address: ${data.seniorAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`;

    
    if (template !== null) {
      // send acknowledgement email
      await transporter.sendMail({
        from: `"Contact @ Gymtonic" <contact@gymtonic.sg>`, // sender address
        to: data.email, // list of receivershello@gymtonic.sg
        subject: 'Thank you for signing up for GymTonic', // Subject line
        text: email
      });
    }
    
    
    await transporter.sendMail({
      from: `"Contact @ Gymtonic" <contact@gymtonic.sg>`, // sender address
      to: 'hello@gymtonic.sg', // list of receivers
      subject: 'Sign up', // Subject line
      replyTo: data.email,
      text
    });
    await sendToTelegram(`New Email: \n\n${email}\n\n---\n\nNew registration: \n\n${text}`)

    res.status(200).json({...data})

  } catch (error) {
    const message = `Email API Error: ${error.message || JSON.stringify(error)}\n\n${JSON.stringify(data, null, 2)}`;
    await sendToTelegram(message);
    res.status(400).json({ error });
  }

  return true;
}
