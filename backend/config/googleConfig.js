import { google } from "googleapis";
import dotenv from "dotenv";
if(process.env.NODE_ENV != 'production'){
    dotenv.config(); 
}

/**
 * Document refered
 * https://medium.com/@dugar_rishab/how-to-use-google-oauth-with-mern-stack-a988947e64f4
 * https://console.cloud.google.com/apis/credentials.
 */

export const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: 'postmessage',
  });
  