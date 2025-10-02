'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Artista',[
      {
        nome: 'Bad Bunny',
        genero: 'Reggaeton/Trap',
        data_nascimento: new Date('1994-03-10'),
        pais: 'Porto Rico',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nome: 'Liniker',
        genero: 'MPB/Soul',
        data_nascimento: new Date('1995-07-03'),
        pais: 'Brasil',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Artista',null,{});
  }
};
