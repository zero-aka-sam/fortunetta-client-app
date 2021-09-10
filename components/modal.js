import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";

import styles from "../styles/Modal.module.css";

import Button from "./button";
import Text from "./Text";

import { getBalanceOfUser } from "./header";
import { getUserInfo } from "../utils/components/getUserInfo";
import { getFreeBSCV } from "../utils/components/freeBSCV";
import client from "../config/artifacts/client";
import { getBSCV } from "../utils/components/getWeb3";

const Modal = ({
  variant,
  isModal,
  setIsModal,
  setSuccessModal,
  setProcessModal,
  setErrorModal,
  chainId,
  winningChoice,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then(async (value) => {
          // setAccount(value[0])
          const newbal = await getBalanceOfUser();
          const payload = {
            walletAddress: value[0],
            balance: newbal,
          };
          dispatch({
            type: "CONNECT",
            payload,
          });
          return value[0];
        })
        .then(async (address) => {
          try {
            const {
              Approve,
              BetCounts,
              CollectedRewards,
              Level,
              LockTill,
              PendingRewards,
              UserID,
            } = await getUserInfo(address);
            dispatch({
              type: "UPDATE_STATUS",
              payload: {
                Approve,
                BetCounts,
                CollectedRewards,
                Level,
                LockTill,
                PendingRewards,
                UserID,
              },
            });
          } catch (err) {
            console.log("user not registered");
          }
        })
        .then(() => {
          getBSCV()
            .then(async (BSCV) => {
              return await BSCV.methods
                .balanceOf(window.ethereum.selectedAddress)
                .call();
            })
            .then((res) => {
              const Balance = String(res);
              return String(Web3.utils.fromWei(Balance));
            })
            .then((res) => {
              dispatch({
                type: "UPDATE_BSCV_BALANCE",
                payload: {
                  bscvBalance: res,
                },
              });
            })
            .catch((err) => console.log(err));
        });
    }
  };

  const handleApproveToken = async () => {
    setIsModal(false);
    setProcessModal(true);
    await getBSCV()
      .then((BSCV) => {
        BSCV.methods
          .approve(client.address, Web3.utils.toWei(user?.bscvBalance))
          .send({ from: user?.address })
          .then((res) => {
            console.log(res);
            setProcessModal(false);
            setSuccessModal(true);
            setTimeout(() => {
              setSuccessModal(false);
            }, 3000);
          });
      })
      .catch((err) => {
        setProcessModal(false);
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 3000);
      });
  };

  const handleBuyToken = async () => {
    setIsModal(false);
    setProcessModal(true);
    await getFreeBSCV(50)
      .then((res) => {
        console.log(res);
        setProcessModal(false);
        setSuccessModal(true);
        setTimeout(() => {
          setSuccessModal(false);
        }, 3000);
      })
      .catch((err) => {
        setProcessModal(false);
        setErrorModal(true);
        setTimeout(() => {
          setErrorModal(false);
        }, 3000);
      });
  };

  const renderApproveModal = (
    <div className={styles.modal}>
      <div className={styles.flexRow} style={{ marginBottom: "1em" }}>
        <Text variant="primary" fontSize="18px">
          Approve your token
        </Text>
        <div style={{ cursor: "pointer" }} onClick={() => setIsModal(false)}>
          <Image alt="" src="/close.svg" width={22} height={22} />
        </div>
      </div>
      <div className={styles.modalBtn}>
        <Button className="secondary_btn" onClick={() => handleApproveToken()}>
          Approve Token
        </Button>
        <Button className="primary_btn" onClick={() => handleBuyToken()}>
          Buy Token
        </Button>
      </div>
    </div>
  );

  const renderSuccessModal = (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <Image
          className={styles.modalImg}
          src="/paymentComplete.svg"
          alt="headImg"
          width={26}
          height={26}
        />
        <Text variant="primary" fontSize="18px">
          Payment Complete
        </Text>
      </div>
      <div className={styles.modalBody} style={{ margin: "1em 0" }}>
        <Text variant="secondary" fontSize="12px">
          Congratulations, your betting for 2X Roulette is complete. You can
          continue with your roll now.
        </Text>
      </div>
      <div className={styles.modalFooter}>
        <Image
          className={styles.modalImg}
          src="/tick.svg"
          alt="footImg1"
          width={20}
          height={20}
        />
        <Text fontSize="12px">Secure paymet by Metamask</Text>
      </div>
    </div>
  );

  const renderProcessingModal = (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <Image
          className={styles.modalImg}
          src="/paymentProcessing.svg"
          alt="headImg"
          width={26}
          height={26}
        />
        <Text variant="primary" fontSize="18px">
          Payment Processing
        </Text>
      </div>
      <div className={styles.modalBody} style={{ margin: "1em 0" }}>
        <Text variant="secondary" fontSize="12px">
          Your payment is processing. It usually takes few seconds to complete
          the payment. Please be patient if its taking a bit longer than we
          expected.
        </Text>
      </div>
      <div className={styles.modalFooter}>
        <Image src="/loader.gif" alt="footImg1" width={20} height={20} />
        <Text fontSize="12px">Authenticating your payment</Text>
      </div>
    </div>
  );

  const renderErrorModal = (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <Image
          className={styles.modalImg}
          src="/paymentIncomplete.svg"
          alt="headImg"
          width={26}
          height={26}
        />
        <Text variant="primary" fontSize="18px">
          Payment Incomplete
        </Text>
      </div>
      <div className={styles.modalBody} style={{ margin: "1em 0" }}>
        <Text variant="secondary" fontSize="12px">
          We’re sorry, your payment couldnot take place. It might be due to some
          technical error. Please retry now or try again sometime later.
        </Text>
      </div>
      <div className={styles.modalFooter}>
        <Image src="/error.svg" alt="footImg1" width={20} height={20} />
        <Text fontSize="12px" style={{ color: "#f65151" }}>
          Error code #1233
        </Text>
      </div>
      {/* {error && (
      <Text className={styles.retry_btn}>
        <img
          src={refresh}
          alt="refresh"
          style={{ width: 20, marginRight: 8 }}
        />
        <Text>Retry</Text>
      </Text>
    )} */}
    </div>
  );

  const renderConnectModal = (
    <div className={isModal ? styles.modalActive : styles.modalInActive}>
      <div className={styles.flexRow} style={{ marginBottom: "0.75em" }}>
        <Text variant="primary" fontSize="18px">
          Connect Wallet
        </Text>
        <div style={{ cursor: "pointer" }}>
          <Image
            alt=""
            src="/closeOutline.svg"
            width={20}
            height={20}
            onClick={() => setIsModal(false)}
          />
        </div>
      </div>
      <Text variant="secondary" fontSize="12px">
        Connect to your prefered crypto wallet to continue with us.
      </Text>
      <div style={{ margin: "1em 0" }}>
        <Button
          className="metamask_btn"
          style={{ width: "100%" }}
          onClick={() => handleConnect()}
        >
          {isConnecting ? (
            <Image alt="" src="/loader.gif" width={22} height={22} />
          ) : (
            <Image alt="" src="/metamask.svg" width={22} height={22} />
          )}
          <Text component="span" variant="primary">
            Metamask Wallet
          </Text>
        </Button>
      </div>
      <Text>
        By continuing you agree to our{" "}
        <Text component="span" variant="primary" fontSize="12px">
          Terms of Service
        </Text>{" "}
        &{" "}
        <Text component="span" variant="primary" fontSize="12px">
          Privacy Policy
        </Text>
      </Text>
    </div>
  );

  const renderInvalidBet = (
    <div className={styles.modal}>
      <div className={styles.flexRow} style={{ marginBottom: "0.75em" }}>
        <Text></Text>
        <span style={{ cursor: "pointer" }}>
          <Image
            alt=""
            src="/closeOutline.svg"
            width={20}
            height={20}
            onClick={() => setIsModal(false)}
          />
        </span>
      </div>
      <Text variant="primary">
        You have already placed a bet for this round
      </Text>
    </div>
  );

  const renderWrongNetwork = (
    <div className={styles.modal}>
      <div className={styles.flexRow}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image alt="" src="/wrongNetwork.svg" width={26} height={26} />
          <Text variant="primary" fontSize="18px" style={{ marginLeft: 8 }}>
            Wrong Network
          </Text>
        </div>
        <div style={{ cursor: "pointer" }}>
          {/* <Image  alt="" 
            src="/closeOutline.svg"
            width={20}
            height={20}
            onClick={() => setIsModal(false)}
          /> */}
        </div>
      </div>
      <div style={{ margin: "1em 0" }}>
        <Text>
          Oops! It seems like you are currently in a wrong network. To continue
          change your network to Mainnet
        </Text>
      </div>
      <div>
        <div
          className={chainId === "0x38" ? styles.networkTrue : styles.network}
        >
          <Text>Binance Smart chain</Text>
          {chainId === "0x38" && (
            <Image alt="" src="/checkwhite.svg" width={20} height={20} />
          )}
        </div>
        <div
          className={chainId === "0x1" ? styles.networkTrue : styles.network}
        >
          <Text>Etherium Mainnet</Text>
          {chainId === "0x1" && (
            <Image alt="" src="/checkwhite.svg" width={20} height={20} />
          )}
        </div>
        <div
          className={chainId === "0x3" ? styles.networkTrue : styles.network}
        >
          <Text>Ropsten Network</Text>
          {chainId === "0x3" && (
            <Image alt="" src="/checkwhite.svg" width={20} height={20} />
          )}
        </div>
        <div
          className={chainId === "0x5" ? styles.networkTrue : styles.network}
        >
          <Text>Goreli Test Network</Text>
          {chainId === "0x5" && (
            <Image alt="" src="/checkwhite.svg" width={20} height={20} />
          )}
        </div>
        <div
          className={chainId === "0x61" ? styles.networkTrue : styles.network}
        >
          <Text>Binance Test Network</Text>
          {chainId === "0x61" && (
            <Image alt="" src="/checkwhite.svg" width={20} height={20} />
          )}
        </div>
      </div>
    </div>
  );

  const renderWinningChoice = (
    <div className={isModal ? styles.modalActive : styles.modalInActive}>
      <div className={styles.flexCenter}>
        <Image
          alt=""
          src={`/animation${winningChoice}.svg`}
          width={200}
          height={200}
        />
      </div>
    </div>
  );

  switch (variant) {
    case "approve":
      return (
        <>
          {renderApproveModal}
          <div className={styles.backdrop}></div>
        </>
      );
    case "connect":
      return (
        <>
          {renderConnectModal}
          <div
            className={
              isModal ? styles.backdropActive : styles.backdropInActive
            }
          ></div>
        </>
      );
    case "success":
      return (
        <>
          {renderSuccessModal}
          <div className={styles.backdrop}></div>
        </>
      );
    case "processing":
      return (
        <>
          {renderProcessingModal}
          <div className={styles.backdrop}></div>
        </>
      );
    case "error":
      return (
        <>
          {renderErrorModal}
          <div className={styles.backdrop}></div>
        </>
      );
    case "invalidBet":
      return (
        <>
          {renderInvalidBet}
          <div className={styles.backdrop}></div>
        </>
      );
    case "wrongNetwork":
      return (
        <>
          {renderWrongNetwork}
          <div className={styles.backdrop}></div>
        </>
      );
    case "winningChoice":
      return (
        <>
          {renderWinningChoice}
          <div
            className={
              isModal ? styles.backdropActive : styles.backdropInActive
            }
          ></div>
        </>
      );
    default:
      return null;
  }
};

export default Modal;
