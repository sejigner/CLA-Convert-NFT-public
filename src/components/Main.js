import React, { useEffect, useState } from "react";
import Caver from "caver-js";
import KaikasLogo from "../assets/kaikas.png";
import NFT from "./NFT.js";
import {
  approveCla,
  convertClaToCct,
  getClaBalance,
  getCctBalance,
  approveClaAndTransfer,
  getCctId,
  getCct,
} from "../api/UseCaver";

const caver = new Caver(window.klaytn);
const decimal = 10 ** -18;

const Main = ({ account, claBalance }) => {
  const [nftArray, setNftArray] = useState([]);
  const [claInput, setClaInput] = useState(0);

  const onClickDeposit = async () => {
    try {
      const amount = caver.utils.toPeb(claInput);
      console.log("amount : " + amount);
      let response = await approveCla(amount);
      if (response.status === true) {
        response = await convertClaToCct(amount);
        // TODO: response로부터 정상적인 이벤트 출력 확인
        if (response.status === true) {
          updateCctList();
          // 민팅 완료 안내 및 nft 리스트 UI 업데이트
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCctList = async () => {
    try {
      const balance = await getCctBalance(account);
      const tmpArray = [];

      for (let i = 0; i < parseInt(balance, 10); i++) {
        const tokenId = await getCctId(account, i);
        tmpArray.push(tokenId);
        console.log(tmpArray);
      }
      setNftArray(tmpArray);
    } catch (e) {
      console.error(e);
    }
  };
  // key: i,
  //         tokenId: tokenId,
  //         endDay: cct.endDay,
  //         claAmount: cct.claAmount,

  // const renderNFTs = (nftArray) => {
  //   return <NFT key={key} tokenId={tokenId} />;
  // };

  useEffect(() => {
    if (!account) return;
    updateCctList();
  }, []);
  useEffect(() => {
    console.log(nftArray);
  }, [nftArray]);

  return (
    <div
      id="dashboard"
      style={{
        width: "100%",
        paddingTop: "116px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <section id="myWallet" style={{ width: "66%" }}>
        <div className="title-section">
          <img src={KaikasLogo} alt="" width="32px" height="32px" />
          <p>My Wallet</p>
        </div>
        <div className="column-2-wrapper">
          <div className="wallet-card">
            <div>
              <h3>Account Address</h3>
              <p className="sub address">{account}</p>
            </div>
            <div className="lower-wrapper-left">
              <p className="cla">
                CLA <b>{claBalance * decimal}</b>
              </p>
            </div>
            <p
              className="disconnect"
              type="button"
              onClick={() => this.props.setConnect(false)}
            >
              지갑 연결 끊기
            </p>
          </div>
          <div className="wallet-card">
            <div>
              <h3>Convert CLA to CCT</h3>
              <p className="sub">
                ClaimSwap의 CLA를 180일 간 예치하면 CCT NFT가 지급됩니다.
                <br />
                CCT 홀더는 쌓인 CLA 이자를 원할 때 수령할 수 있습니다.
              </p>
            </div>
            <div className="lower-wrapper-right">
              <input
                id="depositCla"
                placeholder="0.000 CLA"
                onChange={(e) => {
                  setClaInput(e.target.value);
                }}
              />
              <span>
                <button
                  title="deposit"
                  className="deposit"
                  onClick={() => {
                    if (claInput !== 0) {
                      onClickDeposit();
                    }
                  }}
                >
                  예치하기
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </section>
      <section id="myCCT" style={{ width: "66%" }}>
        <div className="title-section">
          <p>My CCT</p>
        </div>
        <p className="description">
          예치한지 180일이 지나면 NFT를 소각하고, 원금과 이자 CLA를 수령할 수
          있습니다.
        </p>
        <div className="wrapper-tokens">
          {nftArray &&
            nftArray.map((v, i) => {
              return <NFT key={i} tokenId={v} />;
            })}
          {/* Dummies 23.01.25 기준 19382 days in Epoch time  */}
        </div>
      </section>
    </div>
  );
};

export default Main;
