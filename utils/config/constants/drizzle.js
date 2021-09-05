import { Controller, Client, BSCV } from "./contracts";

const contracts = [Controller, Client, BSCV];
const greeterEvents = ["updatedGreeting"];

const DrizzleOptions = {
  contracts: contracts,
  // events: {
  //   roundCreated,
  //   betPlaced,
  //   finishedRound,
  // },
};

export default DrizzleOptions;
