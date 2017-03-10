//require libs
var express = require('express');

//global vars
var app = express();
var queries = require('./router/schedules');

app.get('/schedules', queries.getSchedules);

app.listen(4000);
console.log('listening on port 4000');



