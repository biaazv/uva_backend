'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Artista extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Artista.init({
    nome: DataTypes.STRING,
    genero: DataTypes.STRING,
    data_nascimento: DataTypes.DATE,
    pais: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Artista',
  });
  return Artista;
};