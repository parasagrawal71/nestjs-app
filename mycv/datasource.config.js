const { DataSource } = require('typeorm');
const dbConfig = require('./ormconfig');

module.exports.AppDataSource = new DataSource(dbConfig);
