const pg = require('pg');
const bcrypto = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require(__dirname + '/config.js');

const pgpool = new pg.Pool(config.postgres);
const hasher = {};

const tokenGen = {};

tokenGen.superSecert = config.secert;
tokenGen.jwt = jwt;

hasher.saltRounds = config.saltRounds;
hasher.crypt = bcrypto;

module.exports = {
    dbPool: pgpool,
    hasher: hasher,
    tokenGen: tokenGen
};
