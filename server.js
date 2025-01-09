<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página com Atualizações em Tempo Real</title>
</head>
<body>
    <h1>Mensagem do Servidor:</h1>
    <div id="message"></div>

    <h2>Adicionar Cliente</h2>
    <form id="client-form">
        <label for="name">Nome:</label>
        <input type="text" id="name" name="name" placeholder="Digite o nome do cliente" required>
        <br><br>
        <label for="date">Data:</label>
        <input type="date" id="date" name="date" required>
        <br><br>
        <button type="submit">Adicionar Cliente</button>
    </form>

    <h2>Lista de Clientes</h2>
    <ul id="client-list"></ul>

    <script>
        const socket = new WebSocket('ws://localhost:8080'); // Conectar ao servidor WebSocket

        // Quando a conexão WebSocket for aberta
        socket.onopen = function() {
            console.log('Conexão WebSocket aberta!');
        };

        // Quando receber uma mensagem do servidor
        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);

            if (data.type === 'initialClients') {
                updateClientList(data.clients);
            }

            if (data.type === 'updateClients') {
                updateClientList(data.clients);
            }
        };

        // Atualiza a lista de clientes na página
        function updateClientList(clients) {
            const clientList = document.getElementById('client-list');
            clientList.innerHTML = ''; // Limpa a lista antes de adicionar os novos dados

            // Adiciona cada cliente na lista
            clients.forEach(client => {
                const li = document.createElement('li');
                li.innerHTML = `${client.name} - ${client.date} <button onclick="removeClient('${client.name}')">Excluir</button>`;
                clientList.appendChild(li);
            });
        }

        // Função para enviar o formulário com os dados do cliente
        document.getElementById('client-form').addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o comportamento padrão de envio do formulário

            // Pega os valores dos campos de entrada
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;

            // Envia os dados para o servidor WebSocket
            const message = { type: 'addClient', name: name, date: date };
            socket.send(JSON.stringify(message));

            // Limpa o formulário
            document.getElementById('name').value = '';
            document.getElementById('date').value = '';
        });

        // Função para remover um cliente da lista
        function removeClient(name) {
            const message = { type: 'removeClient', name: name };
            socket.send(JSON.stringify(message));
        }
    </script>
</body>
</html>
