import React, { useState } from "react";
import Image from "next/image";
import emailjs from "emailjs-com";
//STYLESHEET

import styles from "../styles/Contactus.module.css";

//IMPORTING COMPONENTS

import Layout from "../components/layout";
import Chat from "../components/chat/chat";
import Footer from "../components/footer";
import Text from "../components/Text";
import Button from "../components/button";

const initialState = {
  name: "",
  email: "",
  message: "",
};

const Contactus = () => {
  const [formData, setFormData] = useState(initialState);
  const [isLoad, setIsLoad] = useState(false);
  const [isEmptyError, setIsEmptyError] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [isSucess, setIsSucess] = useState(false);
  const [isError, setIsError] = useState(false);

  //HANDLING METHODS

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  function validate() {
    if (
      formData.message === "" ||
      formData.email === "" ||
      formData.name === ""
    ) {
      setIsEmptyError(true);
      return false;
    }
    setIsEmptyError(false);
    return true;
  }
  const handleSubmit = () => {
    const res = validateEmail(formData.email);
    const val = validate(formData);

    //if email id is invalid
    if (res) {
      setInvalidEmail(false);
    } else {
      setInvalidEmail(true);
    }

    if (res && val) {
      setIsLoad(true);
      const { email, name, message } = formData;

      let templateParams = {
        email,
        name,
        message,
      };

      emailjs
        .send(
          "service_m82lvre",
          "template_bc09cml",
          templateParams,
          "user_GIBdBagcpQO842DYfWDKO"
        )
        .then(
          (result) => {
            setFormData(initailState);
            setIsLoad(false);
            setIsSucess(true);
            setTimeout(() => {
              setIsSucess(false);
            }, 3000);
          },
          (error) => {
            setFormData(initailState);
            setIsLoad(false);
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
            }, 3000);
          }
        );
    }
  };

  const renderHeader = (
    <div className={styles.header}>
      <Text variant="primary" fontSize="20px" style={{ marginBottom: 16 }}>
        Get in touch with us
      </Text>
      <Text variant="secondary">
        Fill the following form, our team will get back to you within 24 hours
      </Text>
    </div>
  );

  const renderForm = (
    <div className={styles.form}>
      <div>
        <Text>Name</Text>
        <div className={styles.input}>
          <input
            placeholder="Enter your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <Text>Email</Text>
        <div className={styles.input}>
          <input
            placeholder="Enter your email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {invalidEmail && (
          <Text style={{ color: "#f65151", marginBottom: 8 }}>
            Invalid email address
          </Text>
        )}
        <Text>Message</Text>
        <div className={styles.input}>
          <textarea
            rows="5"
            placeholder="Enter a short message "
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
        </div>
        {isEmptyError && (
          <Text style={{ color: "#f65151", marginBottom: 8 }}>
            Please fill the empt fields
          </Text>
        )}
        <Button
          className="primary_btn"
          onClick={() => handleSubmit()}
          style={{ PointerEvents: isLoad ? "none" : null }}
        >
          {isLoad ? (
            <Image src="/Gif.svg" width={16} height={16} />
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
      <div style={{ width: "100%" }}>
        <Image
          src="/map.svg"
          layout="responsive"
          width={"400"}
          height={"400"}
        />
      </div>
    </div>
  );

  const renderSucessMessage = (
    <div className={styles.contactModal}>
      <div>
        <Image src="/tick.svg" width={32} height={32} />
      </div>
      <div style={{ marginTop: "1em" }}>
        <Text variant="primary" style={{ marginBottom: 8 }}>
          Thanks for contacting us
        </Text>
        <Text variant="primary">We will meet you soon</Text>
      </div>
    </div>
  );

  const renderErrorMessage = (
    <div className={styles.contactModal}>
      <div>
        <Image src="/close.svg" width={32} height={32} />
      </div>
      <div style={{ marginTop: "1em" }}>
        <Text variant="primary" style={{ color: "#f65151" }}>
          Something went wrong
        </Text>
      </div>{" "}
    </div>
  );

  const renderScreen = (
    <div className={styles.contactus}>
      <div>
        {renderHeader}
        {renderForm}
      </div>
      <Chat />
    </div>
  );

  return (
    <>
      <Layout>{renderScreen}</Layout>
      <Footer />
      {isSucess && renderSucessMessage}
      {isError && renderErrorMessage}
    </>
  );
};

export default Contactus;
