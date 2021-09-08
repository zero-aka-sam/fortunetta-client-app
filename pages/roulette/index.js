import React, { useState, useEffect } from "react";
import web3 from "web3";
import Image from "next/image";
import Web3 from "web3";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { getBSCV } from "../../utils/components/getWeb3";
import CountUp from "react-countup";
//STYLESHEET

import styles from "../../styles/Roulette.module.css";

//IMPORTING COMPONENTS

import Chat from "../../components/chat/chat";
import Footer from "../../components/footer";
import { getBalanceOfUser } from "../../components/header";
import Layout from "../../components/layout";
import Text from "../../components/Text";
import Modal from "../../components/modal";
import Button from "../../components/button";

//IMPORTING UTILITY PACKAGES

import client from "../../utils/config/artifacts/client";
import { getUserInfo, getUserId } from "../../utils/components/getUserInfo";
import { round } from "../../utils/components/getCurrentRoundId";
import { getPreviousRolls } from "../../utils/components/getPreviousRolls";

let socket;

const countdownStartsFrom = 10;

const Roulette = ({ status }) => {
  //INITIALIZING HOOKS

  const amountInputRef = React.useRef();
  const [tab, setTab] = useState();
  const [amount, setAmount] = useState(0);
  const [choice, setChoice] = useState();

  const [countdown, setCountdown] = useState(0);
  const [currentBlock, setCurrentBlock] = useState();
  const [progressValue, setProgressValue] = useState(0);
  const [lockTill, setLockTill] = useState();

  const [betOnOne, setBetOnOne] = useState([]);
  const [betOnTwo, setBetOnTwo] = useState([]);
  const [betOnThree, setBetOnThree] = useState([]);

  const [approveModal, setApproveModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [processModal, setProcessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const [isNotConnected, setIsNotConnected] = useState(false);
  const [balanceError, setBalanceError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [isBet, setIsBet] = useState(true);
  const [types, setTypes] = useState(false);
  const [rollingEnd, setRollingEnd] = useState(false);
  const [installMetamask, setInstallMetamask] = useState(false);
  const [isPlacedBet, setIsPlacedBet] = useState(false);
  const [winningChoice, setWinningChoice] = useState();
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [chainId, setChaniId] = useState("");
  const [previousRolls, setPreviousRolls] = useState();
  const [totalUsers, setTotalUsers] = useState(0);

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  //HANDLING METHODS

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("chainChanged", (_chainId) =>
        window.location.reload()
      );
    }
  });

  useEffect(() => {
    // socket = io("http://18.116.115.108:5000", {
    //   transports: ["websocket"],
    // });
    socket = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    if (typeof window.ethereum !== "undefined") {
      setInstallMetamask(false);
      let chainID = window.ethereum.chainId;
      setChaniId(chainID);
      console.log(chainID);
      if (chainID === "0x3") {
        setWrongNetwork(false);
        handleConnect();
      } else {
        setWrongNetwork(true);
      }
    } else {
      setInstallMetamask(true);
    }
  }, []);

  useEffect(() => {
    socket.on("userdata", (count) => {
      setTotalUsers(count);
    });
  }, [totalUsers]);

  useEffect(() => {
    handleInitialRound();
    handlePreviousRolls();
  }, []);

  const handlePreviousRolls = async () => {
    const rolls = await getPreviousRolls();
    setPreviousRolls(rolls);
  };

  const handleInitialRound = async () => {
    const res = await round;
    Promise.all(
      res?.bettingAddressesOnOne?.map(async (address, i) => {
        res?.bettingAmountsOnOne?.map(async (amount, j) => {
          if (i === j) {
            // const userId = await getUserId(address);
            let bets = {
              userId: address,
              amount: web3.utils.fromWei(amount, "ether"),
            };
            setBetOnOne((betOnOne) => [...betOnOne, bets]);
          }
        });
      })
    );
    Promise.all(
      res?.bettingAddressesOnTwo?.map(async (address, i) => {
        res?.bettingAmountsOnTwo?.map(async (amount, j) => {
          if (i === j) {
            // const userId = await getUserId(address);
            let bets = {
              userId: address,
              amount: web3.utils.fromWei(amount, "ether"),
            };
            setBetOnTwo((betOnTwo) => [...betOnTwo, bets]);
          }
        });
      })
    );
    Promise.all(
      res?.bettingAddressesOnThree?.map(async (address, i) => {
        res?.bettingAmountsOnThree?.map(async (amount, j) => {
          if (i === j) {
            // const userId = await getUserId(address);
            let bets = {
              userId: address,
              amount: web3.utils.fromWei(amount, "ether"),
            };
            setBetOnThree((betOnThree) => [...betOnThree, bets]);
          }
        });
      })
    );
  };

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
                PendingRewards: web3.utils.fromWei(PendingRewards, "ether"),
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

  const handleUpdateBscv = async () => {
    const {
      Approve,
      BetCounts,
      CollectedRewards,
      Level,
      LockTill,
      PendingRewards,
      UserID,
    } = await getUserInfo(user?.address);
    dispatch({
      type: "UPDATE_STATUS",
      payload: {
        Approve,
        BetCounts,
        CollectedRewards,
        Level,
        LockTill,
        PendingRewards: web3.utils.fromWei(PendingRewards, "ether"),
        UserID,
      },
    });
  };

  useEffect(() => {
    socket.on("countdown", (result) => {
      if (result < 1) {
        setCountdown(0);
        setProgressValue(0);
        setIsPlacedBet(false);
        setBetOnOne([]);
        setBetOnTwo([]);
        setBetOnThree([]);
        setTab();
        setChoice();
      } else {
        setCountdown(result);
      }
      if (result > 0) setRollingEnd(false);
      else setRollingEnd(true);
      if (result > 3) setIsBet(false);
      else setIsBet(true);
      if (result === countdownStartsFrom) {
        setIsBet(false);
        handlePreviousRolls();
      }
    });
  }, [countdown]);

  useEffect(() => {
    if (countdown >= 0) {
      let val = ((countdownStartsFrom - countdown) / countdownStartsFrom) * 100;
      setProgressValue(val);
    }
  }, [countdown]);

  useEffect(() => {
    socket.on("currenBlock", (result) => {
      setCurrentBlock(result);
      if (user?.LockTill > result) {
        setLockTill(user?.LockTill - result);
      } else {
        setLockTill();
      }
    });
  }, [currentBlock]);

  useEffect(() => {
    socket.on("betPlaced", (result) => {
      console.log(result);
      const amtInEther = web3.utils.fromWei(result.amount, "ether");
      let newResult = {
        userId: result.userId,
        amount: amtInEther,
      };
      if (result.choice === "1") {
        setBetOnOne((betOnOne) => [...betOnOne, newResult]);
      }
      if (result.choice === "2") {
        setBetOnTwo((betOnTwo) => [...betOnTwo, newResult]);
      }
      if (result.choice === "3") {
        setBetOnThree((betOnThree) => [...betOnThree, newResult]);
      }
    });
  }, [betOnOne, betOnTwo, betOnThree]);

  useEffect(() => {
    if (amount > user?.bscvBalance) {
      setBalanceError(true);
      setApproveModal(true);
    } else {
      setBalanceError(false);
      setApproveModal(false);
    }
  }, [amount, setAmount]);

  useEffect(() => {
    socket.on("winningChoice", (result) => {
      console.log(result);
      setWinningChoice(result);
      setTimeout(() => {
        setWinningChoice();
      }, 3000);
    });
  }, []);

  const getFlooredFixed = (v, d) => {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  };

  async function checkBet(_choice) {
    if (user?.address) {
      setIsNotConnected(false);
      if (
        !betOnOne.some((val) => val?.userId === user?.UserId) &&
        !betOnTwo.some((val) => val?.userId === user?.UserId) &&
        !betOnThree.some((val) => val?.userId === user?.UserId)
      ) {
        setIsPlacedBet(false);
        if (_choice !== undefined) {
          setTypes(false);
          if (amount > 0) {
            setAmountError(false);
            const web3 = new Web3(window?.ethereum);
            const Client = new web3.eth.Contract(client.abi, client.address);

            const Amount = web3.utils.toWei(String(amount));

            try {
              const BSCV = await getBSCV();
              const BeforeBet = await BSCV.methods
                ._beforeBet(window.ethereum.selectedAddress, Amount)
                .call();
              console.log("bet", BeforeBet);
              if (BeforeBet === true) {
                setApproveModal(false);
                setProcessModal(true);
                const tx = await Client.methods
                  .bet(choice, Amount)
                  .send({ from: window.ethereum.selectedAddress })
                  .then((res) => {
                    console.log(res);
                    setProcessModal(false);
                    setSuccessModal(true);
                    setTimeout(() => {
                      setSuccessModal(false);
                    }, 3000);
                    handleUpdateBscv();
                  })
                  .catch((err) => {
                    console.log(err);
                    setProcessModal(false);
                    setErrorModal(true);
                    setTimeout(() => {
                      setErrorModal(false);
                    }, 3000);
                  });
                console.log(tx);
                console.log("BET placed");
              } else {
                setApproveModal(true);
              }
            } catch (err) {
              console.log(err);
              setErrorModal(true);
              setTimeout(() => {
                setErrorModal(false);
              }, 3000);
            }
          } else {
            setAmountError(true);
            setTimeout(() => {
              setAmountError(false);
            }, 5000);
          }
        } else {
          setTypes(true);
          setTimeout(() => {
            setTypes(false);
          }, 5000);
        }
      } else {
        setIsPlacedBet(true);
      }
    } else {
      setIsNotConnected(true);
    }
  }

  const renderWinningBetOne = (
    <>
      <Image src="/animation2.svg" width={"110px"} height={"113px"} alt="" />
      <Image src="/animation1.svg" width={"110px"} height={"113px"} alt="" />
      <Image src="/animation3.svg" width={"110px"} height={"113px"} alt="" />
    </>
  );

  const renderWinningBetTwo = (
    <>
      <Image src="/animation1.svg" width={"110px"} height={"113px"} alt="" />
      <Image src="/animation2.svg" width={"110px"} height={"113px"} alt="" />
      <Image src="/animation3.svg" width={"110px"} height={"113px"} alt="" />
    </>
  );

  const renderWinningBetThree = (
    <>
      <Image src="/animation1.svg" width={"110px"} height={"113px"} alt="" />
      <Image src="/animation3.svg" width={"110px"} height={"113px"} alt="" />
      <Image src="/animation2.svg" width={"110px"} height={"113px"} alt="" />
    </>
  );

  const renderRoulette = (
    <div className={styles.roulette}>
      <div className={styles.rouletteHeader} style={{ marginBottom: 20 }}>
        <div className={styles.flexRow}>
          <Image alt="sound" src="/sound.svg" width={20} height={20} />
          <Text
            component="span"
            variant="secondary"
            fontSize="12px"
            style={{ marginLeft: 8 }}
          >
            Turn sound on
          </Text>
        </div>
        <div className={styles.flexRow}>
          <Image alt="user" src="/user.svg" width={20} height={20} />
          <Text
            component="span"
            variant="secondary"
            fontSize="12px"
            style={{ marginLeft: 8 }}
          >
            {Math.floor(totalUsers / 2)} users online
          </Text>
        </div>
      </div>
      <div className={styles.rollSelectorContainer}>
        <div className={styles.rollSelector}>
          <Image alt="" src={"/rollselector.svg"} width={30} height={300} />
        </div>
      </div>
      <div className={styles.container}>
        <div
          className={
            winningChoice ? "photobanner roll-end" : "photobanner roll"
          }
        >
          {winningChoice === "1"
            ? renderWinningBetOne
            : winningChoice === "2"
            ? renderWinningBetTwo
            : winningChoice === "3"
            ? renderWinningBetThree
            : renderWinningBetTwo}
        </div>
      </div>
      <div className={styles.rouletteTimer} style={{ margin: "1em 0" }}>
        <Text variant="secondary">
          {rollingEnd ? "Rolling Finished :" : "Rolling starts in :"}
        </Text>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressValue}%` }}
          ></div>
        </div>
        <Text variant="primary">{countdown}</Text>
      </div>
      <center style={{ marginBottom: 20 }}>
        <Text variant="secondary">Previuos Rolls</Text>
      </center>
      <div className={styles.rouletteStatistics}>
        {previousRolls && (
          <>
            <Image
              src={`/animation${previousRolls[0]}.svg`}
              width={"110px"}
              height={"100%"}
              alt=""
            />
            <Image
              src={`/animation${previousRolls[1]}.svg`}
              width={"110px"}
              height={"100%"}
              alt=""
            />
            <Image
              src={`/animation${previousRolls[2]}.svg`}
              width={"110px"}
              height={"100%"}
              alt=""
            />
            <Image
              src={`/animation${previousRolls[3]}.svg`}
              width={"110px"}
              height={"100%"}
              alt=""
            />
            <Image
              src={`/animation${previousRolls[4]}.svg`}
              width={"110px"}
              height={"100%"}
              alt=""
            />
            <Image
              src={`/animation${previousRolls[5]}.svg`}
              width={"110px"}
              height={"100%"}
              alt=""
            />
          </>
        )}
      </div>
    </div>
  );

  const renderBetForm = (
    <section className={styles.betForm}>
      <Text component="div" variant="secondary" fontWeight="500">
        Bet amount
      </Text>
      {/* <div
        className={styles.betFormReturnControls}
        style={{ pointerEvents: isBet ? "none" : null }}
      >
        <Text
          variant="primary"
          fontSize="14px"
          onClick={() => {
            setTab(1);
            setChoice(1);
          }}
          style={{ border: tab === 1 && "1px solid #FDBB35" }}
        >
          2X
        </Text>
        <Text
          variant="primary"
          fontSize="14px"
          onClick={() => {
            setTab(2);
            setChoice(2);
          }}
          style={{ border: tab === 2 && "1px solid #FDBB35" }}
        >
          14X
        </Text>
        <Text
          variant="primary"
          fontSize="14px"
          onClick={() => {
            setTab(3);
            setChoice(3);
          }}
          style={{ border: tab === 3 && "1px solid #FDBB35" }}
        >
          2X
        </Text>
        {types && (
          <div className={styles.typeToaster}>select one of these type</div>
        )}
      </div> */}
      <div className={styles.input}>
        <Image alt="" src="/coins.svg" width={20} height={20} />
        <input
          ref={amountInputRef}
          type="number"
          min="0"
          placeholder={0.0}
          value={amount === 0 ? "" : amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {amountError && (
          <div className={styles.typeToaster}>Invalid amount</div>
        )}
      </div>
      <div className={styles.betFormStatistics}>
        <Text>
          Balance :{" "}
          {isNaN(user?.bscvBalance)
            ? "Nil"
            : getFlooredFixed(user?.bscvBalance, 2)}
        </Text>
        <Text
          style={{ color: "#F65151", cursor: "pointer" }}
          onClick={() => setAmount(0)}
        >
          Clear
        </Text>
      </div>
      <div className={styles.betFormReturnControls}>
        <Text onClick={() => setAmount(amount + 0.01)}>+0.01</Text>
        <Text onClick={() => setAmount(amount + 0.1)}>+0.1</Text>
        <Text onClick={() => setAmount(amount + 1)}>+1</Text>
        <Text onClick={() => setAmount(amount + 5)}>+5</Text>
        <Text onClick={() => setAmount(amount + 10)}>+10</Text>
      </div>
      <Text component="div" fontSize="12px">
        Your max profit can only be upto $50,000
      </Text>
      <aside className={styles.placebid_btn}>
        <Button
          className="primary_btn"
          onClick={() => checkBet(choice)}
          style={{
            pointerEvents: (isBet || lockTill) && "none",
            opacity: (isBet || lockTill) && "0.5",
          }}
        >
          {lockTill ? lockTill : "Bet"}
        </Button>
        {lockTill && (
          <span>
            you placed a bet recently please wait untill {lockTill} secs
          </span>
        )}
      </aside>
    </section>
  );

  const renderRoundOne = _.uniqWith(betOnOne, _.isEqual)?.map((res, index) => {
    return (
      <div className={styles.roundBet} key={index}>
        <Text variant="secondary" fontWeight="500" fontSize="12px">
          {`#${res.userId?.slice(0, 4)}...${res.userId?.slice(
            res.userId?.length - 4
          )}`}
        </Text>
        <Text fontSize="12px">{res.amount}</Text>
      </div>
    );
  });

  const renderRoundTwo = _.uniqWith(betOnTwo, _.isEqual)?.map((res, index) => {
    return (
      <div className={styles.roundBet} key={index}>
        <Text variant="secondary" fontWeight="500" fontSize="12px">
          {`#${res.userId?.slice(0, 4)}...${res.userId?.slice(
            res.userId?.length - 4
          )}`}
        </Text>
        <Text fontSize="12px">{res.amount}</Text>
      </div>
    );
  });

  const renderRoundThree = _.uniqWith(betOnThree, _.isEqual)?.map(
    (res, index) => {
      return (
        <div className={styles.roundBet} key={index}>
          <Text variant="secondary" fontWeight="500" fontSize="12px">
            {`#${res.userId?.slice(0, 4)}...${res.userId?.slice(
              res.userId?.length - 4
            )}`}
          </Text>
          <Text fontSize="12px">{res.amount}</Text>
        </div>
      );
    }
  );

  const betOneValue = _.uniqWith(betOnOne, _.isEqual)?.reduce(
    (initialVal, val) => {
      return val.amount + initialVal;
    },
    0
  );

  const betTwoValue = _.uniqWith(betOnTwo, _.isEqual)?.reduce(
    (initialVal, val) => {
      return val.amount + initialVal;
    },
    0
  );

  const betThreeValue = _.uniqWith(betOnThree, _.isEqual)?.reduce(
    (initialVal, val) => {
      return val.amount + initialVal;
    },
    0
  );

  const heighestBidOnOne = _.uniqWith(betOnOne, _.isEqual)?.reduce(
    (prev, current) => {
      return prev.amount > current.amount ? prev : current;
    },
    0
  );

  const heighestBidOnTwo = _.uniqWith(betOnTwo, _.isEqual)?.reduce(
    (prev, current) => {
      return prev.amount > current.amount ? prev : current;
    },
    0
  );

  const heighestBidOnThree = _.uniqWith(betOnThree, _.isEqual)?.reduce(
    (prev, current) => {
      return prev.amount > current.amount ? prev : current;
    },
    0
  );

  const renderChat = <Chat />;

  const renderTeams = (
    <div className={styles.teams}>
      <div className={styles.rounds}>
        <div className={styles.roundBet} style={{ marginBottom: 20 }}>
          <Image
            src="/animation1.svg"
            alt="icon"
            width={40}
            height={40}
            objectFit="contain"
            layout="fixed"
          />
          <aside
            className={tab === 1 ? styles.selected : styles.select}
            onClick={() => {
              setTab(1);
              setChoice(1);
            }}
          >
            <Text variant="primary">{tab === 1 ? "selected" : "select"}</Text>
          </aside>
        </div>
        <div className={styles.roundBet} style={{ marginBottom: 10 }}>
          <div>
            <Image alt="user" src="/user.svg" width={20} height={20} />
            <Text component="span" variant="primary" fontSize="12px">
              {_.uniqWith(betOnOne, _.isEqual)?.length} bets
            </Text>
          </div>
          <div>
            <Image alt="dollar" src="/dollar.svg" width={20} height={20} />
            <Text component="span" variant="primary" fontSize="12px">
              {betOneValue ? (
                <CountUp
                  start="0"
                  end={Number(betOneValue)}
                  duration="1.5"
                  separator=","
                  decimals="2"
                />
              ) : (
                0
              )}
            </Text>
          </div>
        </div>
        {betOnOne.length > 0 && (
          <div className={styles.userList}>
            <Text fontSize="12px" fontWeight="500" style={{ color: "#E6813C" }}>
              Heighest Bid
            </Text>
            <section>
              <Text variant="secondary" fontWeight="500" fontSize="12px">
                {`#${heighestBidOnOne?.userId?.slice(
                  0,
                  4
                )}...${heighestBidOnOne?.userId?.slice(
                  heighestBidOnOne?.userId?.length - 4
                )}`}
              </Text>
              <Text fontSize="12px">{heighestBidOnOne?.amount}</Text>
            </section>
            <Text fontSize="12px" style={{ color: "#FDBB35" }}>
              Current Bids
            </Text>
            {renderRoundOne}
          </div>
        )}
      </div>
      <div className={styles.rounds}>
        <div className={styles.roundBet} style={{ marginBottom: 20 }}>
          <Image
            src="/animation2.svg"
            alt="icon"
            width={40}
            height={40}
            objectFit="contain"
            layout="fixed"
          />
          <aside
            className={tab === 2 ? styles.selected : styles.select}
            onClick={() => {
              setTab(2);
              setChoice(2);
            }}
          >
            <Text variant="primary">{tab === 2 ? "selected" : "select"}</Text>
          </aside>
        </div>
        <div className={styles.roundBet} style={{ marginBottom: 10 }}>
          <div>
            <Image alt="" src="/user.svg" width={20} height={20} />
            <Text component="span" variant="primary" fontSize="12px">
              {_.uniqWith(betOnTwo, _.isEqual)?.length} bets
            </Text>
          </div>
          <div>
            <Image alt="" src="/dollar.svg" width={20} height={20} />
            <Text component="span" variant="primary" fontSize="12px">
              {betTwoValue ? (
                <CountUp
                  start="0"
                  end={Number(betTwoValue)}
                  duration="1.5"
                  separator=","
                  decimals="2"
                />
              ) : (
                0
              )}
            </Text>
          </div>
        </div>

        {betOnTwo.length > 0 && (
          <div className={styles.userList}>
            <Text fontSize="12px" fontWeight="500" style={{ color: "#E6813C" }}>
              Heighest Bid
            </Text>
            <section>
              <Text variant="secondary" fontWeight="500" fontSize="12px">
                {`#${heighestBidOnTwo?.userId?.slice(
                  0,
                  4
                )}...${heighestBidOnTwo?.userId?.slice(
                  heighestBidOnTwo?.userId?.length - 4
                )}`}
              </Text>
              <Text fontSize="12px">{heighestBidOnTwo?.amount}</Text>
            </section>
            <Text fontSize="12px" style={{ color: "#FDBB35" }}>
              Current Bids
            </Text>
            {renderRoundTwo}
          </div>
        )}
      </div>
      <div className={styles.rounds}>
        <div className={styles.roundBet} style={{ marginBottom: 20 }}>
          <Image
            src="/animation3.svg"
            alt="icon"
            width={40}
            height={40}
            objectFit="contain"
            layout="fixed"
          />
          <aside
            className={tab === 3 ? styles.selected : styles.select}
            onClick={() => {
              setTab(3);
              setChoice(3);
            }}
          >
            <Text variant="primary">{tab === 3 ? "selected" : "select"}</Text>
          </aside>
        </div>
        <div className={styles.roundBet} style={{ marginBottom: 10 }}>
          <div>
            <Image alt="" src="/user.svg" width={20} height={20} />
            <Text component="span" variant="primary" fontSize="12px">
              {_.uniqWith(betOnThree, _.isEqual)?.length} bets
            </Text>
          </div>
          <div>
            <Image alt="" src="/dollar.svg" width={20} height={20} />
            <Text component="span" variant="primary" fontSize="12px">
              {betThreeValue ? (
                <CountUp
                  start="0"
                  end={Number(betThreeValue)}
                  duration="1.5"
                  separator=","
                  decimals="2"
                />
              ) : (
                0
              )}
            </Text>
          </div>
        </div>
        {betOnThree.length > 0 && (
          <div className={styles.userList}>
            <Text fontSize="12px" fontWeight="500" style={{ color: "#E6813C" }}>
              Heighest Bid
            </Text>
            <section>
              <Text variant="secondary" fontWeight="500" fontSize="12px">
                {`#${heighestBidOnThree?.userId?.slice(
                  0,
                  4
                )}...${heighestBidOnThree?.userId?.slice(
                  heighestBidOnThree?.userId?.length - 4
                )}`}
              </Text>
              <Text fontSize="12px">{heighestBidOnThree?.amount}</Text>
            </section>
            <Text fontSize="12px" style={{ color: "#FDBB35" }}>
              Current Bids
            </Text>
            {renderRoundThree}
          </div>
        )}
      </div>
    </div>
  );

  const renderInstallMetamask = (
    <div className={styles.installMetamask}>
      <Image alt="" src="/error.svg" width={50} height={50} />
      <Text variant="primary" style={{ color: "#f65151", marginLeft: "0.5em" }}>
        Install metamask to experience FORTUNETTA
      </Text>
    </div>
  );

  const renderContent = (
    <div className={styles.content}>
      <div>
        <div className={styles.hero}>
          {renderRoulette}
          {renderBetForm}
        </div>
        {renderTeams}
      </div>
      {renderChat}
    </div>
  );

  return (
    <>
      <Layout>
        <div>{renderContent}</div>
      </Layout>
      <Footer />
      {isNotConnected && (
        <Modal variant="connect" setIsModal={setIsNotConnected} />
      )}
      {approveModal && (
        <Modal
          variant="approve"
          setIsModal={setApproveModal}
          setSuccessModal={setSuccessModal}
          setProcessModal={setProcessModal}
          setErrorModal={setErrorModal}
        />
      )}
      {wrongNetwork && <Modal variant="wrongNetwork" chainId={chainId} />}
      {processModal && <Modal variant="processing" />}
      {successModal && <Modal variant="success" />}
      {errorModal && <Modal variant="error" />}
      {installMetamask && renderInstallMetamask}
      {isPlacedBet && (
        <Modal variant="invalidBet" setIsModal={setIsPlacedBet} />
      )}

      <Modal
        variant="winningChoice"
        isModal={winningChoice}
        winningChoice={winningChoice}
      />
    </>
  );
};

Roulette.getInitialProps = async () => {
  let debug;
  console.log("getting initial props");
  const web3 = new Web3();
  console.log(debug);
  return { status: "success" };
};

export default Roulette;
