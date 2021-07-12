import Web3 from "web3";
import { Client,Controller } from "./artifacts/contracts.js";
import { createRound, finishRound,distributeDailyRewards } from "./Roundutils.js";
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

  const currentStatus = Promise.resolve(eth.getBlockNumber()).then(async (res)=>{
  try{
    await Client.methods.currentRound().call().then(async(round)=>{
      if(round[2]< res){
        await finishRound()
      }    });
    
  }
  catch(err){
    await createRound();
  }
  })

  

  try{
    eth.on("block", (block, err) => {
      if(!err){
        try{
          Promise.resolve(Client.methods.currentRound().call()).then(async(res)=>{
            const countdown = res[2] - block
            if(countdown === 0){
              await 
                finishRound();
            }
            else{
              console.log(countdown);
              socket.emit("countdown", countdown);
              socket.emit("RoundID", res[0]);
            }}).then(async()=>{const rewardBLock = await Controller.methods.nextdailyRewardAt().call()
            return rewardBLock}).then(async(dailyRewardBlock)=>{
              if(dailyRewardBlock === block){
                await distributeDailyRewards()
              }
              else{
                console.log("nextRewardAt:",dailyRewardBlock)
              }
            });
        }catch(err){
            console.log("try Error:",err);
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
