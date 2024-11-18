var express = require('express');
var router = express.Router();

//pagina de menu principal
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//pagina de sobremesa
router.get('/sobremesa', function(req, res, next) {
  res.render('sobremesa', { title: 'Express' });
});

module.exports = router;
