import Web3 from "web3";

import client from "./client.js";
import controller from "./controller.js";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://ropsten.infura.io/v3/c0367bfc1b5f47f5bba0427b5212038e"
  )
);

export const Client = new web3.eth.Contract(client.abi, client.address);

export const Controller = new web3.eth.Contract(
  controller.abi,
  controller.address
);
