// import { Client, Controller } from "../../config/constants/contracts";

// function currentRoundId() {
//   const id = Promise.resolve(Controller.methods.getCurrentRoundId().call());
//   return id;
// }

// async function currentInfo(_RoundID) {
//   return await Client.methods.getRoundInfo(_RoundID).call();
// }

// export const getPreviousRolls = async () => {
//   let prevRoll = [];
//   const currentId = await currentRoundId();
//   console.log(currentId);
//   let temp = Number(currentId) - 6;
//   for (let i = temp; temp < Number(currentId); temp++) {
//     const { winningChoice } = await currentInfo(temp);
//     prevRoll.push(winningChoice);
//   }
//   console.log(prevRoll);
//   return prevRoll;
// };

const { Controller, Client } = require("../../config/constants/contracts");

export async function getPreviousRolls() {
  const totalRounds = await Client.methods.totalRounds().call();
  const previousRolls = new Array();
  await Controller.methods
    .getCurrentRoundId()
    .call()
    .then(async (current) => {
      console.log(totalRounds);
      if (current > 6) {
      for (let i = 6; i >= 0; i--) {
      
          const round = await Client.methods.getRoundInfo(current - i).call();
          previousRolls.push(round.winningChoice);

      }}
    });
  return previousRolls;
}
