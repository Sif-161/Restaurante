function abrirSidebar() {
    document.getElementById("sidebar").style.right = "0";
    document.getElementById("fechar-sidebar-btn").style.right = "480.1px";
    document.querySelector("#fechar-sidebar-btn i").className = "bi bi-chevron-right";

    listaPedidos();
}

function fecharSidebar() {
    document.getElementById("sidebar").style.right = "-480px";
    document.getElementById("fechar-sidebar-btn").style.right = "-1px";
    document.querySelector("#fechar-sidebar-btn i").className = "bi bi-chevron-left";
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.right == "0px") {
        fecharSidebar();
    } else {
        abrirSidebar();
    }
}

function itemsSelecionados(itemId) {
    const precoElemento = document.getElementById(`preco-${itemId}`);
    const nomeElemento = document.getElementById(`nome-${itemId}`);

    let pedidoPreco = parseFloat(precoElemento.innerText.replace("R$", "").replace(",", ".").trim());
    let pedidoNome = nomeElemento.innerText.trim();

    const cardapioItem = {
        id: itemId,
        nome: pedidoNome,
        preco: pedidoPreco,
        quantidade: 1
    };
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    const pedidoExiste = pedidos.find(item => item.id === itemId);

    if (!pedidoExiste) {
        pedidos.push(cardapioItem);
    } else {
        pedidoExiste.quantidade += 1;
    }
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    console.log('Lista de pedidos: ', pedidos);

    listaPedidos();
    pedidosTotal();
}

function listaPedidos() {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    const pedidosConatiner = document.querySelector('.pedidos');

    pedidosConatiner.innerHTML = '';

    const pedidosImagens = {
        'item1': '/images/Rodizio-Chopp.png'
    };

    if (pedidos.length === 0) {
        document.getElementById("sidebar").style.right = "-480px";
        document.getElementById("fechar-sidebar-btn").style.right = "-50px";
        document.querySelector("#fechar-sidebar-btn i").className = "bi bi-chevron-left";
        return;
    }
    document.getElementById("sidebar").style.right = "0";
    document.getElementById("fechar-sidebar-btn").style.right = "480.1px";
    document.querySelector("#fechar-sidebar-btn i").className = "bi bi-chevron-right";


    pedidos.forEach((pedido, index) => {
        const pedidosElemento = document.createElement('article');
        pedidosElemento.classList.add('pedidos-item');
        pedidosElemento.innerHTML = `
        <div class="img-nome-quantidade-wrapper">
            <div class="pedido-img">
                <picture>
                    <img src="${pedidosImagens[pedido.id]}" alt="${pedido.nome}" id="img-pedido">
                </picture>
            </div>
            <div class="pedidos-nome">
                <p id="nome">${pedido.nome}</p>
            </div>
            <div class="quantidade">
                <button class= "btn-qtn diminuir" onclick="mudarQtn(${index}, '-')">-</button>
                <input type="text" id="pedidoQtn" maxlength="3" value="${pedido.quantidade}">
                <button class= "btn-qtn aumentar" onclick="mudarQtn(${index}, '+')">+</button>
            </div>
        </div>
        <div class="preco-remover-wrapper">
            <div class="pedido-preco">
                <span id="preco">R$${pedido.preco.toLocaleString('pt-br', {minimumFractionDigits: 2})}</span>
            </div>
            <div class="excluir-btn">
                <button id="remover" title="Excluir" aria-label="Excluir" onclick="removerPedido(${index})"><i class="bi bi-trash-fill"></i></button>
            </div>
        </div>
    `;
        pedidosConatiner.appendChild(pedidosElemento);
    });
    console.log(pedidos.length)
}

function removerPedido(index){
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.splice(index, 1);
    localStorage.setItem('pedidos' , JSON.stringify(pedidos));

    pedidosTotal();
    listaPedidos();
}

function mudarQtn(index, operador){
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    if(operador === '+') {
        pedidos[index].quantidade++;
    }else if(operador === '-' && pedidos[index].quantidade > 1){
        pedidos[index].quantidade--;
    }
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    pedidosTotal();
    listaPedidos();
}

function pedidosTotal(){
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    let total = 0;

    pedidos.forEach(pedido => {
        total += pedido.preco * pedido.quantidade;
    });

    document.getElementById('valor-total').innerText = `R$${total.toLocaleString('pt-br', {minimumFractionDigits:2})}`;
}

document.addEventListener('DOMContentLoaded', () => {
    pedidosTotal();
    listaPedidos();
});