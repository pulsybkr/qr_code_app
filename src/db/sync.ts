import sequelize from '.';
import Controlleur from '../../models/User';

async function sync() {
  try {
    await sequelize.sync({ alter: true }); // Attention: force: true supprimera toutes les tables existantes
    console.log('Base de données synchronisée avec succès');
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
  } finally {
    await sequelize.close();
  }
}

sync(); 