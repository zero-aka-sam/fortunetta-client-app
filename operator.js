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

  

  try{
    eth.on("block", (block, err) => {
      if(!err){
        try{
          const Round = Promise.resolve(Client.methods.currentRound().call()).then(async(res)=>{
            const countdown = res[2] - block
            if(countdown === 0){
              await 
                finishRound();
            }
            else{
              console.log(countdown);
              socket.emit("countdown", countdown);
              socket.emit("RoundID", res[0]);
            }});
        }catch(err){
            console.log("try Error:");
        }
      }if(err){
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
  }catch{console.log('Block event err:')}

  

  const Contract = new web3Ws.eth.Contract(client.abi, client.address);

  const events = Contract.events.allEvents();

  events.subscribe((err, res) => {
    if (res) {
      if (res.event === "betPlaced") {
        console.log("UserID:", res.returnValues[0]);
        console.log("Choice:", res.returnValues[1]);
        console.log("Amount:", res.returnValues[2]);
      }
      if (res.event === "roundCreated") {
        console.log("New Round:", res.returnValues[0]);
      }
    }
  });
};
