const express = require('express');
const graphqlHTTP = require('express-graphql');

const ias = require('../src');

const schema = ias.createSchema({
  providers: [
    ias.sampleProviders.Basic(),
    //ias.providers.Slack({
    //  apiToken: process.env.SLACK_API_TOKEN
    //}),
  ],
});

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

module.exports = {
  app,
};

