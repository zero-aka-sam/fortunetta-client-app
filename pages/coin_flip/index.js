import React from "react";
import Text from "../../components/Text";
import Layout from "../../components/layout";

const CoinFlip = () => {
  const renderScreen = (
    <div className="grid_center">
      <Text variant="primary" fontSize="2em">
        {" "}
        Coming soon...
      </Text>
    </div>
  );
  return (
    <>
      {" "}
      <Layout>{renderScreen}</Layout>
    </>
  );
};

export default CoinFlip;
