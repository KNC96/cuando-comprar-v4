const express = require("express");
const router = express.Router();
const axios = require("axios");
const tulind = require("tulind");
const activos = ["BTCBUSD", "ETHBUSD", "LTCBUSD", "BNBBUSD","SANDBUSD"];
const cryptomonedas = [
  {simbolo: 'BTCUSDT', cripto:'Bitcoin'},
  {simbolo:'ETHUSDT', cripto:'Ethereum'},
  {simbolo:'LTCUSDT', cripto:'Litecoin'},
  {simbolo:'BNBUSDT', cripto:'BNB'},
  {simbolo:'SANDUSDT', cripto:'Sandbox'},
];

let rsi_precio = [];
let datosFinancieros = {};

// Aqui ejecutamos la funcion principal
let CalculoFinanciero = () => {
  cryptomonedas.map(async function (elemento) {
    let namecripto = elemento.cripto;
    let symbol = elemento.simbolo;
    await axios({
      method: "GET",
      url: `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=120`,
    }).then((res) => {
      let lista = [];
      for (let i in res.data) {
        let datos = res.data[i];
        let close = parseFloat(datos[4]).toFixed(2);
        lista.push(close);
      }
      datosFinancieros["price"] = lista[119];
      datosFinancieros["crypto"] = namecripto;
      datosFinancieros["simbolo"] = symbol;
      console.log(datosFinancieros);
      tulind.indicators.rsi.indicator([lista], [14], (err, exit) => {
        let ultimo_rsi = parseFloat(exit[0][105]).toFixed(2);
        datosFinancieros["RSI"] = ultimo_rsi;
        if (ultimo_rsi <= 20) {
          console.log("oportunidad de compra");
          datosFinancieros["conclusion"] = "comprar";
          console.log(ultimo_rsi);
        } else {
          console.log("No es momento de comprar");
          datosFinancieros["conclusion"] = "no comprar";
          console.log(ultimo_rsi);
        }
        rsi_precio.push(datosFinancieros);
        datosFinancieros = {};
      });
    });
  });
  return rsi_precio;
};



router.get("/", (req, res) => {
  try {
    const respuestaCalculo = CalculoFinanciero();
    res.json(respuestaCalculo);
    rsi_precio = [];
  } catch (error) {
    res.status(500).json({ error: "Error en el cálculo financiero" });
  }
});

module.exports = router;