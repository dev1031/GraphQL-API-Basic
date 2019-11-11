const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/qraphqlTestDb',{ useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connection.once('open' , ()=>{
    console.log('Datbase Connected');
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

app.listen(PORT ,(req, res)=>{
    console.log(`The server is running at ${PORT}`)
})
