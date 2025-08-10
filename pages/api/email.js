import { gql, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import nodemailer from 'nodemailer';
import Validator from 'validatorjs';
require('cross-fetch/polyfill');

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

  const client = new ApolloClient({
    // link: createHttpLink({ uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql` }),
    uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
    cache: new InMemoryCache(),
  })

  function replaceTemplate(template, data) {
    return template.replace(/{%(\w+)%}/g, (match, key) => {
      return data.hasOwnProperty(key) ? data[key] : match;
    });
  }

  function removeParentheses(str) {
    return str.replace(/\s*\([^)]*\)/g, '').trim();
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

      const { data } = await client.query({
        query,
        variables: { searchTerm: removeParentheses(searchTerm) }
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
      throw error;
    }
  }

  try {
    const template = await searchLocations(data.selectedGymId)
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

    if (template !== null) {
      // send acknowledgement email
      await transporter.sendMail({
        from: `"Contact @ Gymtonic" <contact@gymtonic.sg>`, // sender address
        to: data.email, // list of receivershello@gymtonic.sg
        bcc: 'signorekai@gmail.com',
        subject: 'Thank you for signing up for GymTonic', // Subject line
        text: email
      });
    }

    await transporter.sendMail({
      from: `"Contact @ Gymtonic" <contact@gymtonic.sg>`, // sender address
      to: 'hello@gymtonic.sg', // list of receivers
      bcc: 'signorekai@gmail.com',
      subject: 'Sign up', // Subject line
      replyTo: data.email,
      text:
        data.type === 'myself'
          ? `Name: ${data.name}\nAge: ${data.age}\nEmail: ${data.email}\nContact: ${data.contact}\nAddress: ${data.myAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`
          : `Name: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nSenior's Name: ${data.seniorName}\nSenior's Age: ${data.seniorAge}\nSenior's Address: ${data.seniorAddress}\nSelected Gym: ${data.selectedGym}\nNote: ${data.note}`,
    });
    

    res.status(200).json({...data})
  } catch (error) {
    res.status(400).json({ error });
  }

  return true;
}
