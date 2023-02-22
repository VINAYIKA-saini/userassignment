const express = require('express');
const route = require('./src/routes/router');
const mongoose = require('mongoose');
const app = express();
const bodyParser=require('body-parser')
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(bodyParser.urlencoded({ extended:true}));



mongoose.connect("mongodb+srv://panigrahisameer_200:iklsSoxrtvpy4JOK@cluster0.kyd9m93.mongodb.net/infosoftsquare", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"), err => console.log(err))


app.use('/', route);


app.listen(PORT, function () {
    console.log('Express app running on port' + PORT)
});