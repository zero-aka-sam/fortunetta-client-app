import React from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import Text from "./Text";
import Button from "./button";
import styles from "../styles/sidebar.module.css";

const UserModal = ({ setIsModal }) => {
  const user = useSelector((state) => state.user);

  const handleWithdraw = async () => {};

  const renderHeader = (
    <div className={styles.flexRow}>
      <div></div>
      <span style={{ cursor: "pointer" }}>
        <Image
          alt=""
          src="/closeOutline.svg"
          width={24}
          height={24}
          onClick={() => setIsModal(false)}
        />
      </span>
    </div>
  );

  const renderLists = (
    <>
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
            <Image alt="" src="/tick.svg" width={20} height={20} />
          ) : (
            <Image alt="" src="/close.svg" width={20} height={20} />
          )}
        </Text>
      </div>
    </>
  );

  return (
    <>
      <div className={styles.userModal}>
        {renderHeader}
        {renderLists}
      </div>
      <div className={styles.backdrop} onClick={() => setIsModal(false)}></div>
    </>
  );
};

export default UserModal;
