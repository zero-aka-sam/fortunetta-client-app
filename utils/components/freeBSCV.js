import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { Bank } from "../../config/artifacts/bank";

export const getFreeBSCV = async () => {
  const provider = await detectEthereumProvider();
  const web3 = new Web3(provider);
  const balance = web3.utils.toWei(String(1000), "ether").toString();
  const currentBank = new web3.eth.Contract(Bank.abi, Bank.address);
  //console.log()
  return await currentBank.methods
    .withdraw(window?.ethereum?.selectedAddress, balance)
    .send({ from: window?.ethereum?.selectedAddress });
};
