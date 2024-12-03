
# Sistema de Gerenciamento de Cardápio e Pedidos

## Visão Geral

Este é um sistema backend desenvolvido com **Node.js** e **Express.js** para gerenciar um cardápio de alimentos e bebidas, além de permitir o gerenciamento de pedidos feitos pelos usuários. A aplicação utiliza o **Firebase Firestore** como banco de dados para armazenar os menus, itens e pedidos.

## Arquitetura

A aplicação segue a arquitetura **MVC (Model-View-Controller)**, com os seguintes componentes principais:

- **Model (Firestore)**: O Firestore é usado para armazenar os dados de menus, subcoleções e pedidos.
- **View (EJS)**: As páginas são renderizadas usando **EJS** como template engine.
- **Controller (Express.js Routes)**: As rotas do **Express** gerenciam as interações com o banco de dados e o frontend.

### Principais Tecnologias

- **Node.js**: Plataforma JavaScript no servidor.
- **Express.js**: Framework para construção de APIs e gerenciamento de rotas.
- **EJS**: Template engine para renderização dinâmica de páginas HTML.
- **Firebase Firestore**: Banco de dados NoSQL do Firebase para armazenar menus e pedidos.
- **Firebase Admin SDK**: Utilizado para acessar e interagir com o Firestore no backend.

## Funcionalidades

### 1. **Menu Principal**
- Exibição dinâmica do menu principal, com categorias de itens (como sobremesas e bebidas).
- Recupera os dados do Firestore, listando subcoleções e seus itens.
- Rota: `GET /` (Página principal de menu).

### 2. **Sobremesas**
- Exibição de itens de sobremesa disponíveis para os clientes escolherem.
- Rota: `GET /sobremesa`.

### 3. **Bebidas**
- Exibição de itens de bebidas disponíveis para os clientes.
- Rota: `GET /bebidas`.

### 4. **Formulário de Pedido**
- Recebe dados do pedido enviado pelo usuário (como itens escolhidos).
- Salva o pedido na coleção `pedidos` no Firestore para processamento posterior.
- Rota:
  - `GET /formulario` (Formulário para o usuário preencher).
  - `POST /formulario` (Envia os dados do pedido para o banco de dados).

### 5. **Visualização e Gerenciamento de Pedidos (Admin)**
- O administrador pode visualizar todos os pedidos feitos pelos usuários.
- O status dos pedidos pode ser atualizado diretamente na interface de administração.
- Rota:
  - `GET /pedidos` (Visualizar pedidos).
  - `GET /pedidos/load` (Carregar pedidos do banco de dados).
  - `PUT /pedidos/:id/atualizar` (Atualizar o status de um pedido).

### 6. **CRUD de Itens do Cardápio (Admin)**
- O administrador pode adicionar, editar e excluir itens do cardápio.
- As operações de CRUD são realizadas diretamente no Firestore, alterando subcoleções de menus e pratos.
- Rota:
  - `GET /crud_pratos` (Página de administração de itens).
  - `GET /crud_pratos/subcolecoes` (Carregar subcoleções de um menu específico).
  - `POST /crud_pratos/add` (Adicionar novo item ao cardápio).
  - `PUT /crud_pratos/edit` (Editar um item existente no cardápio).
  - `DELETE /crud_pratos/delete` (Excluir um item do cardápio).

## Estrutura de Diretórios

```
.
├── bin/
│   └── www                       # Arquivo de inicialização do app             
├── node_modules/                 # Dependências do projeto
├── public/                       
│   ├── images/                   # Imagens estáticas
│   ├── javascripts/              # Arquivos de JS
│   └── stylesheets/              # Arquivos CSS
├── routes/
│   └── index.js                  # Rotas principais do projeto e conexões com o banco
├── views/
│   ├── menus/                    # Views específicas para menus
│   ├── admin/                    # Views para a área administrativa
│   └── index.ejs                 # Página inicial (Menu Principal)
├── package.json                  # Dependências e scripts do projeto
└── README.md                     # Este arquivo
```


## Como Usar

### Requisitos

- **Node.js**: Versão 14 ou superior.
- **Firebase**: Conta e projeto no Firebase configurado.

### Passos para Executar

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/usuario/menu-digital.git
    ```

2. **Instale as dependências:**
    ```bash
    cd menu-digital
    npm install
    ```
  
3. **Inicie o servidor:**
    ```bash
    npm start
    ```

4. **Acesse o sistema:**
    - Acesse o menu principal através de `http://localhost:3000`.
    - O painel administrativo pode ser acessado em `http://localhost:3000/login`.

## Exemplo de Uso do Banco (Firestore)

### Estrutura de Dados

O banco de dados Firestore é estruturado da seguinte forma:

- **Coleção** `menus`: Contém documentos representando diferentes menus (ex: `menu_principal`, `sobremesa`, `bebidas`).
  - **Subcoleções**: Cada documento de menu pode ter várias subcoleções, que representam categorias ou tipos específicos de pratos (ex: `entradas`, `pratos_principais`).

### Adicionando Itens ao Menu

Para adicionar um novo item ao menu, use o endpoint `POST /crud_pratos/add` com os seguintes dados:

- **Request Body (JSON):**
    ```json
    {
        "menuId": "menu_principal",
        "subcolecaoId": "entradas",
        "novoItem": {
            "nome": "Salada Ceasar",
            "descricao": "Salada fresca com molho Caesar",
            "preco": 19.99
        }
    }
    ```

- **Resposta Exemplo:**
    ```json
    {
        "message": "Item adicionado com sucesso!"
    }
    ```

### Visualizando Itens de Menu

Para visualizar os itens de uma subcoleção de menu, use o endpoint `GET /crud_pratos/subcolecoes?menu=menu_principal` com o parâmetro `menu`.

- **Request URL:**
    ```text
    GET http://localhost:3000/crud_pratos/subcolecoes?menu=menu_principal
    ```

- **Resposta Exemplo:**
    ```json
    {
        "subcolecoes": {
            "entradas": [
                {
                    "id": "item1",
                    "nome": "Salada Ceasar",
                    "descricao": "Salada fresca com molho Caesar",
                    "preco": 19.99
                }
            ],
            "pratos_principais": [
                {
                    "id": "item2",
                    "nome": "Frango Grelhado",
                    "descricao": "Frango grelhado com arroz e legumes",
                    "preco": 29.99
                }
            ]
        }
    }
    ```

### Atualizando o Status do Pedido

O administrador pode atualizar o status de um pedido usando o endpoint `PUT /pedidos/:id/atualizar`.

- **Request Body (JSON):**
    ```json
    {
        "status": "em preparo"
    }
    ```

- **Resposta Exemplo:**
    ```json
    {
        "id": "pedido_id",
        "status": "em preparo"
    }
    ```

### Excluindo Itens do Menu

Para excluir um item do menu, use o endpoint `DELETE /crud_pratos/delete` com os dados do item a ser removido.

- **Request Body (JSON):**
    ```json
    {
        "menuId": "menu_principal",
        "subcolecaoId": "entradas",
        "itemId": "item1"
    }
    ```

- **Resposta Exemplo:**
    ```json
    {
        "message": "Item excluído com sucesso!"
    }
    ```

## Observações

Este projeto foi desenvolvido para proporcionar uma interface simples para gerenciamento de um sistema de cardápio e pedidos. A arquitetura é modular e baseada em boas práticas de desenvolvimento backend com **Express.js**.

Para contribuir ou modificar o sistema, basta realizar um fork ou clone deste repositório e seguir as etapas de configuração mencionadas acima para a instalação e execução.

