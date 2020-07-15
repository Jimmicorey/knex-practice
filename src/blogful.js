/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable strict */

require('dotenv').config();
const knex = require('knex');
const ArticlesService = require('./articles-service');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

console.log(ArticlesService.getAllArticles());