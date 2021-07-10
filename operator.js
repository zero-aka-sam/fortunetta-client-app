import Web3 from "web3";
import { Client } from "./artifacts/contracts.js";
import { finishRound } from "./Roundutils.js";
import { ethers } from "ethers";
import client from "./artifacts/client.js";

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

  const Contract = new web3Ws.eth.Contract(client.abi, client.address);

  const events = Contract.events.allEvents();

  events.subscribe((err, res) => {
    if (res) {
      if (res.event === "betPlaced") {
        console.log("UserID:", res.returnValues[0]);
        console.log("Choice:", res.returnValues[1]);
        console.log("Amount:", res.returnValues[2]);
        let placeBetDetails = {
          userId: res.returnValues[0],
          choice: res.returnValues[1],
          amount: res.returnValues[2],
        };

        socket.emit("betPlaced", placeBetDetails);
      }
      if (res.event === "roundCreated") {
        console.log("New Round:", res.returnValues[0]);
      }
    }
  });
};
