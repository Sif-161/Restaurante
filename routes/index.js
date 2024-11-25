var express = require('express');
var router = express.Router();

// Configuração da página Menu Principal
module.exports = function (db) {
  router.get('/', async function (req, res, next) {
    try {
      const menuPrincipalDoc = db.collection('menus').doc('menu_principal');
      const subcolecoes = await menuPrincipalDoc.listCollections();

      const menus = await Promise.all(
        subcolecoes.map(async (subcolecao) => {
          const snapshot = await subcolecao.get();
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return {
            subcolecao: subcolecao.id,
            items,
          };
        })
      );

      res.render('index', { title: 'Menu Principal', menus });
    } catch (error) {
      next(error);
    }
  });

  // Configuração da página Sobremesa
  router.get('/sobremesa', async function (req, res, next) {
    try {
      const menuPrincipalDoc = db.collection('menus').doc('sobremesa');
      const subcolecoes = await menuPrincipalDoc.listCollections();

      const menus = await Promise.all(
        subcolecoes.map(async (subcolecao) => {
          const snapshot = await subcolecao.get();
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return {
            subcolecao: subcolecao.id,
            items,
          };
        })
      );

      res.render('menus/sobremesa', { title: 'Sobremesa', menus });
    } catch (error) {
      next(error);
    }
  });

  // Configuração da página Bebidas
  router.get('/bebidas', async function (req, res, next) {
    try {
      const menuPrincipalDoc = db.collection('menus').doc('bebidas');
      const subcolecoes = await menuPrincipalDoc.listCollections();

      const menus = await Promise.all(
        subcolecoes.map(async (subcolecao) => {
          const snapshot = await subcolecao.get();
          const items = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return {
            subcolecao: subcolecao.id,
            items,
          };
        })
      );

      res.render('menus/bebidas', { title: 'Bebidas', menus });
    } catch (error) {
      next(error);
    }
  });

  //configuração da pagina formulario
  router.get('/formulario', function(req, res, next) {
    res.render('menus/formulario', { title: 'Formulario' });
  });

  router.post('/formulario', async function(req, res, next) {
    try {
      const dados = req.body;
      const pedidosRef = db.collection('pedidos');
      const docRef = await pedidosRef.add(dados);

      res.status(200).json({massage: 'pedido enviado com sucesso!', data: docRef});
    } catch (error) {
      next(error)
    }
  })

  //configuração da pagina login
  router.get('/login', function(req, res, next) {
    res.render('admin/login', { title: 'Login' });
  });

  //configuração da pagina pedidos do administrador
  router.get('/pedidos', function(req, res, next) {
    res.render('admin/pedidos', { title: 'Pedidos' });
  });
  
  //configuração da pagina reservas do administrador
  router.get('/reservas', function(req, res, next) {
    res.render('admin/reservas', { title: 'Reservas' });
  });

  //configuração da pagina de criação e edição de pedidos do administrador
  router.get('/crud_pedidos', function(req, res, next) {
    res.render('admin/crud_pedidos', { title: 'Criação de pedidos' });
  });

  return router;
};

