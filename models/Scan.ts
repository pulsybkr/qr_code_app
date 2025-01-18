import { Model, DataTypes } from 'sequelize';
import sequelize from '../src/db/index';
import Controlleur from './User';

class Scan extends Model {
  declare id: string;
  declare controlleurId: string;
  declare licence: string;
  declare nom: string;
  declare prenom: string;
  declare photoUrl: string;
  declare localPhotoPath?: string;
  declare rawData?: string;
  declare htmlStructure?: string;
  declare photoData: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Scan.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    controlleurId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Controlleurs',
        key: 'id'
      }
    },
    licence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    localPhotoPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rawData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    htmlStructure: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photoData: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'Scan',
    tableName: 'scans'
  }
);

// Définir la relation avec le modèle Controlleur
Scan.belongsTo(Controlleur, {
  foreignKey: 'controlleurId',
  as: 'controlleur'
});

export default Scan; 