import React, { useState } from "react";
import styles from "../../styles/Account.module.css";
import Image from "next/image";
import ScreenTemplate from "../../components/screenTemplate";
import Text from "../../components/Text";
import Layout from "../../components/layout";

const initialState = {
  displayName: "",
  email: "",
  description: "",
  walletAddress: "",
  selectedFile: "",
};

const AccountScreen = () => {
  //INITIALIZING HOOKS

  const [formData, setFormData] = useState(initialState);
  const [invalidFormat, setInvalidFormat] = useState(false);

  //SUPPORTED FORMATS

  const supportedFormat = ["jpeg", "jpg", "png", "gif"];

  //HANDLING METHODS

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUploadFile = (e) => {
    const files = e.target.files;
    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      const ext = files[0].name.split(".").pop();
      if (supportedFormat.some((res) => res === ext.toLowerCase())) {
        setInvalidFormat(false);
        reader.onload = (result) => {
          setFormData({
            ...formData,
            selectedFile: result.target.result,
          });
        };
      } else {
        setInvalidFormat(true);
      }
    }
  };
  const renderHeader = (
    <div className={styles.accountHeader}>
      <div>
        <Text variant="primary" fontSize="20px" style={{ marginBottom: 15 }}>
          Your Account
        </Text>
        <Text variant="secondary">
          You can set your prefered display name, email address and manage other
          personal info.
        </Text>
      </div>
    </div>
  );

  const renderDetails = (
    <div className={styles.accountDetails}>
      <p>
        <span>Profile</span>
      </p>
    </div>
  );

  const renderForm = (
    <div className={styles.accountForm}>
      <div>
        <section>
          <Text>Display Name</Text>
          <div>
            <input
              placeholder="Your name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
            />
          </div>
        </section>
        <section>
          <Text>Email Address</Text>
          <div>
            <input
              placeholder="Your email address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </section>
        <section>
          <Text>Wallet Address</Text>
          <div>
            <input
              placeholder="Your wallet address"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
            />
          </div>
        </section>
        <section>
          <Text>Description</Text>
          <div>
            <textarea
              rows="5"
              placeholder="Enter a short description about yourself "
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </section>
      </div>
      <div className={styles.fileInput}>
        <Text>Display Picture</Text>
        <div className={styles.imagePreview}>
          {formData.selectedFile ? (
            <Image
              alt=""
              src={formData.selectedFile}
              width={200}
              height={200}
            />
          ) : (
            <Image alt="" src="/fortunettaLady.svg" width={200} height={200} />
          )}
          {invalidFormat && (
            <Text fontSize="12px" style={{ color: "#F65151" }}>
              Invalid Format
            </Text>
          )}
        </div>
        <Text variant="secondary" fontWeight="500">
          Upload your prefered Display Picture
        </Text>
        <Text fontSize="12px" style={{ marginBottom: "2em" }}>
          We recommend a image of 400X400 size. It can be a jpg, jpeg, png or a
          gif.
        </Text>
        <input type="file" id="file_input" onChange={handleUploadFile} />
        <label htmlFor="file_input">Choose File</label>
      </div>
    </div>
  );

  const renderScreen = (
    <ScreenTemplate>
      <div className={styles.account}>
        {renderHeader}
        {renderDetails}
        {renderForm}
      </div>
    </ScreenTemplate>
  );
  return (
    <>
      <Layout>{renderScreen}</Layout>
    </>
  );
};

export default AccountScreen;
