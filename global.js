var pg = require('pg');

var config = require(__dirname + '/config.js');
var pgpool = new pg.Pool(config.postgres);

module.exports = {
	pool: pgpool
};
