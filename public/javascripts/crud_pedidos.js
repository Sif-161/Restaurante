function opcaoSelecionada(event){
    const valorSelecionado = event.target.value;
    const formContent = document.querySelector('#form-content');

    formContent.innerHTML = '';

    switch (valorSelecionado){
        case "1":
            formContent.innerHTML = gerarFormulario("adicionar");
            break;
        case "2":
            formContent.innerHTML = gerarFormulario("editar");
            break;
        case "3":
            formContent.innerHTML = gerarFormulario("excluir");
            break;
        default:
            formContent.innerHTML = '';
            break;
    }
}