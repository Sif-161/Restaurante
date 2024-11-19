var express = require('express');
var router = express.Router();

//configuração da tela Menu Principal
module.exports = function (db) {
  router.get('/', async function (req, res, next) {
    try {
      const menuPrincipalDoc = db.collection('menus').doc('menu_principal');
      const subcolecoes = await menuPrincipalDoc.listCollections();

      const menus = [];

      for (const subcolecao of subcolecoes) {
        const snapshot = await subcolecao.get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        menus.push({
          subcolecao: subcolecao.id,
          items,
        });
      }

      res.render('index', { title: 'Menu Principal', menus });
    } catch (error) {
      next(error);
    }
  });

  //configuração da tela sobremesa
  router.get('/sobremesa', async function (req, res, next) {
    try {
      const menuPrincipalDoc = db.collection('menus').doc('sobremesa');
      const subcolecoes = await menuPrincipalDoc.listCollections();

      const menus = [];

      for (const subcolecao of subcolecoes) {
        const snapshot = await subcolecao.get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        menus.push({
          subcolecao: subcolecao.id,
          items,
        });
      }

      res.render('sobremesa', { title: 'Sobremesa', menus });
    } catch (error) {
      next(error);
    }
  });

  //configuração da tela bebidas
  router.get('/bebidas', async function (req, res, next) {
    try {
      const menuPrincipalDoc = db.collection('menus').doc('bebidas');
      const subcolecoes = await menuPrincipalDoc.listCollections();

      const menus = [];

      for (const subcolecao of subcolecoes) {
        const snapshot = await subcolecao.get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        menus.push({
          subcolecao: subcolecao.id,
          items,
        });
      }

      res.render('bebidas', { title: 'Bebidas', menus });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

