// import { TextToSpeechClient } from "@google-cloud/text-to-speech";

// // Creates a client
// const client = new textToSpeech.TextToSpeechClient();

// export const textToSpeech = async (text) => {
//     // Construct the request
//     const request = {
//       input: {text: text},
//       // Select the language and SSML voice gender (optional)
//       voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
//       // select the type of audio encoding
//       audioConfig: {audioEncoding: 'MP3'},
//     };
  
//     // Performs the text-to-speech request
//     const [response] = await client.synthesizeSpeech(request);
//     console.log(response);
// };


// import axios from 'axios';
// import { GOOGLE_APPLICATION_CREDENTIALS } from '@env';

// const gcp = {
//   "type": "service_account",
//   "project_id": "mindmai-390517",
//   "private_key_id": "f0fa2dd18fff2b9aba8bf97d5da1fa1de29741c3",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCSCTWTn/vRm3s7\nr8r5Er2LwtE9b3iNe0z7x7HjXVapDOnBxvlpXurZouKyDE5JEtdhlryODzaAmlfW\nywgf+43xrJw8VYpiho2efAi5cRL/J+8W51XJ/BBKXJ0GO9Ls87gj3uoiRnvnT2Mo\nR5qEp6p8+/3A37c8lKbifGziJ6kCikZkWICuMfTDQsxUuRzHfwqmECFoESeNTOOG\nIHVFKtHnJYhfJ80K/A0tJGp5ikkYjWKK7/ljKctxU8H5lBA6E6fqPi206zyughs7\nywcaXbIg4JQmJ6b/dbWFAqjl+nMJSF9tS6WmD5gcT2/Sx/LflCHmfJFjI3UOz1Am\njrnEWvFZAgMBAAECggEAFyGjzaIb7FfdJXdjJmA4S1S8uWc4eGqVJ1V6gRnWAfl0\nZlf6xhy9hOMW1t55oPv9xyyt6a+Rsb2g17o5q304PtVZOvpOrOwErxuU8zCssmNU\nLPPQJCoLt4ejbKsZriQtoOrseajh8+Hggi8TU9tN9zWf/EbDWrJuG7ZbNdhT3j2k\n9AguFmCt8JOK/KqzWMUVhVp28UigtfIDumDz21bgP76QeiKE4BKxBOyZAjB+amls\njSZOH3YyKxw12ReC9qgboeJ0owDH28pNt/+9KNXcqO/7IAWyolokGFoTT/gghtjo\nRnU34hxF4evuQUftCX9ibYQAXuOgGLTK6KnReQdQnQKBgQDLNaaQWzIiw2pS6JGc\najYzYEZuRxNpjqvG+do8bgLtsckBOO47AVDaFI9rjeqX6/9flR2vXftLY15mXPmt\nTWLxvtWlUWRhB1Fx12totSjgyNaP6jcA9SrY3cdEh7K5Qsn7rJwWVnXkvFq2zDTm\nNZJAS7W6iVYlNmSoFiLLzmWs3QKBgQC3+UHrVDUP0w/E2Wd6XDN+63rDyZWnfVnE\n39vBKmS1o6gFr7Kpe2Kh2h5whUF7/q7ZQB3IPCfR7YHrrIzFrO7/jHQXk/HQ+rHK\n9Fbo06Akhjtfwd9O2yb5qsj/cSD9Tddbg1d0vi7KA9hupI3/mg9MeC9pN3oeRlI9\nPvhI0NegrQKBgQDAv3PtS0ND7B2m5IhxV+FvW+uSYIKORlCzXHzfgu3uLgtdyHVX\nrIjXQldDiooxbh19uUA9/iQFPwzkhV4iPtwSN5QIyiovSrS7Cb0MxYEvrfCu81cW\n5nWs3LhNTXV9+lcCDJjFK1+KBgr5hrrKfZfquqV2eRwoEe7p7I02yeBxVQKBgDWD\nXGhOUyzqMMEKl+3gmd4GMux2W4CflpgMoYhbg3XOR9Z3l9lymWsI3ifOqxCdMVDi\nNIeE7/RBSLQ7uaraNZ7BxRcCoqkt8r9dOVZ6EC/vl5+v7furBXhD9DlRN85WcRke\naDb+BvAeFDuCxAcgUejlYK0TRQM/YzaLdX8AuGf1AoGANW48yq24Gsswt0C+lEtc\n9MvcH62+t3x09/aNbgmYPBQOa6vvGcqSKpbGsv2FoWStKXTq3bHjLjs4vodiQKu+\nwkNwt/2FU9sxGvHTE7Pw9iH94fUrvak9CQadSSabC4SmnQaYFATJYExGNBxlgkTF\ntcL64ZcgAJucc0EdizVlLJU=\n-----END PRIVATE KEY-----\n",
//   "client_email": "mindmai@mindmai-390517.iam.gserviceaccount.com",
//   "client_id": "106889936847537559719",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mindmai%40mindmai-390517.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }


// export const textToSpeech = async (text) => {
//   try {
//     const apiUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize';

//     const request = {
//       input: { text },
//       voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
//       audioConfig: { audioEncoding: 'MP3' },
//     };

//     const response = await axios.post(apiUrl, request, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${gcp.private_key}`,
//       },
//     });

//     if (response.data.audioContent) {
//       return response.data.audioContent;
//     } else {
//       console.error('No audio content found in the response');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error synthesizing speech:', error);
//     return null;
//   }
// };
