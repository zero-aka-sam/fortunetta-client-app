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

let currentChoice;

export const operator = (socket) => {
  const web3Ws = new Web3(new Web3.providers.WebsocketProvider(wssUrl));

  const eth = new ethers.providers.WebSocketProvider(wssUrl);

  const currentStatus = Promise.resolve(eth.getBlockNumber()).then(
    async (res) => {
      try {
        await Client.methods
          .currentRound()
          .call()
          .catch(async (err) => {
            await createRound();
          })
          .then(async (round) => {
            if (round !== undefined) {
              if (round[2] < res) {
                await finishRound();
              }
            }
          });
      } catch (err) {}
    }
  );

  eth.on("block", async (block, err) => {
    if (!err) {
      try {
        // Promise.resolve(Client.methods.currentRound().call())
        //   .catch((err) => {
        //     "Round Not Created";
        //   })
        const currentRound = await Client.methods
          .currentRound()
          .call()
          .catch(async (err) => {
            console.log("Round Not Created");
            await createRound();
          });
        console.log(currentRound);
        if (currentRound !== undefined) {
          //CurrentBlock
          socket.emit("currenBlock", block);
          const countdown = currentRound[2] - block;
          if (countdown <= 0) {
            socket.emit("countdown", countdown);
            await finishRound();
          } else {
            console.log(countdown);
            socket.emit("countdown", countdown);
          }

          const rewardBLock = await Controller.methods
            .nextdailyRewardAt()
            .call();

          if (rewardBLock === block) {
            await distributeDailyRewards();
          } else {
            // console.log("nextRewardAt:",dailyRewardBlock)
            socket.emit("nextReward", rewardBLock);
          }
        }
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

  const Contract = new web3Ws.eth.Contract(client.abi, client.address);

  const events = Contract.events.allEvents();

  events.subscribe(async (err, res) => {
    let placeBetDetails = {
      userId: String,
      choice: Number,
      amount: Number,
    };
    if (res) {
      if (res.event === "betPlaced") {
        const userAddress = await Contract.methods
          .getUserAddress(res.returnValues[0])
          .call();
        console.log("UserID:", userAddress);
        console.log("Choice:", res.returnValues[1]);
        console.log("Amount:", res.returnValues[2]);
        placeBetDetails.userId = String(userAddress);
        placeBetDetails.choice = res.returnValues[1];
        placeBetDetails.amount = res.returnValues[2];
        socket.emit("betPlaced", placeBetDetails);
      }
      if (res.event === "roundCreated") {
        console.log("New Round:", res.returnValues[0]);
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
