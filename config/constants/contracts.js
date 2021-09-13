const Web3 = require("web3");

const client = require("../artifacts/client.js");
const controller = require("../artifacts/controller.js");
const bscv = require("../artifacts/bscv.js");
const { httpUrl } = require("../artifacts/RPCURL.js");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    httpUrl
  )
);

const Client = new web3.eth.Contract(client.abi, client.address);
const Controller = new web3.eth.Contract(controller.abi, controller.address);
const BSCV = new web3.eth.Contract(bscv.abi, bscv.address);
module.exports = { BSCV, Client, Controller };
