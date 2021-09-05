import axios from "axios";
import * as actionType from "../types";

export const signin = (data) => async (dispatch) => {
  try {
    console.log("entered");
    const result = await axios.post("http://localhost:5000/user/signin", data);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
