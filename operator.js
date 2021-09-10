import Web3 from "web3";
import { Client, Controller } from "./artifacts/contracts.js";
import {
  createRound,
  finishRound,
  distributeDailyRewards,
} from "./Roundutils.js";
import { ethers } from "ethers";
import client from "./artifacts/client.js";
import controller from "./artifacts/controller.js";
//import { getUserAddress } from "./utils/getAddress.js";
import { wssUrl } from "./artifacts/RPCURL.js";

export const operator = (socket) => {
  const web3Ws = new Web3(
    new Web3.providers.WebsocketProvider(
      wssUrl
    )
  );

  const eth = new ethers.providers.WebSocketProvider(
    wssUrl
  );

  const currentStatus = Promise.resolve(eth.getBlockNumber()).then(
    async (res) => {
      try {
        await Client.methods
          .currentRound()
          .call()
          .then(async (round) => {
            if (round[2] < res) {
              await finishRound();
            }
          });
      } catch (err) {
        await createRound();
      }
    }
  );

  try {
    eth.on("block", (block, err) => {
      if (!err) {
        try {
          Promise.resolve(Client.methods.currentRound().call())
            .then(async (res) => {
              socket.emit("currenBlock", block);
              const countdown = res[2] - block;
              if (countdown === 0) {
                await finishRound();
              } else {
                console.log(countdown);
                socket.emit("countdown", countdown);
              }
            })
            .then(async () => {
              const rewardBLock = await Controller.methods
                .nextdailyRewardAt()
                .call();
              return rewardBLock;
            })
            .then(async (dailyRewardBlock) => {
              if (dailyRewardBlock === block) {
                await distributeDailyRewards();
              } else {
                // console.log("nextRewardAt:",dailyRewardBlock)
                socket.emit("nextReward", dailyRewardBlock);
              }
            });
        } catch (err) {
          console.log("try Error:", err);
        }
      }
      if (err) {
        console.log("Block err::");
      }
      // try {
      //   if(block){
      //   const Round = await Client.methods.currentRound().call();}
      //   catch (err) {
      //     console.log("round not created");
      //   }
      //   const countdown = Round[2] - block;

      //   if (countdown === 0) {
      //     await finishRound();
      //   } else {
      //     console.log(countdown);
      //     socket.emit("countdown", countdown);
      //     console.log("RoundID:", Round[0]);
      //     socket.emit("RoundID", Round[0]);
      //   }
      // }else{

      // }
    });
  } catch {
    console.log("Block event err:");
  }

  const Contract = new web3Ws.eth.Contract(client.abi, client.address);

  const events = Contract.events.allEvents();

  events.subscribe(async (err, res) => {
    let placeBetDetails = new Object();
    if (res) {
      if (res.event === "betPlaced") {
        const userAddress = await Contract.methods.getUserAddress(res.returnValues[0]).call();
        console.log("UserID:", userAddress);
        console.log("Choice:", res.returnValues[1]);
        console.log("Amount:", res.returnValues[2]);
        (placeBetDetails.userId = String(userAddress)),
          (placeBetDetails.choice = res.returnValues[1]),
          (placeBetDetails.amount = res.returnValues[2]),
          socket.emit("betPlaced", placeBetDetails);
      }
      if (res.event === "roundCreated") {
        console.log("New Round:", res.returnValues[0]);s
      }
    }
  });

  events.unsubscribe();

  const Contract2 = new web3Ws.eth.Contract(controller.abi, controller.address);

  const events2 = Contract2.events.allEvents();

  events2.subscribe(async (err, res) => {
    if (res.event === "finishedRound") {
      socket.emit("winningChoice", res.returnValues[1]);
    }
  });

  events2.unsubscribe();
};
