//importing react library npm packages
import React from "react";

//importing third party npm packages
import { Initializer } from "../pages/utils";

const Component = (props) => {
  // #INTIALIZATION

  // ##Hooks
  const [dataKey, setDataKey] = React.useState();
  const greetInputRef = React.useRef();

  // ###Extractions
  const { drizzle } = props;
  const { Greeter } = props.drizzleState.contracts;

  const methods = ["get_custom_greeting", "get_greeting_1", "get_greeting_2"];
  const contracts = drizzle.contracts;

  React.useEffect(() => {
    if (!dataKey) {
      const contract = contracts.Greeter;
      Initializer.methods(contract, methods).then((key) => {
        setDataKey(key);
      });
    }
  }, []);

  const updateGreeting = async (e, greeting, contract) => {
    e.preventDefault();
    console.log(greeting);
    const stackId = await contract.methods.set_custom_greeting.cacheSend(
      greeting
    );
    console.log(stackId);
  };

  return (
    <div>
      <form>
        <h3>Set greeting form</h3>
        <fieldset>
          <label>Greeting:</label>
          <br />
          <input ref={greetInputRef} placeholder="Welcome all!" />
        </fieldset>
        <button
          onClick={(e) =>
            updateGreeting(e, greetInputRef.current.value, contracts.Greeter)
          }
        >
          Update greeting
        </button>
      </form>
      <p>Hi from Truffle! Here is your storedData: {dataKey}</p>
      <p>{Greeter.get_greeting_1[dataKey]?.value}</p>
      <p>{Greeter.get_greeting_2[dataKey]?.value}</p>
      <p>{Greeter.get_custom_greeting[dataKey]?.value}</p>
    </div>
  );
};

export default Component;
