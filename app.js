//import module
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

//get port from env
const port = process.env.PORT;

//init spotify
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

//generate app und bind public folder
const app = express();
app.use(express.static('public'));

//view engine
app.set('view engine', 'ejs')

//port listener
app.listen(port, () => {
  //ToDo: write in log
  console.log(`listening at http://localhost:${port}`);
});

//Router
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/artist-search', (req, res) => {
  spotifyApi.searchArtists(req.query.searchByArtist)
    .then(function (data) {
      res.render('pages/artist-search-results.ejs', { artists: data.body.artists.items })
    }, function (err) {
      console.error(err);
    });
})

app.get('/albums/:id', (req, res) => {
  spotifyApi.getArtistAlbums(req.params.id)
    .then(function (data) {
      res.render('pages/albums.ejs', { album: data.body.items })
    },
      function (err) {
        console.error(err);
      }
    );
});

app.get('/album/tracks/:id', (req, res) => {
  res.render('pages/tracks.ejs', { id: req.params.id })
})
