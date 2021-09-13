import Web3 from "web3";
import controller from "./artifacts/controller.js";
import { httpUrl } from "./artifacts/RPCURL.js";

let privateKey =
  "b1aa49b10abb39d55af1912335a7e1a0968e946b9fad34a70d8bfe2f5c24954c";
let myAddress = "0x6f2b3Ccd825F8182505E209AcE7b4576369E54AB";

const provider = new Web3.providers.HttpProvider(httpUrl);

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
      .then((tx) => {
        if (tx !== 0) {
          console.log("roundCreated");
        }
      });
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
      .then((tx) => {
        if (tx !== 0) {
          console.log("roundFinished");
        }
      })
      .then(async () => {
        await createRound();
      });
  } catch (err) {
    console.log("finishRound err:");
  }
}

// const States = {
//   Processing: "1",
//   NonProcessing: "0",
// };

// let status = States.NonProcessing;

const signAndSendTransaction = async (txnData, privateKey, provider) => {
  await provider.eth.accounts
    .signTransaction(txnData, "0x".concat(privateKey))
    .then(async (res) => {
      await provider.eth.sendSignedTransaction(res.rawTransaction);
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
    .then(async (tx) => await signAndSendTransaction(tx, privateKey, web3Ws))
    .then(console.log("dailyRewardsDistributed"));
}
