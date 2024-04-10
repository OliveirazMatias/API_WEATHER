// URL da API para obter dados meteorológicos
const apiUrl = "http://127.0.0.1:80/climatempo/";

// Função para criar um efeito de fade-out em um elemento HTML
function fade(element, callback) {
    let op = 1;
    let timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none'; // Oculta o elemento quando a opacidade atinge um nível baixo
            if (typeof callback === 'function') {
                callback();
            }
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")"; // Configura a opacidade do elemento
        op -= op * 0.1; // Reduz a opacidade gradualmente
    }, 50); // Intervalo de atualização do fade-out
}

// Função para atualizar o texto de um elemento HTML
function updateElementText(elementId, text, text2) {
    const element = document.getElementById(elementId); // Obtém o elemento pelo ID
    if (element) {
        element.innerText = text + text2; // Define o texto do elemento
    }
}

// Função para atualizar a imagem de um elemento HTML
function updateElementImg(elementId, src) {
    const element = document.getElementById(elementId); // Obtém o elemento pelo ID
    if (element) {
        element.src = src; // Define o URL da imagem no elemento
    }
}

// Função para exibir os dados meteorológicos em elementos HTML
function displayData(data) {
    if (!data) return; // Retorna se não houver dados

    const temperatura = data.temperatura.toFixed(0); // Arredonda a temperatura

    console.log(data); // Exibe os dados no console
    const imgUrl = `https://flagsapi.com/${data.pais}/flat/64.png`; // URL da bandeira do país
    updateElementText("temperatura", temperatura, "ºC"); // Atualiza o elemento de temperatura
    updateElementText("umidade", data.umidade, "%"); // Atualiza o elemento de umidade
    updateElementText("veloVento", data.velocidadeDoVento, "km/h"); // Atualiza o elemento de velocidade do vento
    updateElementText("clima", data.clima, ""); // Atualiza o elemento de descrição do clima
    updateElementText("nome", data.nome, ""); // Atualiza o elemento de nome da cidade
    updateElementImg("iconClima", data.iconUrl); // Atualiza o elemento da imagem do clima
    updateElementImg("iconPais", imgUrl); // Atualiza o elemento da bandeira do país
    updateBackground("background", data.clima); // Atualiza o background com base no clima
}

// Função para lidar com erros e exibir uma mensagem de erro temporária
function handleError(errorMsg) {
    const toast = document.createElement("div"); // Cria um elemento de mensagem
    const icon = document.createElement("i"); // Cria um ícone para a mensagem
    icon.className = "bx bxs-shield-x"; // Define a classe do ícone
    toast.classList.add("toast"); // Adiciona classes ao elemento de mensagem
    toast.innerText = errorMsg; // Define o texto da mensagem
    toast.appendChild(icon); // Adiciona o ícone à mensagem
    document.body.appendChild(toast); // Adiciona a mensagem ao corpo do documento

    setTimeout(() => {
        fade(toast, function() {
            toast.remove(); // Remove a mensagem após um intervalo de tempo
        });
    }, 3000); // Tempo de exibição da mensagem (3 segundos)
}

// Função assíncrona para obter dados meteorológicos da API
async function getData(cidade) {
    const url = apiUrl + cidade; // URL completa para a requisição
    try {
        const response = await fetch(url); // Faz a requisição assíncrona à API
        if (!response.ok) {
            throw new Error('Erro ao se conectar!'); // Lança um erro se a resposta não for OK
        }
        return await response.json(); // Retorna os dados em formato JSON
    } catch (error) {
        handleError("Cidade não encontrada!"); // Chama a função de tratamento de erro
        return null; // Retorna nulo em caso de erro
    }
}

// Função para atualizar o horário na página
function setHorario() {
    let date = new Date(); // Obtém a data atual
    let minute = ("0" + date.getMinutes()).slice(-2); // Formata os minutos
    let hour = ("0" + date.getHours()).slice(-2); // Formata as horas
    let horario = `${hour}:${minute}`; // Cria o formato de hora:minuto
    updateElementText("horario", horario, ""); // Atualiza o elemento de horário
}

// Evento que é disparado quando a janela é carregada
window.addEventListener("load", async () => {
    setHorario(); // Atualiza o horário ao carregar a página
    setInterval(setHorario, 1000); // Atualiza o horário a cada segundo
    const informacoes = await getData("marília"); // Obtém os dados meteorológicos para a cidade inicial
    displayData(informacoes); // Exibe os dados meteorológicos na página
});

// Elemento de entrada de texto para pesquisa
const pesquisarCampo = document.getElementById("pesquisar");

// Evento que é disparado ao pressionar uma tecla no campo de pesquisa
pesquisarCampo.addEventListener("keyup", async (e) => {
    if (e.key === 'Enter') { // Verifica se a tecla pressionada foi Enter
        const informacoes = await getData(pesquisarCampo.value.toLowerCase()); // Obtém os dados para a cidade digitada
        displayData(informacoes); // Exibe os dados na página
        pesquisaCampo.value = ''; // Limpa o campo de pesquisa após a pesquisa
    }
});

// Função para atualizar o background com base no clima
function updateBackground(background, clima) {
    const background1 = document.getElementById(background); // Obtém o elemento de background

    // Define a imagem de background com base no tipo de clima
    if (clima == "Chuva" || clima == "Garoa") {
        background1.src = "images/chuva-20995920-131120200056.gif"; // Imagem de chuva
    } else if (clima == "Neve") {
        background1.src = "images/neve.gif"; // Imagem de neve
    } else if (clima == "Névoa") {
        background1.src = "images/nevoa.jpg"; // Imagem de névoa
    } else if (clima == "Céu limpo") {
        background1.src = "images/ceu.jpg"; // Imagem de céu limpo
    } else if (clima == "Parcialmente nublado") {
        background1.src = "images/nublado.gif"; // Imagem de parcialmente nublado
    } else if (clima == "Tempestade") {
        background1.src = "images/tempestade.gif"; // Imagem de tempestade
    } else if (clima == "Nublado") {
        background1.src = "images/nubladoR.gif"; // Imagem de nublado
    } else {
        background1.src = "https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg"; // Imagem padrão
    }
}
