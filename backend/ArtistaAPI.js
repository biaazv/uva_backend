const repo = require('./ArtistaRepositorio.js')

const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
const API = 'http://localhost:';
const port = 3000;
const artistas = '/artistas'

//CRUD

//Create
app.post(`${artistas}`, async (req, res) => {
    const nome = req.body.nome;
    const genero = req.body.genero;
    const data_nascimento = req.body.data_nascimento;
    const pais = req.body.pais;
    const artista = await repo.salvarArtista(nome,genero,data_nascimento,pais);
    res.json(artista);
    res.end();
})

//Read
app.get('/artistas', async (req, res) => {
    const artistas = await repo.obterArtista();
    res.json(artistas);
    res.end();
})

//Read por Id
app.get('/artistas/:id', async (req, res) => {
  const id = req.params.id;
  const artista = await repo.obterArtistaPorId(id);

  if(!artista){
    return res.status(404).json({ error: 'Artista não encontrado'});
  }
  
  res.json(artista);
  res.end();
})


//Update
app.put('/artistas/:id', async (req, res) => {
  try {
    const id = req.params.id; // pega o id da URL
    const nome = req.body.nome;
    const genero = req.body.genero;
    const data_nascimento = req.body.data_nascimento;
    const pais = req.body.pais;

    const artista = await repo.atualizarArtista(id, nome, genero, data_nascimento, pais);

    if (!artista) {
      return res.status(404).json({ error: 'Artista não encontrado' });
    }

    res.json(artista);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar artista' });
  }
});

//Delete
app.delete('/artistas/:id', async (req, res) => {
    const id = req.params.id; //pega o id da URL
    const nome = req.body.nome;
    const genero = req.body.genero;
    const data_nascimento = req.body.data_nascimento;
    const pais = req.body.pais;

    const artista = await repo.excluirArtista(id)

    res.status(200).json('Artista deletado');
    res.end()
})

app.listen(port, () => {
    console.log(`Servidor executando na porta ${port}`);
})

