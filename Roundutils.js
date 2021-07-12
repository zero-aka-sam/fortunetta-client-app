import Web3 from "web3";
import controller from "./artifacts/controller.js";
import { Client } from "./artifacts/contracts.js";
let privateKey =
  "bf688ab0dd2c7c941d430abdc38b7748cf78f659c66b023e66298fe8096b5273";
let myAddress = "0x37fBA930Ce4C4D75Ae902b9222046783c5660bda";

const provider = new Web3.providers.HttpProvider(
  "https://bsc.getblock.io/testnet/?api_key=d5db7538-e398-468a-a968-4068eff4312f"
);
const web3Ws = new Web3(provider);

const contract = new web3Ws.eth.Contract(controller.abi, controller.address);

export async function createRound() {
  const { data, gas } = Promise.resolve(
    contract.methods.createRound().encodeABI()
  )
    .then(async (res) => {
      const gas = await web3Ws.eth.estimateGas(
        {
          from: myAddress,
          to: controller.address,
          data: res,
        },
        (err, gas) => {
          if (!err) return gas;
          if (err) console.log("Gas Estimation err:", err);
        }
      );
      return { data: res, gas: gas };
    })
    .then(async (res) => {
      const gasPrice = await web3Ws.eth.getGasPrice((err, res) => {
        if (!err) return gas;
        if (err) console.log("GasPriceEstimaton err:");
      });
      return { data: res.data, gas: res.gas, gasPrice: gasPrice };
    })
    .then((res) => {
      const tx = {
        from: myAddress,
        to: controller.address,
        data: res.data,
        gas: res.gas,
        gasPrice: res.gasPrice,
      };
      return tx;
    })
    .then(async (tx) => await signAndSendTransaction(tx, privateKey, web3Ws))
    .then((tx) => console.log("roundCreated"));
  //const txn = ;
}

export async function finishRound() {
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  const choice = getRandomInt(1, 4);

  const encoded_choice = web3Ws.eth.abi.encodeParameter("uint256", choice);

  const end = Promise.resolve(
    contract.methods.finishRound(encoded_choice).encodeABI()
  )
    .then(async (res) => {
      const gas = await web3Ws.eth.estimateGas({
        from: myAddress,
        to: controller.address,
        data: res,
      });
      return { data: res, gas: gas };
    })

    .then((res) => {
      const tx = {
        from: myAddress,
        to: controller.address,
        data: res.data,
        gas: res.gas,
      };
      return tx;
    })
    .then(async (tx) => await signAndSendTransaction(tx, privateKey, web3Ws))
    .then(() => console.log("round finished"))
    .then(() => {
      createRound();
    });
}

const signAndSendTransaction = async (txnData, privateKey, provider) => {
  return await provider.eth.accounts
    .signTransaction(txnData, "0x".concat(privateKey))
    .then((res) => {
      return provider.eth.sendSignedTransaction(res.rawTransaction);
    });
};

export async function distributeDailyRewards(){
  Promise.resolve(contract.methods.distributeDailyReward().encodeABI()).then(async(data)=>{
    const gas = await web3Ws.eth.estimateGas({from: myAddress,to:controller.address,data: data});
    return { gas:gas,data: data}
  }).then((res)=>{
    const tx = {
      from: myAddress,
      to: controller.address,
      data: res.data,
      gas: res.gas
    }
    return tx
  }).then(async(tx)=>await sendSignedTransaction(tx,privateKey,web3Ws)).then(console.log("dailyRewardsDistributed"))
}
