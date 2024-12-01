function opcaoSelecionada(event){
    const valorSelecionado = event.target.value;
    const formContent = document.querySelector('.options-content');

    formContent.innerHTML = '';

    switch (valorSelecionado){
        case "1":
            formContent.innerHTML = gerarFormulario("adicionar");
            adicionarEventoDropArea();
            break;
        case "2":
            formContent.innerHTML = gerarFormulario("editar");
            break;
        default:
            formContent.innerHTML = '';
            break;
    }
}

function gerarFormulario(tipo){
    if(tipo === 'adicionar'){
        return `
        <form id="formItem" class="form-item" action="/crud_pratos/add" method="POST">
            <div class="campo imagem-campo">
                <label for="imagemItem">Imagem do Item</label>
                <div id="drop-area" class="drop-area" onclick="abrirSeletorImagem()">
                    <p>Arraste e solte a imagem aqui ou clique para selecionar</p>
                    <input type="file" id="imagemItem" name="imagemItem" accept="image/*" style="display:none;" onchange="exibirImagem(event)">
                    <input type="hidden" id="imagemBase64" name="imagemBase64">
                </div>
                <div id="imagemPreview" class="imagem-preview"></div>
            </div>
            <div class="campo">
                <label for="linkImagem">Ou insira o link da imagem</label>
                <input type="url" id="linkImagem" name="linkImagem" placeholder="URL da imagem" autocomplete="off">
            </div>
            <div class="options">
                <label for="menu-options">Menu</label>
                <select name="menu-options" id="menu-options" class="dropdown" onchange="carregarSubcolecoes(event)" required>
                    <option value="" disabled selected>Selecione uma opção</option>
                    <option value="menu_principal">Menu Principal</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="sobremesa">Sobremesas</option>
                </select>
            </div>
            <div class="options">
                <label for="submenu-options">Submenu</label>
                <select name="submenu-options" id="submenu-options" class="dropdown" required>
                    <option value="" disabled selected>Selecione uma opção</option>
                </select>
            </div>
            <div class="campo">
                <label for="nomeItem">Nome do item</label>
                <input type="text" id="nomeItem" name="nomeItem" placeholder="Digite o nome do item" required autocomplete="off">
            </div>
            <div class="campo">
                <label for="precoItem">Preço do item</label>
                <input type="number" id="precoItem" name="precoItem" placeholder="Digite o preço" step="0.01" required autocomplete="off">
            </div>
            <button type="button" onclick="addNovoItem()" id="save">Salvar</button>
        </form>
    `;
    } else if(tipo === 'editar'){
        return `
            <nav class="barra-navegacao">
                <ul id="menu-lista" class="menu-lista">
                    <li data-value="menu_principal" onclick="carregarItensSubcolecao('menu_principal')">Menu Principal</li>
                    <li data-value="bebidas" onclick="carregarItensSubcolecao('bebidas')">Bebidas</li>
                    <li data-value="sobremesa" onclick="carregarItensSubcolecao('sobremesa')">Sobremesas</li>
                </ul>
            </nav>
            <div class="cardapio">
                <div id="itens-subcolecao"></div>
            </div>
        `;
    }
   
}

function abrirSeletorImagem() {
    const inputFile = document.getElementById('imagemItem');
    inputFile.click();
}

//função para exibir a imagem na arrastada ou selecionada
function exibirImagem(event){
    let file;

    if(event.target && event.target.files && event.target.files.length > 0) {
        file = event.target.files[0];
    } else if(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length>0){
        file = event.dataTransfer.files[0];
    }else{
        console.error("Nenhum arquivo encontrado");
        return;
    }

    if(file){
        const preview = document.getElementById('imagemPreview');
        const reader = new FileReader();

        reader.onload = function(e){
            preview.innerHTML = `<img src="${e.target.result}" alt="Imagem do item" style="max-Width: 200px; max-Height: 200px" >`;

            const base64String = e.target.result;
            console.log("Imagem em base64:", base64String);

            const hiddenInput = document.getElementById('imagemBase64');
            if (hiddenInput) {
                hiddenInput.value = base64String;
            }
        };
        reader.readAsDataURL(file);
    } else{
        console.error("Nenhum arquivo selecionado ou arquivo esta indefinido");
    }
}


// Função para permitir o drag-and-drop
function adicionarEventoDropArea() {
    const dropArea = document.getElementById('drop-area');
    if (dropArea) {
        dropArea.addEventListener('dragover', function(event) {
            event.preventDefault();
            event.stopPropagation();
            dropArea.classList.add('drag-over');
        });

        dropArea.addEventListener('dragleave', function(event) {
            event.preventDefault();
            event.stopPropagation();
            dropArea.classList.remove('drag-over');
        });

        dropArea.addEventListener('drop', function(event) {
            event.preventDefault();
            event.stopPropagation();

            const files = event.dataTransfer.files;

            if (files.length > 0) {
                const inputFile = document.getElementById('imagemItem');
                inputFile.files = files;
                exibirImagem({ dataTransfer: { files } });
            } else {
                console.error("Nenhum arquivo foi arrastado ou solto")
            }
        });
    }
}


//função para mostrar as subcoleções do banco nas options
function carregarSubcolecoes(event){
    const valorSelecionado = event.target.value;
    const submenuSelect = document.getElementById('submenu-options');

    submenuSelect.innerHTML = '<option value="" disabled selected>Selecione uma opção</option>';

    fetch(`/crud_pratos/subcolecoes?menu=${valorSelecionado}`)
    .then(response => {
        if (!response.ok){
            throw new Error('Falha ao buscar dados do servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.subcolecoes) {
            for(const [subcolecaoId, documentos] of Object.entries(data.subcolecoes)){
                const option = document.createElement('option');
                option.value = subcolecaoId;
                option.textContent = subcolecaoId;
                submenuSelect.appendChild(option);
            }
        }
    })
    .catch(error => {
        console.error('error ao carregar as subcoleções: ', error);
    });
}


//função para mostrar os itens das subcoleções
function carregarItensSubcolecao(menuSelecionado){
    const itensContainer = document.getElementById('itens-subcolecao');
    const spinner = `
        <div class="spinner-container">
            <div class="spinner"></div>
            <p>Carregando itens<span class="dots"></span></p>
        </div>
    `;

    itensContainer.innerHTML = spinner;

    itensContainer.className = 'grid-container';

    fetch(`/crud_pratos/subcolecoes?menu=${menuSelecionado}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao buscar dados do servidor');
        }
        return response.json();
    })
    .then(data => {
        itensContainer.innerHTML = '';
        if (data.subcolecoes) {
            Object.entries(data.subcolecoes).forEach(([subcolecaoNome, documentos]) => {
                if (documentos.length > 0) {
                    documentos.forEach(doc => {
                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'option-item';
                        itemDiv.dataset.itemId = doc.id;
                        itemDiv.dataset.menuId = menuSelecionado;
                        itemDiv.dataset.subcolecaoId = subcolecaoNome;

                        itemDiv.innerHTML = `
                            <div class="option-item-wrap">
                                <div class="option-icons">
                                    <span class="icon-edit" title="Editar"><i class="bi bi-pen-fill"></i></span>
                                    <span class="icon-delete" title="Excluir"><i class="bi bi-trash-fill"></i></span>
                                </div>
                                <div class="option-img">  
                                    <picture>
                                        <img src="${doc.imagem || '#'}" alt="${doc.nome || 'Sem nome'}" class="item-img">
                                    </picture>
                                </div>
                                <div class="option-name">
                                    <p>${doc.nome || 'Sem nome'}</p>
                                </div>
                                <div class="option-price">
                                    <span id="preco">${doc.preco ? `R$${doc.preco.toLocaleString('pt-br', {minimumFractionDigits: 2})}` : 'Sob consulta'}</span>
                                </div>
                            </div>
                        `;
                        itensContainer.appendChild(itemDiv);
                    });
                }
            });

            //evento para excluir um item
            document.querySelectorAll('.icon-delete').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const itemDiv = event.target.closest('.option-item');
                    const menuId = itemDiv.dataset.menuId;
                    const subcolecaoId = itemDiv.dataset.subcolecaoId;
                    const itemId = itemDiv.dataset.itemId;

                    const contentModal = `
                        <i class="bi bi-exclamation-circle"></i>
                        <p>Tem certeza que deseja excluir este item?</p>
                        <div class="modal-buttons">
                            <button id="confirm" class="btn btn-danger">Excluir</button>
                            <button id="cancel" class="btn btn-secondary">Cancelar</button>
                        </div>
                    `;

                    mostrarModal(contentModal, 'excluir', menuId, subcolecaoId, itemId, itemDiv);
                });
            });

            //evento para editar um item
            document.querySelectorAll('.icon-edit').forEach(icon => {
                icon.addEventListener('click', (event) => {
                    const itemDiv = event.target.closest('.option-item');
                    const menuId = itemDiv.dataset.menuId;
                    const subcolecaoId = itemDiv.dataset.subcolecaoId;
                    const itemId = itemDiv.dataset.itemId;

                    const precoElemento = document.getElementById('preco');

                    const nome = itemDiv.querySelector('.option-name').innerText;
                    const imagem = itemDiv.querySelector('.option-img').src;
                    let preco = parseFloat(precoElemento.innerText.replace('R$', '').replace(',', '.').trim());

                    const contentModal = `
                        <form id="formItem" class="form-item">
                            <div class="campo imagem-campo">
                                <label for="imagemItem">Imagem do Item</label>
                                <div id="drop-area" class="drop-area" onclick="abrirSeletorImagem()">
                                    <p>Arraste e solte a imagem aqui ou clique para selecionar</p>
                                    <input type="file" id="imagemItem" name="imagemItem" accept="image/*" style="display:none;" onchange="exibirImagem(event)">
                                    <input type="hidden" id="imagemBase64" name="imagemBase64">
                                </div>
                                <div id="imagemPreview" class="imagem-preview"></div>
                            </div>
                            <div class="campo">
                                <label for="linkImagem">Ou insira o link da imagem</label>
                                <input type="url" id="linkImagem" name="linkImagem" placeholder="URL da imagem" autocomplete="off">
                            </div>
                            <div class="campo">
                                <label for="nomeItem">Nome do item</label>
                                <input type="text" id="nomeItem" name="nomeItem" placeholder="Digite o nome do item"value="${nome}" autocomplete="off">
                            </div>
                            <div class="campo">
                                <label for="precoItem">Preço do item</label>
                                <input type="number" id="precoItem" name="precoItem" placeholder="Digite o preço" value="${preco}" autocomplete="off">
                            </div>
                            <div class="modal-buttons">
                                <button id="confirm" class="btn btn-add" type="button">Salvar</button>
                                <button id="cancel" class="btn btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    `;

                    mostrarModal(contentModal, 'editar', menuId, subcolecaoId, itemId, itemDiv);
                });
            });
        } else {
            itensContainer.innerHTML = '<p>Nenhuma subcoleção encontrada.</p>';
        }
    })
    .catch(error => {
        console.error('Erro ao carregar itens da subcoleção:', error);
        itensContainer.innerHTML = '<p>Erro ao carregar itens. Tente novamente mais tarde.</p>';
    });
}

//função para enviar os novos pratos para o banco
async function addNovoItem(){
    try {
        const menuId = document.getElementById('menu-options').value;
        const subcolecaoId = document.getElementById('submenu-options').value;
        const nome = document.querySelector('input[name="nomeItem"]').value;
        const preco = document.querySelector('input[name="precoItem"]').value;
        let imagemBase64 = document.querySelector('input[name="imagemBase64"]').value;
        let imagemLink = document.querySelector('input[name="linkImagem"]').value;

        let imagem = imagemBase64 || imagemLink || undefined;

        if(!nome) throw new Error("O campo 'Nome' é obrigatorio.");
        if(!preco) throw new Error("O campo 'Preço' é obrigatorio.");

        const response = await fetch('/crud_pratos/add', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                menuId: menuId,
                subcolecaoId: subcolecaoId,
                novoItem: {
                    nome: nome,
                    preco: preco,
                    imagem: imagem
                },
            }),
        });

        const result = await response.json();

        if(response.ok){
            console.log('Item adicionado com sucesso:', result);
            alert('Item adicionado com sucesso!');
            document.getElementById("formItem").reset();
            imagemPreview.innerHTML = '';
            document.getElementById('imagemBase64').value = '';
        }else{
            throw new Error(result.message || "Erro ao adicionar item.");
        }
    } catch (error) {
        console.error('Error ao adicionar item: ', error);
        alert('Error ao processar requisição: ', error);
    }
}

function editItem(menuId, subcolecaoId, itemId, itemDiv, modal) {
    const preco = parseFloat(document.getElementById('precoItem').value.replace(',', '.'));
    const nome = document.getElementById('nomeItem').value.replace(',', '.');

    let imagemBase64 = document.querySelector('input[name="imagemBase64"]').value;
    let imagemLink = document.querySelector('input[name="linkImagem"]').value;

    let imagem = imagemBase64 || imagemLink || itemDiv.querySelector('.option-img img').src;

    const updatedItem = {
        nome: nome,
        preco: preco,
        imagem: imagem
    };

    modal.classList.add('loading');
    modal.querySelector('.modal-content').innerHTML = `
        <div class="spinner-modal">
            <div class="spinner"></div>
            <p>Salvando as alterações<span class="dots"></span></p>
        </div>
    `;
    
    fetch('/crud_pratos/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            menuId,
            subcolecaoId,
            itemId,
            updatedItem
        })
    })
    .then(response => {
        console.log('Resposta do servidor:', response);
        if (!response.ok) {
            throw new Error('Erro ao editar item');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        modal.querySelector('.modal-content').innerHTML = `
            <div class="success-message">
                <i class="bi bi-check-circle"></i>
                <p>${data.message || 'Item editado com sucesso!'}</p>
            </div>
            <button id="closeModal" class="btn btn-secondary">Fechar</button>
        `;

        itemDiv.querySelector('.option-name p').innerText = updatedItem.nome;
        itemDiv.querySelector('.option-price span').innerText = `R$${updatedItem.preco.toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
        itemDiv.querySelector('.option-img img').src = updatedItem.imagem || '#';

        document.getElementById('closeModal').addEventListener('click', () => {
            modal.style.display = 'none';
            modal.remove();
        });
    })
    .catch(error => {
        console.error('Erro ao atualizar o item:', error);
        modal.querySelector('.modal-content').innerHTML = `
            <div class="error-message">
                <p>Erro ao salvar as alterações. Tente novamente.</p>
            </div>
            <button id="closeModal" class="btn btn-secondary">Fechar</button>
        `;
    });
}

function excluirItem(menuId, subcolecaoId, itemId, itemDiv, modal){
    console.log('Enviando para exclusão:', { menuId, subcolecaoId, itemId });

    modal.classList.add('loading');
    modal.querySelector('.modal-content').innerHTML = `
        <div class="spinner-modal">
            <div class="spinner"></div>
            <p>Excluindo item<span class="dots"></span></p>
        </div>
    `;

    fetch('/crud_pratos/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({
            menuId,
            subcolecaoId,
            itemId,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao excluir item');  
        }
        return response.json();
    })
    .then(data => {
        modal.querySelector('.modal-content').innerHTML = `
            <div class="success-message">
                <i class="bi bi-check-circle"></i>
                <p>${data.message || 'Item excluido com sucesso!'}</p>
            </div>
            <button id="closeModal" class="btn btn-secondary">Fechar</button>
        `;

        document.getElementById('closeModal').addEventListener('click', () => {
            modal.style.display = 'none';
            itemDiv.remove();
        });
    })
    .catch(error => {
        console.error('Erro ao excluir item:', error);
        modal.querySelector('.modal-content').innerHTML = `
            <div class="error-message">
                <p>Erro ao excluir item. Tente novamente.</p>
            </div>
            <button id="closeModal" class="btn btn-secondary">Fechar</button>
        `;
    });
}

function mostrarModal(content, tipo, menuId, subcolecaoId, itemId, itemDiv){
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content ${tipo}">
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
    adicionarEventoDropArea();
    if (tipo === 'excluir') {
        const confirmButton = modal.querySelector('#confirm');
        if (confirmButton) {
            confirmButton.onclick = () => {
                excluirItem(menuId, subcolecaoId, itemId, itemDiv, modal);
            };
        }
    }else if (tipo === 'editar'){
        const confirmButton = modal.querySelector('#confirm');
        if (confirmButton) {
            confirmButton.onclick = () => {
                editItem(menuId, subcolecaoId, itemId, itemDiv, modal);
            };
        }
    }
    const cancelButton = modal.querySelector('#cancel');
        if (cancelButton) {
            cancelButton.onclick = () => {
                modal.style.display = 'none';
                modal.remove();
            };
        }

        window.onclick = (e) => {
            if (e.target === modal && !modal.classList.contains('loading')) {
                modal.style.display = 'none';
                modal.remove();
            }
        };
}