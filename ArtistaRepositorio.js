const { Artista } = require('./models');

//CRUD

//Create
const salvarArtista = async (nome, genero,data_nascimento, pais) => {
    const artista = await Artista.create({
        nome: nome, genero:genero, data_nascimento:data_nascimento, pais:pais
    });
    return artista
}

//Read
const obterArtista = async() => {
    return await Artista.findAll({
        attributes:['id','nome','genero','data_nascimento','pais']
    })
}

//Update
const atualizarArtista = async (id, nome, genero, data_nascimento, pais) => {
  const artista = await Artista.findByPk(id);

  if (!artista) {
    return null; // não achou artista com esse id
  }

  artista.nome = nome;
  artista.genero = genero;
  artista.data_nascimento = data_nascimento;
  artista.pais = pais;

  await artista.save();
  return artista;
};

//Delete
const excluirArtista = async(id) => {
    const artista = await Artista.findByPk(id);
    if (artista){
        await artista.destroy();
    }
}

module.exports = {
    obterArtista: obterArtista,
    salvarArtista: salvarArtista,
    excluirArtista: excluirArtista,
    atualizarArtista: atualizarArtista,
}