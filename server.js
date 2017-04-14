//require libs
var express = require('express');
var bodyParser = require('body-parser');

//global vars
var app = express();
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());

var schedule = require('./router/schedules');
var user = require('./router/users');

//User functionality
app.post('/user', user.createUser);
app.get('/user', user.loginUser);

app.get('/schedules', schedule.getSchedules);

app.listen(4000);
console.log('listening on port 4000');
