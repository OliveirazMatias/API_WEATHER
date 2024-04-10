// Importando os módulos necessários
const express = require('express'); // Framework web
const axios = require('axios'); // Cliente HTTP para fazer requisições
const path = require('path'); // Utilizado para lidar com caminhos de arquivos
const cors = require('cors'); // Middleware para permitir requisições de diferentes origens
const config = require('./config.json'); // Configurações da aplicação, como a chave da API
const apikey = config.apikey; // Chave da API

// Inicializando o aplicativo Express
const app = express();
app.listen(80); // Inicia o servidor na porta 80

// Usando middlewares
app.use(cors()); // Permite requisições de diferentes origens
app.use(express.json()); // Permite o uso de JSON nas requisições
app.use(express.static(path.join(__dirname, 'public'))); // Define o diretório 'public' como estático

// Função para tradução dos tipos de clima
function traducaoClima() {
    return {
        // Mapeamento dos tipos de clima para tradução
        "Thunderstorm": "Tempestade",
        // ... outros tipos de clima mapeados para tradução ...
        "Clouds": "Parcialmente nublado",
        "few clouds": "Parcialmente nublado",
        // ... outros tipos de clima mapeados para tradução ...
        "overcast clouds": "Nublado"
    }
}

// Rota para obter dados meteorológicos de uma cidade
app.get('/climatempo/:cidade', async (req, res) => {
    const city = req.params.cidade; // Obtém o nome da cidade da URL

    try {
        // Faz uma requisição para a API de clima com a cidade especificada
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);

        if (response.status === 200) {
            // Traduz o tipo de clima obtido da resposta da API
            const clima = traducaoClima()[response.data.weather[0].description] || response.data.weather[0].description;
            const iconUrl = `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`;

            // Monta o objeto com os dados meteorológicos
            const weatherData = {
                nome: response.data.name,
                pais: response.data.sys.country,
                temperatura: response.data.main.temp,
                umidade: response.data.main.humidity,
                velocidadeDoVento: response.data.wind.speed,
                clima: clima,
                iconUrl: iconUrl
            };

            console.log(response.data); // Registra os dados da resposta no console

            res.send(weatherData); // Envia os dados meteorológicos como resposta
        } else {
            res.status(response.status).send({ erro: 'Erro ao obter dados meteorológicos' }); // Responde com erro se a requisição falhar
        }
    } catch (error) {
        res.status(500).send({ erro: 'Erro ao obter dados meteorológicos', error }); // Responde com erro se ocorrer um erro interno
    }
})
