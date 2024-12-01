function opcaoSelecionada(event){
    const valorSelecionado = event.target.value;
    const formContent = document.querySelector('#form-content');

    formContent.innerHTML = '';

    switch (valorSelecionado){
        case "1":
            formContent.innerHTML = gerarFormulario("mesa");
            break;
        case "2":
            formContent.innerHTML = gerarFormulario("endereco");
            break;
        default:
            formContent.innerHTML = '';
            break;
    }
}
    function gerarFormulario(tipo){
        const label = tipo === "mesa" ? "Mesa:" : "Endereço:";
        const placeholder = tipo === "mesa" ? "Digite o número da sua mesa" : "Digite o seu endereço"
        const nomeInput = `
            <div id="nome">
                <label for="nome">Nome:</label>
                <input type="text" name="nome" placeholder="Digite seu nome" class="input-content" autocomplete="off">
            </div>
        `;
        const campoAdicional = `
            <div id="${tipo}">
                <label for="${tipo}">${label}</label>
                <input type="text" placeholder="${placeholder}" class="input-content" name="${tipo}" autocomplete="off">
            </div>
        `;
        const button = `
            <div>
                <button type="button" id="pedido-btn" onclick="enviarPedido()">Fazer pedido</button>
            </div>
        `;
        return nomeInput + campoAdicional + button;
    }
   

async function enviarPedido(){
    try {
        const items = JSON.parse(localStorage.getItem('pedidos')) || [];
        const nome = document.querySelector('input[name="nome"]').value;
        const mesa = document.querySelector('input[name="mesa"]')?.value;
        const endereco = document.querySelector('input[name="endereco"]')?.value;

        if(!nome) throw new Error("O campo 'Nome' é obrigatorio.");

        const pedido = {
            nome,
            mesa: `mesa: ${mesa || undefined}`,
            endereco: endereco || undefined,
            itensNome: items.map(item => item.nome),
            status: 'novo pedido',
            qtd: items.map(item => item.quantidade)
        };

        const response = await fetch('/formulario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedido)
        });

        const data = await response.json();
        if(response.ok){
            console.log('Pedido enviado com sucesso:', data);
            alert('Pedido enviado com sucesso!');
            localStorage.removeItem('pedidos');
            window.location.href = '/';
        }else{
            throw new Error(data.message || "Erro ao enviar pedido.");
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        alert(`Erro ao enviar o pedido: ${error.message}`);
    }
}