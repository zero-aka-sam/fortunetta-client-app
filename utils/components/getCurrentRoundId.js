const { Client, Controller } = require("../../config/constants/contracts");

function currentRoundId() {
  const id = Promise.resolve(Controller.methods.getCurrentRoundId().call());
  return id;
}

async function currentInfo(_RoundID) {
  return await Client.methods.getRoundInfo(_RoundID).call();
}

const round = Promise.resolve(currentRoundId())
  .then((res) => currentInfo(res))
  .then((res) => {
    return res;
  });

module.exports = { round };

//const RoundInfo = currentInfo(RoundId);

//RoundInfo);
