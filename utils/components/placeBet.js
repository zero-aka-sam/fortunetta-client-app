import detectEthereumProvider from "@metamask/detect-provider";
import { toUint256 } from "../../../.next/static/chunks/pages/roulette";
import client from "../../config/artifacts/client";
const web3 = new Web3(Promise.resolve(detectEthereumProvider()));

const contract = web3.eth.contract(client.abi, client.address);
async function placeBet(_choice, _amount) {
  const choice = web3.eth.encodeParameter("uint256", _choice);
  const amount = web3.eth.encodeParameter("uint256", _amount);

  await contract.methods
    .bet(choice, amount)
    .send({ from: window.ethereum.selectedAddress });
}
