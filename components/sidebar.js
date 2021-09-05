import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import styles from "../styles/sidebar.module.css";
import { getFreeBSCV } from "../utils/components/freeBSCV";

//IMPORTING COMPONENTS

import Button from "./button";
import Text from "./Text";
import ActiveLink from "./activeLink";
import Modal from "./modal";

const Sidebar = ({ setSidebar }) => {
  const user = useSelector((state) => state.user);
  const [connectModal, setConnectModal] = useState(false);
  const [userLists, setUserLists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFreeBscv = async () => {
    setIsLoading(true);
    await getFreeBSCV();
    setIsLoading(false);
  };

  const handleWithdraw = async () => {};

  const renderHeader = (
    <div className={styles.sidebarHeader}>
      <Button
        className="secondary_btn"
        onClick={
          user?.address
            ? () => setUserLists(!userLists)
            : () => setConnectModal(true)
        }
      >
        <Image src="/metamask.svg" width={20} height={20} />
        <Text variant="primary" fontSize="14px">
          {user?.address
            ? `${user?.address?.slice(0, 3)}...${user?.address?.slice(
                user?.address?.length - 3
              )}`
            : "Connect Wallet"}
        </Text>
      </Button>
      <span style={{ cursor: "pointer" }}>
        <Image
          src="/close.svg"
          width={24}
          height={24}
          onClick={() => setSidebar(false)}
        />
      </span>
    </div>
  );

  const renderLinks = (
    <div className={styles.sidebarLinks}>
      <ActiveLink activeClassName="active" href="/roulette">
        <a className="side-nav-link">
          <Image src="/roulette.svg" width={20} height={20} />
          <span>Roulette</span>
        </a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/match_betting">
        <a className="side-nav-link">
          <Image src="/matchBetting.svg" width={20} height={20} />
          <span>Match Betting</span>
        </a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/coin_flip">
        <a className="side-nav-link">
          <Image src="/coinFlip.svg" width={20} height={20} />
          <span>Coin Flip</span>
        </a>
      </ActiveLink>
      <Button
        className="primary_btn"
        onClick={() => handleFreeBscv()}
        style={{
          pointerEvents: isLoading ? "none" : null,
          opacity: isLoading ? "0.75" : "1",
        }}
      >
        Get Free BSCV
      </Button>
    </div>
  );

  const renderLists = (
    <div className={styles.sidebarLinks}>
      <div className={styles.flexRow}>
        <Text>User Id</Text>
        <Text variant="primary">{`#${user?.UserID}`}</Text>
      </div>
      <div className={styles.flexRow}>
        <Text>Bet counts</Text>
        <Text variant="primary">{user?.BetCounts}</Text>
      </div>
      <div className={styles.flexRow}>
        <Text>Rewards</Text>
        <Text variant="primary">{user?.CollectedRewards}</Text>
      </div>
      <div className={styles.flexRow}>
        <Text>Level</Text>
        <Text variant="primary">{user?.Level}</Text>
      </div>
      <div className={styles.flexRow}>
        <Text>LockTill</Text>
        <Text variant="primary">{user?.LockTill}</Text>
      </div>
      <div className={styles.flexRow}>
        <Text>Rewards pending</Text>
        <Text variant="primary">{user?.PendingRewards}</Text>
      </div>
      <div className={styles.flexRow}>
        <Text></Text>
        <Button className="secondary_btn" onClick={() => handleWithdraw()}>
          Withdraw
        </Button>
      </div>
      <div className={styles.flexRow}>
        <Text>Approved</Text>
        <Text>
          {user?.Approve ? (
            <Image src="/tick.svg" width={20} height={20} />
          ) : (
            <Image src="/close.svg" width={20} height={20} />
          )}
        </Text>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.sidebar}>
        {renderHeader}
        {userLists ? renderLists : renderLinks}
        {/* <ActiveLink activeClassName="active" href="/dailyRewards">
          <a className="secondary_gradient" style={{ width: "fit-content" }}>
            <Image src="/rewards.svg" width={20} height={20} />
            <span>Daily Rewards</span>
          </a>
        </ActiveLink> */}
      </div>
      <div className={styles.backdrop} onClick={() => setSidebar(false)}></div>
      {connectModal && <Modal variant="connect" setIsModal={setConnectModal} />}
    </>
  );
};

export default Sidebar;
