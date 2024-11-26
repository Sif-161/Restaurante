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

  //configuração da pagina crud_pedidos para mostrar os itens na tela
  router.get('/crud_pedidos', function(req, res, next) {
    res.render('admin/crud_pedidos', { title: 'Criação de pedidos'});
  });

  router.get('/crud_pedidos/subcolecoes', async function(req, res, next) {
    try {
      const { menu } = req.query;

      if (!menu) {
        return res.status(400).json({ message: 'Menu não encontrado '});
      }

      const menusCollection = db.collection('menus');
      const menuDoc = await menusCollection.doc(menu).get();

      if (!menuDoc.exists) {
        return res.status(404).json({ message: 'Menu não encontrado' });
      }

      const subcolecoes = await menuDoc.ref.listCollections();
      const subcolecoesData = subcolecoes.map(subcolecao => ({
        subcolecao: subcolecao.id
      }));

      return res.json({ subcolecoes: subcolecoesData });
      
    } catch (error) {
      next(error);
    }
  });

  //configuração da pagina crud_pedidos para adicionar os itens do banco
  router.post('/crud_pedidos/add', async function (req, res, next){
    try {
      const {menuId, subcolecaoId, novoItem} = req.body;
      
      const subcolecaoRef = db.collection('menus').doc(menuId).collection(subcolecaoId);

      await subcolecaoRef.add(novoItem);

      res.status(200).json({message: 'Item adicionado com sucesso!'});
    } catch (error) {
      next(error);
    }
  });


  //configuração da pagina crud_pedidos para editar os itens do banco

  //configuração da pagina crud_pedidos para excluir os itens do banco

  return router;
};

