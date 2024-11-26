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
    const addItem = `
        <form id="formItem" class="form-item" action="/crud_pedidos/add" method="POST">
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
                <input type="url" id="linkImagem" name="linkImagem" placeholder="URL da imagem">
            </div>
            <div class="options">
                <select name="menu-options" id="menu-options" class="dropdown" onchange="carregarSubcolecoes(event)" required>
                    <option value="" disabled selected>Selecione uma opção</option>
                    <option value="menu_principal">Menu Principal</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="sobremesa">Sobremesas</option>
                </select>
            </div>
            <div class="options">
                <select name="submenu-options" id="submenu-options" class="dropdown" required>
                    <option value="" disabled selected>Selecione uma opção</option>
                </select>
            </div>
            <div class="campo">
                <label for="nomeItem">Nome do item</label>
                <input type="text" id="nomeItem" name="nomeItem" placeholder="Digite o nome do item" required>
            </div>
            <div class="campo">
                <label for="precoItem">Preço do item</label>
                <input type="number" id="precoItem" name="precoItem" placeholder="Digite o preço" step="0.01" required>
            </div>

            <button type="button" onclick="addNovoItem()">Salvar</button>
        </form>
    `;
    return addItem;
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

    fetch(`/crud_pedidos/subcolecoes?menu=${valorSelecionado}`)
    .then(response => {
        if (!response.ok){
            throw new Error('Falha ao buscar dados do servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.subcolecoes) {
            data.subcolecoes.forEach(subcolecao => {
                const option = document.createElement('option');
                option.value = subcolecao.subcolecao;
                option.textContent = subcolecao.subcolecao;
                submenuSelect.appendChild(option);
            });
        }
    })
    .catch(error => {
        console.error('error ao carregar as subcoleções: ', error);
    });
}

//função para enviar os novos pedidos para o banco
async function addNovoItem(){
    try {
        const menuId = document.getElementById('menu-options').value;
        const subcolecaoId = document.getElementById('submenu-options').value;
        const nome = document.querySelector('input[name="nomeItem"]').value;
        const preco = document.querySelector('input[name="precoItem"]').value;
        let imagem = document.querySelector('input[name="imagemBase64"]').value;
        let imagemLink = document.querySelector('input[name="linkImagem"]').value;

        if(!imagem && imagemLink){
            imagem = imagemLink;
        }else if(!imagem && imagemLink){
            imagem = null;
        }

        if (!menuId || menuId === "") {
            alert("Por favor, selecione uma opção no menu.");
            return;
        }
    
        if (!subcolecaoId || subcolecaoId === "") {
            alert("Por favor, selecione uma subcoleção.");
            return; 
        }
    
        if (!nome || nome === "") {
            alert("O nome do item é obrigatório.");
            return;
        }
    
        if (!preco || preco === "") {
            alert("O preço do item é obrigatório.");
            return;
        }

        const response = await fetch('/crud_pedidos/add', {
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
                    imagem: imagem,
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