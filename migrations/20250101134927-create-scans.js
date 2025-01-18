'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('scans', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      controlleurId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Controlleurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      licence: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      photoUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      localPhotoPath: {
        type: Sequelize.STRING,
        allowNull: true
      },
      rawData: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      htmlStructure: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      photoData: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Ajouter un index sur la licence pour optimiser les recherches
    await queryInterface.addIndex('scans', ['licence']);
    
    // Ajouter un index sur createdAt pour optimiser les recherches temporelles
    await queryInterface.addIndex('scans', ['createdAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('scans');
  }
}; 