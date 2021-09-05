import detectEthereumProvider from "@metamask/detect-provider"
import Web3 from "web3";
import bscv from "../../config/artifacts/bscv";

async function getWeb3(){
    const provider = await detectEthereumProvider();
    return provider;
}
export async function getBSCV(){
 const provider = await detectEthereumProvider();
 const web3 = new Web3(provider);
 return new web3.eth.Contract(bscv.abi,bscv.address)
}

export const web3 = new Web3(getWeb3) ;