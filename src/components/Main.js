import React from "react";
import Caver from "caver-js";
import KaikasLogo from "../assets/kaikas.png";
import NFT from "./NFT.js";
import { ethers } from "ethers";
import {
  approveCla,
  convertClaToCct,
  getClaBalance,
  getCctBalance,
  transferClaFrom,
  approveClaAndTransfer,
  getCctId,
  getCct,
  allowance,
} from "../api/UseCaver";

const caver = new Caver(window.klaytn);

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.getBalance = this.getBalance.bind(this);
    this.setCla = this.setCla.bind(this);
    this.onClickDeposit = this.onClickDeposit.bind(this);
    this.updateCctList = this.updateCctList.bind(this);
    this.renderNFTs = this.renderNFTs.bind(this);
    this.allowance = this.getAllowance.bind(this);

    this.state = {
      claAmount: 0,
      claBalance: 0,
      nfts: [],
    };
  }

  async getAllowance() {
    console.log(await allowance());
  }
  componentDidMount() {
    this.updateCctList();
    this.getBalance();
    this.getAllowance();
  }

  async getBalance() {
    let balance = await getClaBalance(this.props.account);
    this.setState({ claBalance: balance });
  }
  setCla(amount) {
    this.setState({ claAmount: amount });
    console.log(
      "typeof:" + typeof this.state.claAmount + " value:" + this.state.claAmount
    );
  }
  async onClickDeposit() {
    try {
      const amount = caver.utils.toPeb(this.state.claAmount, "KLAY");
      console.log("amount : " + amount);
      let response = await transferClaFrom(amount);
      // let response = await approveClaAndTransfer(amount);
      console.log("approve & transfer: " + response);
      // if (response.status) {
      // 코드 수정 필요 convertClaToCct 메서드에서 transferFrom 삭제
      //   response = await convertClaToCct(amount);
      //   console.log(response);
      //   // TODO: response로부터 정상적인 이벤트 출력 확인
      //   if (response.status === true) {
      //     this.updateCctList(
      //       response.tokenId,
      //       response.claAmount,
      //       response.endDay
      //     );
      //     // 민팅 완료 안내 및 nft 리스트 UI 업데이트
      //   }
      // }
    } catch (err) {
      console.error(err);
    }
  }

  async updateCctList(tokenId, claAmount, endDay) {
    try {
      const balance = await getCctBalance(this.props.account);
      const nftArray = [];

      for (let i = 0; i < parseInt(balance, 10); i++) {
        // TODO: convertClaToCCT response 확인해서 하단 콜 필요 여부 결정
        // const tokenId = await getCctId(this.props.account, i);
        // const cct = await getCct(tokenId);
        const cctWithIndex = {
          tokenId: tokenId,
          claAmount: claAmount,
          endDay: endDay,
          key: i,
        };
        nftArray.push(cctWithIndex);
      }

      this.setState({ nfts: nftArray });
    } catch (e) {
      console.error(e);
    }
  }

  async renderNFTs(cct) {
    return (
      <NFT
        key={cct.key}
        claAmount={cct.claAmount}
        endDay={cct.endDay}
        tokenId={cct.tokenId}
      />
    );
  }

  render() {
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
                <p className="sub address">{this.props.account}</p>
              </div>
              <div className="lower-wrapper-left">
                <p className="cla">
                  CLA <b>{this.props.claBalance}</b>
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
                  placeholder="0.000 CLA"
                  onChange={(e) => {
                    this.setCla(e.target.value);
                  }}
                />
                <span>
                  <button
                    title="deposit"
                    className="deposit"
                    onClick={() => {
                      this.onClickDeposit();
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
            {this.state.nfts.map(this.renderNFTs)}
            {/* Dummies 23.01.25 기준 19382 days in Epoch time  */}
            <NFT claAmount="24" endDay="19382" tokenId="0" />
            <NFT claAmount="602" endDay="19381" tokenId="1" />
          </div>
        </section>
      </div>
    );
  }
}

export default Main;
