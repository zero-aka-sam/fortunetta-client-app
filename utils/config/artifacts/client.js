const client = {
  address: "0x6E4ad295b8c73c3015EaFeac64140CC0E86Fafec",
  abi: [
    {
      inputs: [
        {
          internalType: "contract IBSCV",
          name: "_token",
          type: "address",
        },
        {
          internalType: "contract IController",
          name: "_controller",
          type: "address",
        },
        {
          internalType: "uint32",
          name: "_countdown",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "_restTime",
          type: "uint256",
        },
        {
          internalType: "contract IBANK",
          name: "_bank",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint32",
          name: "userID",
          type: "uint32",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "choice",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "betPlaced",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
      ],
      name: "roundCreated",
      type: "event",
    },
    {
      inputs: [],
      name: "BSCV",
      outputs: [
        {
          internalType: "contract IBSCV",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "Bank",
      outputs: [
        {
          internalType: "contract IBANK",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "Controller",
      outputs: [
        {
          internalType: "contract IController",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "Countdown",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "Tax",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_userId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amounts",
          type: "uint256",
        },
      ],
      name: "addRewards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_userId",
          type: "uint32",
        },
      ],
      name: "approveUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_choice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "bet",
      outputs: [
        {
          internalType: "uint32",
          name: "_userID",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "result",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_userId",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "_choice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_betAmount",
          type: "uint256",
        },
      ],
      name: "betManager",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "collectRewards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "createRound",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "currentInfo",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "currentRound",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
      ],
      name: "getPendingRewards",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_roundId",
          type: "uint256",
        },
      ],
      name: "getRoundInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "roundId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "start",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "end",
          type: "uint256",
        },
        {
          internalType: "address[]",
          name: "bettingAddressesOnOne",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "bettingAmountsOnOne",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "bettingAddressesOnTwo",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "bettingAmountsOnTwo",
          type: "uint256[]",
        },
        {
          internalType: "address[]",
          name: "bettingAddressesOnThree",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "bettingAmountsOnThree",
          type: "uint256[]",
        },
        {
          internalType: "uint256",
          name: "winningChoice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "totalPrize",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_address",
          type: "address",
        },
      ],
      name: "getUserId",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_userId",
          type: "uint32",
        },
      ],
      name: "getUserInfo",
      outputs: [
        {
          internalType: "uint32",
          name: "UserID",
          type: "uint32",
        },
        {
          internalType: "uint32",
          name: "Level",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "PendingRewards",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "CollectedRewards",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "LockTill",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "BetCounts",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "Approve",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "restTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IBSCV",
          name: "_token",
          type: "address",
        },
      ],
      name: "setBSCV",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IBANK",
          name: "_bank",
          type: "address",
        },
      ],
      name: "setBank",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "contract IController",
          name: "_controller",
          type: "address",
        },
      ],
      name: "setController",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_countdown",
          type: "uint32",
        },
      ],
      name: "setCountdown",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_rest",
          type: "uint256",
        },
      ],
      name: "setRestTime",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_choice",
          type: "uint256",
        },
      ],
      name: "setWinningChoice",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "totalRounds",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalUsers",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint32",
          name: "_userId",
          type: "uint32",
        },
      ],
      name: "unapproveUser",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

export default client;
