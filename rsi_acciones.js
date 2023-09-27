const express = require("express");
const axios = require("axios");
const router = express.Router();


const empresas = [
  { simbolo: "TSLA", empresa: "Tesla" },
  { simbolo: "MSFT", empresa: "Microsoft Corporation " },
  { simbolo: "AAPL", empresa: "Apple Inc" },
  { simbolo: "AMZN", empresa: "Amazon.com Inc" },
  { simbolo: "GOOGL", empresa: "Alphabet Inc" },
];

const api_key_una = 'rpFt4dYKbHfVOgBKXM8VeaUzEWB3fVPW';
const api_key_dos = 'mqjJMGUQtREsmGM_8gwxBi8rgz0vlVtj';
let rsi_empresa = [];
let datosFinancieros = {};

let descargar_datos_rsi = () => {
  empresas.map(async(empresa) => {
    let name = empresa.empresa;
    let business = empresa.simbolo;
    await axios({
      method: "GET",
      url: `https://api.polygon.io/v1/indicators/rsi/${business}?timespan=day&adjusted=true&window=14&series_type=close&order=desc&apiKey=${api_key_dos}`,
    }).then((res) => {
      datosFinancieros["simbolo"] = business;
      datosFinancieros["empresa"] = name;
      // Convierte la cadena JSON en un objeto JavaScript
      let datos = JSON.parse(JSON.stringify(res.data));
      console.log(business);
      console.log(name);
      let rsi = datos.results.values[0];
      console.log(rsi);
      console.log(parseFloat(rsi.value.toFixed(2)));
      datosFinancieros["RSI"] = (parseFloat(rsi.value.toFixed(2)));
      let ultimo_rsi = (parseFloat(rsi.value.toFixed(2)));
      if (ultimo_rsi <= 30) {
          console.log("oportunidad de compra");
          datosFinancieros["conclusion"] = "oportunidad de compra";
        }
        else{
          console.log("No es momento de comprar");
          datosFinancieros["conclusion"] = "No es momento de comprar";
        }
      rsi_empresa.push(datosFinancieros);
      datosFinancieros = {};
    });
  });
  return rsi_empresa;
};


router.get("/", (req, res) => {
  try {
    const respuestaCalculo = descargar_datos_rsi();
    res.json(respuestaCalculo);
    rsi_empresa = [];
  } catch (error) {
    res.status(500).json({ error: "Error en el cálculo financiero" });
  }
});

module.exports = router;