import Web3 from "web3";
import { Client } from "./artifacts/contracts.js";
import { finishRound } from "./Roundutils.js";
import { ethers } from "ethers";

export const operator = (socket) => {
  const web3Ws = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://bsc.getblock.io/testnet/?api_key=0399cb06-5a32-4e68-97a7-c0b9bb21e53c"
    )
  );

  const eth = new ethers.providers.WebSocketProvider(
    "wss://bsc.getblock.io/testnet/?api_key=0399cb06-5a32-4e68-97a7-c0b9bb21e53c"
  );

  const block = Promise.resolve(eth.getBlockNumber()).then(async (res) => {
    const Round = await Client.methods.currentRound().call();
    const countdown = Round[2] - res;
    if (countdown < 0) {
      console.log("calling finishRound");
      await finishRound();
    } else {
    }
  });

  eth.on("block", async (block, err) => {
    try {
      const Round = await Client.methods.currentRound().call();

      const countdown = Round[2] - block;

      if (countdown === 0) {
        await finishRound();
      } else {
        console.log(countdown);
        socket.emit("countdown", countdown);
        console.log("RoundID:", Round[0]);
        socket.emit("RoundID", Round[0]);
      }
    } catch (err) {}
  });
};
