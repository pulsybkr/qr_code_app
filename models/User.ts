import { Model, DataTypes } from 'sequelize';
import sequelize from '../src/db/index';

class Controlleur extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare photoData: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare tokenResetPassword: string;
}

Controlleur.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photoData: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'controlleur',
    },
    tokenResetPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Controlleur',
  }
);

export default Controlleur; 