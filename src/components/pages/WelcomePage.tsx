import React from "react";
import styled from "styled-components";
import ConnectButton from "../shared/ConnectButton";
import { SCREEN } from "../../constants";

const Wrapper = styled.div`
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  min-height: calc(100% - 48px);
  @media (min-width: ${SCREEN.DESKTOP}) {
    padding: 60px 106px;
    margin: 40px 20px 0;
    border: 1px solid #dcdcdc;
  }
`;

const Title = styled.p`
font-weight: 700;
font-size: 25px;
line-height: 120%;
text-align: center;
color: rgba(0, 0, 0, 0.87);
padding: 0
margin: 0 0 15px;
@media (min-width: ${SCREEN.DESKTOP}) {
  max-width: 576px;
  margin: 0 auto 15px;
}
`;

const Img = styled.img`
  margin: 0 auto 15px;
  width: 335px;
  height: 322px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    width: 500px;
    height: 480px;
  }
`;

const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  padding: 0;
  margin: 0 0 5px;
  @media (min-width: ${SCREEN.DESKTOP}) {
    max-width: 576px;
    margin: 0 auto 5px;
  }
`;

const ButtonWrapper = styled.div`
  max-width: 200px;
  margin: 0 auto;
  width: 100%;
  & .MuiButton-startIcon > img {
    background: none;
    border: none;
    padding: 0;
  }
`;

const Disclaimer = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  color: #0b0d17;
  opacity: 0.5;
  max-width: 500px;
  margin: 0 auto;
`;

type Props = {};

const WelcomePage = (props: Props) => {
  return (
    <Wrapper>
      <Title>
        Welcome to
        <br />
        Grindery Nexus
      </Title>
      <Img src="/images/welcome.svg" alt="Welcome" />
      <Desc>
        Grindery Nexus is the easiest way for people and organizations to connect Apps and
        dApps across chains and protocols.
      </Desc>
      <ButtonWrapper>
        <ConnectButton />
      </ButtonWrapper>
      <Disclaimer>
        Grindery Nexus uses{" "}
        <a
          href="https://blog.ceramic.network/what-is-3id-connect/"
          target="_blank"
          rel="noreferrer"
        >
          Ceramic 3ID
        </a>{" "}
        to authenticate users.
      </Disclaimer>
    </Wrapper>
  );
};

export default WelcomePage;
