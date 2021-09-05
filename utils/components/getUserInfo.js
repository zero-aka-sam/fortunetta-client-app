import { address } from "../../config/artifacts/client";
import { Client } from "../../config/constants/contracts";

export async function getUserInfo(_address) {
  const userInfo = await Client.methods
    .getUserId(_address)
    .call()
    .then(async (id) => {
      return await Client.methods.getUserInfo(id).call();
    });
  return userInfo;
}

export async function getUserId(_address) {
  const userId = await Client.methods
    .getUserId(_address)
    .call()
    .then((id) => {
      return id;
    });
  return userId;
}
