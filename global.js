var pg = require('pg');
var bcrypto = require('bcrypt'); 

var config = require(__dirname + '/config.js');
var pgpool = new pg.Pool(config.postgres);
var hasher = {};

hasher.saltRounds = config.saltRounds;
hasher.crypt = bcrypto;

module.exports = {
	dbPool: pgpool,
	hasher: hasher
};
