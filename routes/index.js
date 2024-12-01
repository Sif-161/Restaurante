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

  router.get('/pedidos/load', async function(req, res, next) {
    try {
      const pedidosSnapshot = await await db.collection('pedidos').get();

      const pedidos = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      res.json(pedidos);
    } catch (error) {
      next(error);
    }
  });

  router.put('/pedidos/:id/atualizar', async (req, res) => {
    const pedidoId = req.params.id;
    const novoStatus = req.body.status;

    try {
      const pedidoRef = db.collection('pedidos').doc(pedidoId);
      const pedido = await pedidoRef.get();

      if(!pedido.exists){
        return res.status(404).json({ message: 'Pedido não encontrado '});
      }

      await pedidoRef.update({ status: novoStatus});
      
      const updatedPedido = {
        id: pedidoId,
        ...pedido.data(),
        status: novoStatus
      };
      res.json(pedido);

    } catch (error) {
      console.error('Erro ao atualizar o status do pedido');
      res.status(500).json({ message: 'Erro ao atualizar o status do pedido'});
    }
  }); 

  //configuração da pagina crud_pratos para mostrar os itens na tela
  router.get('/crud_pratos', function(req, res, next) {
    res.render('admin/crud_pratos', { title: 'Criação de pedidos'});
  });

  router.get('/crud_pratos/subcolecoes', async function(req, res, next) {
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
      const subcolecoesData = {};

      for (const subcolecao of subcolecoes){
        const documentoSnapshot = await subcolecao.get();
        const docuemntos = documentoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        subcolecoesData[subcolecao.id] = docuemntos;

      }

      return res.json({ subcolecoes: subcolecoesData });
      
    } catch (error) {
      next(error);
    }
  });

  //configuração da pagina crud_pratos para adicionar os itens do banco
  router.post('/crud_pratos/add', async function (req, res, next){
    try {
      const {menuId, subcolecaoId, novoItem} = req.body;
      
      const subcolecaoRef = db.collection('menus').doc(menuId).collection(subcolecaoId);

      await subcolecaoRef.add(novoItem);

      res.status(200).json({ message: 'Item adicionado com sucesso!' });
    } catch (error) {
      next(error);
    }
  });

  //configuração da pagina crud_pratos para editar os itens do banco
  router.put('/crud_pratos/edit', async function (req, res, next) {
    try {
        const { menuId, subcolecaoId, itemId, updatedItem } = req.body;

        console.log('Dados recebidos:', { menuId, subcolecaoId, itemId, updatedItem });

        if (!menuId || !subcolecaoId || !itemId || !updatedItem) {
            return res.status(400).json({ message: 'Dados insuficientes para editar o item' });
        }

        const itemRef = db.collection('menus')
                          .doc(menuId)
                          .collection(subcolecaoId)
                          .doc(itemId);

        const itemDoc = await itemRef.get();
        if (!itemDoc.exists) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }

        await itemRef.update(updatedItem);

        console.log('Item atualizado com sucesso!');
        res.status(200).json({ message: 'Item atualizado com sucesso' });
    } catch (error) {
        console.error('Erro no servidor:', error);
        res.status(500).json({ message: 'Erro interno no servidor', error: error.message, stack: error.stack });

    }
  });

  //configuração da pagina crud_pratos para excluir os itens do banco
  router.delete('/crud_pratos/delete', async function (req, res, next) {
    try {
      const { menuId, subcolecaoId, itemId } = req.body;
      const itemRef = db.collection('menus')
                        .doc(menuId)
                        .collection(subcolecaoId)
                        .doc(itemId);
      
      await itemRef.delete();

      res.status(200).json({ massage: 'Item excluido com sucesso!' });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

