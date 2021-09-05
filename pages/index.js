import React, { useEffect } from "react";
import { useRouter } from "next/router";

const App = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/roulette");
  }, []);

  return <div></div>;
};

export default App;
