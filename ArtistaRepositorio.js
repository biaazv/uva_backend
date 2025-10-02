const { Artista } = require('./models');

const obterArtista = async() => {
    return await Artista.findAll({
        attributes:['id','nome','data_nascimento','pais']
    })
}

const salvarArtista = async (nome, data_nascimento, pais) => {
    const artista = await Artista.create({
        nome: nome, data_nascimento:data_nascimento, pais:pais
    });
    return artista
}

const excluirArtista = async(id) => {
    const artista = await Artista.findByPk(id);
    if (artista){
        await artista.destroy();
    }
}

module.exports = {
    obterArtista: obterArtista,
    salvarArtista: salvarArtista,
    excluirArtista: excluirArtista
}