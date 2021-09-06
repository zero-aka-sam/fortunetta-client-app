import Web3 from "web3";
import controller from "./artifacts/controller.js";
import { Client } from "./artifacts/contracts.js";
let privateKey =
  "0ea9e2d55c083444976fcf1e878131c32c09789c2b713b1d5f14f8ecc843a9db";
let myAddress = "0x9F9bA619216F7B104fb309245eaefc388F642B16";

const provider = new Web3.providers.HttpProvider(
  "https://ropsten.infura.io/v3/c0367bfc1b5f47f5bba0427b5212038e"
);
const web3Ws = new Web3(provider);

const contract = new web3Ws.eth.Contract(controller.abi, controller.address);

export async function createRound() {
  try {
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
            if (!err) return +10;
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
  } catch (err) {
    console.log("Create Round err");
  }
  //const txn = ;
}

export async function finishRound() {
  try {
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
        return { data: res, gas: gas + 10 };
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
  } catch (err) {
    console.log("finishRound err:");
  }
}

const signAndSendTransaction = async (txnData, privateKey, provider) => {
  return await provider.eth.accounts
    .signTransaction(txnData, "0x".concat(privateKey))
    .then((res) => {
      return provider.eth.sendSignedTransaction(res.rawTransaction);
    });
};

export async function distributeDailyRewards() {
  Promise.resolve(contract.methods.distributeDailyReward().encodeABI())
    .then(async (data) => {
      const gas = await web3Ws.eth.estimateGas({
        from: myAddress,
        to: controller.address,
        data: data,
      });
      return { gas: gas, data: data };
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
    .then(async (tx) => await sendSignedTransaction(tx, privateKey, web3Ws))
    .then(console.log("dailyRewardsDistributed"));
}
