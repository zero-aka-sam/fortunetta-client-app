import Web3 from "web3";

export async function getUserAddress(_id) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://ropsten.infura.io/v3/cfa16a251a12472c875781773eedf03f"
    )
  );
  const from = 0;
  const to = "latest";
  const address = "0x6E4ad295b8c73c3015EaFeac64140CC0E86Fafec";

  const logs = await web3.eth.getPastLogs({
    fromBlock: 0,
    toBlock: "latest",
    address: address,
    topics: [
      "0xc005b057c2aad4d08e9554183001b5d6d1b5014dae6f52622d409cf1483628b5",
    ],
  });
  const details = new Array();

  for (let log of logs) {
    //console.log(log.data);
    if (log.data !== undefined) {
      const data = web3.eth.abi.decodeParameters(
        [
          {
            name: "userID",
            type: "uint32",
          },
          {
            name: "choice",
            type: "uint256",
          },
          {
            name: "_amount",
            type: "uint256",
          },
        ],
        log.data
      );

      if (data[0] === _id.toString()) {
        details.push(log.transactionHash);
      }
    }
  }

  const transactionInfo = await web3.eth.getTransaction(details[0]);

  return transactionInfo.from;

  //console.log(logs);
}
