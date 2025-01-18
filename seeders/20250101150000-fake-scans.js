'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface, Sequelize) {

    const scans = [];

    const id = "571df0b4-a25b-45b2-a5bb-58d938501ba3"

    for (let i = 0; i < 20; i++) {
      scans.push({
        id: faker.string.uuid(),
        controlleurId: id,
        licence: faker.string.alphanumeric(10),
        nom: faker.person.lastName(),
        prenom: faker.person.firstName(),
        photoUrl: faker.image.avatar(),
        localPhotoPath: null,
        rawData: null,
        htmlStructure: null,
        photoData: faker.image.avatar(),
        createdAt: faker.date.recent({days: 1}),
        updatedAt: faker.date.recent({days: 1})
      });
    }

    await queryInterface.bulkInsert('scans', scans, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('scans', null, {});
  }
};
