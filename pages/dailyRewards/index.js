import React from "react";
import Image from "next/image";

import styles from "../../styles/DailyRewards.module.css";

import Layout from "../../components/layout";
import Text from "../../components/Text";
import Button from "../../components/button";
import Chat from "../../components/chat/chat";

const RewardsCard = ({ day, image, earned, btn_text }) => {
  return (
    <div className={styles.rewardsCard}>
      <Text fontSize="12px">{day}</Text>
      <div className={styles.slot}>
        <div>
          <Image src={image} width={"100%"} height={"auto"} />
        </div>
        <Text fontSize="12px">{earned}</Text>
      </div>
      <Button className="rewards_btn" style={{ width: "100%" }}>
        {btn_text}
      </Button>
    </div>
  );
};

const DailyRewards = () => {
  const renderHeader = (
    <div className={styles.rewardsHeader}>
      <div>
        <Text variant="primary" fontSize="20px" style={{ marginBottom: "1em" }}>
          Daily Rewards
        </Text>
        <Text variant="secondary">
          Here are your daily rewards! Claim your’s today or comeback tomorrow
          for a better one.
        </Text>
      </div>
      <div className={styles.flexEnd}>
        <Text variant="secondary" style={{ marginBottom: "1em" }}>
          Your Next Chest Opens In
        </Text>
        <Text variant="primary" fontSize="18px">
          01 Day : 19 Hrs : 42 Mins : 09 Secs
        </Text>
      </div>
    </div>
  );

  const renderChest = (
    <div className={styles.chestBlock}>
      <RewardsCard
        day="Day 1"
        btn_text="claimed"
        image="/day1.svg"
        earned="Earned 500 Coins"
      />
      <RewardsCard
        day="Day 2"
        btn_text="claimed"
        image="/day2.svg"
        earned="Earned 500 Coins"
      />
      <RewardsCard
        day="Day 3"
        btn_text="claimed"
        image="/day3.svg"
        earned="Earned 500 Coins"
      />
      <RewardsCard
        day="Day 4"
        btn_text="claimed"
        image="/day4.svg"
        earned="Earned 500 Coins"
      />
      <RewardsCard
        day="Day 5"
        btn_text="claimed"
        image="/day5.svg"
        earned="Earned 500 Coins"
      />
      <RewardsCard
        day="Day 6"
        btn_text="claimed"
        image="/day6.svg"
        earned="Earned 500 Coins"
      />
      <RewardsCard
        day="Day 7"
        btn_text="claimed"
        image="/day7.svg"
        earned="Earned 500 Coins"
      />
    </div>
  );

  const renderScreen = (
    <div className="chatLayoutWrapper">
      <div className={styles.rewards}>
        {renderHeader}
        {renderChest}
      </div>
      <Chat />
    </div>
  );
  return (
    <>
      <Layout>{renderScreen}</Layout>
    </>
  );
};

export default DailyRewards;
