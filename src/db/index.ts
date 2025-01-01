import { Sequelize } from 'sequelize';
import pg from 'pg';

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Les variables d\'environnement de la base de données sont requises');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectModule: pg,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: process.env.NODE_ENV !== 'production' ? console.log : false
  }
);

// Test de la connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données établie avec succès.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

export default sequelize;