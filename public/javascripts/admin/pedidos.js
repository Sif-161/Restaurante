$(document).ready(function () {
    $.ajax({
        url: '/pedidos/load',
        method: 'GET',
        success: function (data) {
            const pedidosTable = $('#pedidos-table tbody');

            pedidosTable.empty();

            data.forEach(function (pedido) {
                const local = pedido.mesa !== undefined ? pedido.mesa : pedido.endereco;

                const itensComQuebra = pedido.itensNome.join('<br>');
                const qtdComQuebra = pedido.qtd.join('<br>');

                let statusClass = '';
                const statusPedido = pedido.status.trim().toLowerCase();
                switch (statusPedido) {
                    case 'novo pedido':
                        statusClass = 'status-novo';
                        break;
                    case 'em preparacao':
                        statusClass = 'status-em-preparacao';
                        break;
                    case 'pronto para servir':
                        statusClass = 'status-pronto removable';
                        break;
                    case 'pedido cancelado':
                        statusClass = 'status-cancelado removable';
                        break;
                    case 'aguardando entrega':
                        statusClass = 'status-aguardando removable';
                        break;
                    default:
                        statusClass = '';
                }

                pedidosTable.append(`
                    <tr class="pedido-row ${statusClass}" data-pedido-id="${pedido.id}">
                        <td>${pedido.nome}</td>
                        <td class="pedido-item">${itensComQuebra}</td>
                        <td class="pedido-qtd">${qtdComQuebra}</td>
                        <td>${local}</td>
                        <td>
                            <select class="status-select" data-pedido-id="${pedido.id}">
                                <option value="novo pedido" ${pedido.status === "novo pedido" ? "selected" : ""}>Novo pedido</option>
                                <option value="em preparacao" ${pedido.status === "em preparacao" ? "selected" : ""}>Em preparação</option>
                                <option value="pronto para servir" ${pedido.status === "pronto para servir" ? "selected" : ""}>Pronto para servir</option>
                                <option value="pedido cancelado" ${pedido.status === "pedido cancelado" ? "selected" : ""}>Pedido cancelado</option>
                                <option value="aguardando entrega" ${pedido.status === "aguardando entrega" ? "selected" : ""}>Aguardando entrega</option>
                            </select>
                        </td>
                    </tr>
                `);
            });
            
            $('.pedido-row.removable').hide();
            $('.status-select').on('change', function () {
                const pedidoId = $(this).data('pedido-id');
                const novoStatus = $(this).val();
                console.log('Novo status selecionado:', novoStatus);

                const tr = $(`tr[data-pedido-id="${pedidoId}"]`);

                let backgroundColor = '';
                let isRemovable = false;

                switch (novoStatus) {
                    case 'novo pedido':
                        backgroundColor = '#d1ecf1';
                        break;
                    case 'em preparacao':
                        backgroundColor = '#fff9c4';
                        break;
                    case 'pronto para servir':
                        backgroundColor = '#d4edda';
                        isRemovable = true;
                        break;
                    case 'pedido cancelado':
                        backgroundColor = '#f8d7da';
                        isRemovable = true;
                        break;
                    case 'aguardando entrega':
                        backgroundColor = '#e2e3e5';
                        isRemovable = true;
                        break;
                    default:
                        backgroundColor = '';
                }

                tr.css('background-color', backgroundColor);

                if (isRemovable) {
                    tr.addClass('removable');
                } else {
                    tr.removeClass('removable');
                }

                $.ajax({
                    url: `/pedidos/${pedidoId}/atualizar`,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify({ status: novoStatus }),
                    success: function (response) {
                        console.log('Status atualizado com sucesso:', response);

                        tr.find('.status-select').val(novoStatus);
                    },
                    error: function (error) {
                        console.error('Erro ao atualizar o status:', error);
                    }
                });
            });
        },
        error: function (error) {
            console.error('Erro ao carregar os pedidos', error);
        }
    });
});
