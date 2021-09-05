import * as actionType from "../types";

const user = (state, action) => {
  switch (action.type) {
    case actionType.CONNECT:
      return {
        ...state,
        address: action.payload.walletAddress,
        balance: action.payload.balance,
      };
    case actionType.UPDATE_STATUS:
      return {
        ...state,
        Approve: action.payload.Approve,
        BetCounts: action.payload.BetCounts,
        CollectedRewards: action.payload.CollectedRewards,
        Level: action.payload.Level,
        LockTill: action.payload.LockTill,
        PendingRewards: action.payload.PendingRewards,
        UserID: action.payload.UserID,
      };
    case actionType.UPDATE_BSCV_BALANCE:
      return {
        ...state,
        bscvBalance: action?.payload?.bscvBalance,
      };
    case actionType.LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return { ...state };
  }
};

export default user;
