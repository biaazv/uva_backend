const repo = require('./ArtistaRepositorio.js')

repo.obterArtista().then((artistas) => {
    console.log("==========================");
    for (let a of artistas)
        console.log(JSON.stringify(a));
    console.log("==========================");
})