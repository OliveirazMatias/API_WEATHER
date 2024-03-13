const express = require ('express');
const axios = require ('axios');
const path = require ('path');
const cors = require ('cors');
const config = require ('./config.json');
const apikey = config.apikey;

const app = express();
app.listen(80);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function traducaoClima() {
    return {
        "Thunderstorm": "Tempestade",
        "thunderstorm with light rain": "Tempestade",
        "thunderstorm with rain": "Tempestade",
        "thunderstorm with heavy rain": "Tempestade",
        "light thunderstorm": "Tempestade",
        "thunderstorm": "Tempestade",
        "heavy thunderstorm": "Tempestade",
        "ragged thunderstorm": "Tempestade",
        "thunderstorm with light drizzle": "Tempestade",
        "thunderstorm with drizzle": "Tempestade",
        "thunderstorm with heavy drizzle": "Tempestade",
        
        "Drizzle": "Garoa",
        "light intensity drizzle": "Garoa",
        "drizzle": "Garoa",
        "heavy intensity drizzle": "Garoa",
        "light intensity drizzle rain": "Chuva",
        "drizzle rain": "Chuva",
        "heavy intensity drizzle rain": "Chuva",
        "shower rain and drizzle": "Chuva",
        "heavy shower rain and drizzle": "Chuva",
        "shower drizzle": "Garoa",
      
        "Rain": "Chuva",
        "light rain": "Chuva",
        "moderate rain": "Chuva",
        "heavy intensity rain": "Chuva",
        "very heavy rain": "Chuva",
        "extreme rain": "Chuva",
        "freezing rain": "Chuva",
        "light intensity shower rain": "Chuva",
        "shower rain": "Chuva",
        "heavy intensity shower rain": "Chuva",
        "ragged shower rain": "Chuva",
      
        "Snow": "Neve",
        "light snow": "Neve",
        "snow": "Neve",
        "heavy snow": "Neve",
        "sleet": "Chuva",
        "light shower sleet": "Chuva",
        "shower sleet": "Chuva",
        "light rain and snow": "Neve",
        "rain and snow": "Neve",
        "light shower snow": "Neve",
        "shower snow": "Neve",
        "heavy shower snow": "Neve",
      
        "Atmosphere": "Névoa",
        "mist": "Névoa",
        "smoke": "Névoa",
        "haze": "Névoa",
        "sand/dust whirls": "Névoa",
        "fog": "Névoa",
        "sand": "Névoa",
        "dust": "Névoa",
        "volcanic ash": "Névoa",
        "squalls": "Névoa",
        "tornado": "Névoa",

        "Clear": "Céu limpo",
        "clear sky": "Céu limpo",
      
        "Clouds": "Parcialmente nublado",
        "few clouds": "Parcialmente nublado",
        "scattered clouds": "Parcialmente nublado",
        "broken clouds": "Parcialmente nublado",
        "overcast clouds": "Nublado"
    }
}

app.get('/climatempo/:cidade', async (req, res) => {
    const city = req.params.cidade;

    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);
            
        if(response.status === 200){
                const clima = traducaoClima()[response.data.weather[0].description] || response.data.weather[0].description;
                const iconUrl = `http://openweathermap.org/img/w/${response.data.weather[0].icon}.png`;
                
                const weatherData = {
                    nome: response.data.name,
                    pais: response.data.sys.country,
                    temperatura: response.data.main.temp,
                    umidade: response.data.main.humidity,
                    velocidadeDoVento: response.data.wind.speed,
                    clima: clima,
                    iconUrl: iconUrl
                };

                console.log(response.data);

                res.send(weatherData);
            } else{
                res.status(response.status).send({erro: 'Erro ao obter dados meteorologicos'});
            }
    } catch (error){
        res.status(500).send({erro: 'Erro ao obter dados meteorologicos', error });
    }
})
