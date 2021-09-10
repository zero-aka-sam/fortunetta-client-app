import Web3 from "web3";

import client from "./client.js";
import controller from "./controller.js";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/cfa16a251a12472c875781773eedf03f"
  )
);

export const Client = new web3.eth.Contract(client.abi, client.address);

export const Controller = new web3.eth.Contract(
  controller.abi,
  controller.address
);
