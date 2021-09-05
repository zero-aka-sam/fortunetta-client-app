import React from "react";
import Image from "next/image";
import styles from "../styles/Footer.module.css";
import Text from "./Text";
import ActiveLink from "./activeLink";

const Footer = () => {
  const renderCopyrights = (
    <div className={styles.copyright}>
      <Text variant="secondary">
        Copyright © 2016 - 2021 bscgamble.com. All rights reserved.
      </Text>
    </div>
  );

  const renderExplore = (
    <div className={styles.explore}>
      <Text variant="primary" fontSize="16px" style={{ marginBottom: "20px" }}>
        Explore
      </Text>
      <ActiveLink activeClassName="active" href="/contact_us">
        <a className={styles.footerLink}>
          <Text fontSize="12px" style={{ marginBottom: "16px" }}>
            Contact us
          </Text>
        </a>
      </ActiveLink>
      {/* <ActiveLink activeClassName="active" href="/dailyRewards">
        <a className={styles.footerLink}>
          <Text fontSize="12px" style={{ marginBottom: "16px" }}>
            Daily Rewards
          </Text>
        </a>
      </ActiveLink> */}
      <ActiveLink activeClassName="active" href="/privacy_policy">
        <a className={styles.footerLink}>
          <Text fontSize="12px" style={{ marginBottom: "16px" }}>
            Privacy Policy
          </Text>
        </a>
      </ActiveLink>
      <ActiveLink activeClassName="active" href="/terms_of_service">
        <a className={styles.footerLink}>
          <Text fontSize="12px" style={{ marginBottom: "16px" }}>
            Terms of Service
          </Text>
        </a>
      </ActiveLink>
    </div>
  );

  const renderCommunity = (
    <div>
      <Text variant="primary" fontSize="16px">
        Community
      </Text>
      <div className={styles.socialIcons} style={{ margin: "20px 0" }}>
        <Image src="/facebook.svg" width={22} height={22} />
        <Image src="/linkedin.svg" width={22} height={22} />
        <Image src="/github.svg" width={22} height={22} />
        <Image src="/youtube.svg" width={22} height={22} />
        <Image src="/twitter.svg" width={22} height={22} />
      </div>

      <Text variant="primary" fontSize="16px">
        Reach to us
      </Text>
      <div style={{ marginTop: "20px", display: "flex", cursor: "pointer" }}>
        <span style={{ width: "100%" }}>
          <Image src="/message.svg" width={15} height={15} />
        </span>
        <Text component="span" fontSize="12px">
          hello@fortunetta.com
        </Text>
      </div>
    </div>
  );

  const renderFooter = (
    <div className={styles.footerContent}>
      <div>
        <Image src="/logotext.png" width={190} height={29} />
        <Text fontSize="12px" style={{ marginTop: "20px" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elit
          consectetur at egestas ut vitae et vitae. Augue aenean diam quis ut
          porta. Et aliquam quam tortor imperdiet habitant. Facilisi nunc
          blandit blandit tristique quis quisque. Id feugiat tempus habitasse ac
          lacinia velit. Enim vulputate pretium commodo ullamcorper. Integer
          augue viverra a sit montes.
        </Text>
      </div>
      <div className={styles.links}>
        {renderExplore}
        {renderCommunity}
      </div>
    </div>
  );
  return (
    <div className={styles.footer}>
      {renderFooter}
      {renderCopyrights}
    </div>
  );
};

export default Footer;
