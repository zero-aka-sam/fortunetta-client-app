import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useDispatch, useSelector } from "react-redux";

//STYLESHEET

import styles from "../styles/Header.module.css";

//IMPORTING COMPONENTS

import Button from "../components/button";
import Text from "../components/Text";
import Sidebar from "./sidebar";
import UserModal from "./userModal";
import Modal from "./modal";
import ActiveLink from "./activeLink";

import { getFreeBSCV } from "../utils/components/freeBSCV";

export const getBalanceOfUser = async () => {
  let address = window.ethereum.selectedAddress;
  let address1 = Web3.utils.toChecksumAddress(address);
  const provider = await detectEthereumProvider();

  const web3 = new Web3(provider);
  const balance1 = await web3.eth.getBalance(address1);
  const balance2 = web3.utils.fromWei(balance1, "ether");
  return balance2;
};

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [processModal, setProcessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const user = useSelector((state) => state.user);

  const handleFreeBscv = async () => {
    setProcessModal(true);
    try {
      await getFreeBSCV();
      setProcessModal(false);
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setProcessModal(false);
      setErrorModal(true);
      setTimeout(() => {
        setErrorModal(false);
      }, 3000);
    }
  };

  const renderNavigationMenu = (
    <ul className={styles.navigationMenu}>
      <li>
        <ActiveLink activeClassName="active" href="/roulette">
          <a className="nav-link">
            <Image alt="" src="/roulette.svg" width={20} height={20} />
            <span>Roulette</span>
          </a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName="active" href="/match_betting">
          <a className="nav-link">
            <Image alt="" src="/matchBetting.svg" width={20} height={20} />
            <span>Match Betting</span>
          </a>
        </ActiveLink>
      </li>
      <li>
        <ActiveLink activeClassName="active" href="/coin_flip">
          <a className="nav-link">
            <Image alt="" src="/coinFlip.svg" width={20} height={20} />
            <span>Coin Flip</span>
          </a>
        </ActiveLink>
      </li>
    </ul>
  );

  const renderToolBar = (
    <div className={styles.toolbar}>{/* <p>Notifications</p> */}</div>
  );

  const renderControls = (
    <div className={styles.controls}>
      <Button
        className="primary_btn"
        onClick={() => handleFreeBscv()}
        style={{
          pointerEvents: processModal ? "none" : null,
          opacity: processModal ? "0.75" : "1",
        }}
      >
        Get Free BSCV
      </Button>
      {/* <ActiveLink activeClassName="active" href="/dailyRewards">
        <a className="secondary_gradient">
          <Image alt="" src="/rewards.svg" width={20} height={20} />
          <span>Daily Rewards</span>
        </a>
      </ActiveLink> */}
      <Button
        className="secondary_btn"
        onClick={
          user?.address ? () => setIsModal(true) : () => setConnectModal(true)
        }
      >
        <Image alt="" src="/metamask.svg" width={20} height={20} />
        <Text variant="primary" fontSize="14px">
          {user?.address
            ? `${user?.address?.slice(0, 3)}...${user?.address?.slice(
                user?.address?.length - 3
              )}`
            : "Connect Wallet"}
        </Text>
      </Button>
    </div>
  );

  const renderMenu = (
    <>
      <span className={styles.hamburger} onClick={() => setSidebar(true)}>
        <Image alt="" src="/menu.svg" width={24} height={24} />
      </span>
    </>
  );

  const renderHeader = (
    <div className={styles.header}>
      <div className={styles.flexRow}>
        <div>
          <Image alt="" src="/logolabel.png" width={291} height={54} />
        </div>
        {renderNavigationMenu}
      </div>
      <div className={styles.flexRow}>
        {renderToolBar}
        {renderControls}
        {renderMenu}
      </div>
    </div>
  );
  return (
    <>
      {renderHeader}
      {sidebar && <Sidebar sidebar={sidebar} setSidebar={setSidebar} />}
      {isModal && <UserModal isModal={isModal} setIsModal={setIsModal} />}
      <Modal
        variant="connect"
        isModal={connectModal}
        setIsModal={setConnectModal}
      />
      {processModal && <Modal variant="processing" />}
      {successModal && <Modal variant="success" />}
      {errorModal && <Modal variant="error" />}
    </>
  );
};

export default Header;
