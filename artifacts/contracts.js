import Web3 from "web3";

import client from "./client.js";
import controller from "./controller.js";
import { httpUrl } from "./RPCURL.js";

const web3 = new Web3(new Web3.providers.HttpProvider(httpUrl));

export const Client = new web3.eth.Contract(client.abi, client.address);

export const Controller = new web3.eth.Contract(
  controller.abi,
  controller.address
);
