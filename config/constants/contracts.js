const Web3 = require("web3");

const client = require("../artifacts/client.js");
const controller = require("../artifacts/controller.js");
const bscv = require("../artifacts/bscv.js");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/cfa16a251a12472c875781773eedf03f"
  )
);

const Client = new web3.eth.Contract(client.abi, client.address);
const Controller = new web3.eth.Contract(controller.abi, controller.address);
const BSCV = new web3.eth.Contract(bscv.abi, bscv.address);
module.exports = { BSCV, Client, Controller };
