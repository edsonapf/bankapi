import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configJson from '../../config/database/config';
import { NODE_ENV, DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } from '../../config/env';

const basename = path.basename(__filename);
const env = NODE_ENV ? NODE_ENV : 'development';

const config = configJson[env];

console.log('this is the environment: ', env);

const db = {};

let sequelize;
if (config.environment === 'production') {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    dialectOption: {
      ssl: true,
      native: true
    },
    logging: true
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
