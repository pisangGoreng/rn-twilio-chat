require('dotenv').config();

const Twilio = require('twilio');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const AccessToken = Twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

app.get('/token/:identity', (req, res) => {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
  );

  token.identity = req.params.identity;
  token.addGrant(
    new ChatGrant({
      serviceSid: process.env.TWILIO_CHAT_SERVICE_SID,
    }),
  );
  const response = {
    token,
    identity: token.identity,
    jwt: token.toJwt(),
  };
  console.log(response);

  res.send(response);
});

app.listen(3001, function () {
  console.log('Programmable Chat server running on port 3001!');
});
