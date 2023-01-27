import React from "react";
import KaikasLogo from "../assets/kaikas.png";
import connectToKaikas from "../App.js";

class Intro extends React.Component {
  componentDidMount() {
    this.connectToKaikas = connectToKaikas.bind(this);
  }

  render() {
    return (
      <section
        id="intro"
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div id="container" style={{ width: "66%" }}>
          <div
            id="wrapper"
            style={{
              display: "flex",
              gap: "44px",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <h1 style={{ fontSize: "48px", fontWeight: "700" }}>
              ClaimSwap CLA를 예치하고
              <br />
              CCT와 CLA 이자를 받아보세요
            </h1>
            <p style={{ fontSize: "20px" }}>
              CCT는 180일 간의 CLA 예치를 보증하는 NFT입니다.
              <br />
              CCT 홀더는 원할 때 토큰 당 쌓인 CLA 이자를 받을 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => {
                this.props.connectToKaikas();
              }}
              style={{
                width: "fit-content",
                height: "76px",
                fontSize: "28px",
                display: "flex",
                padding: "20px 32px",
                borderRadius: "4px",
                gap: "8px",
                lineHeight: "33px",
                background: "rgba(23, 23, 27, 0.5)",
                border: "1px solid #404040",
                borderRadius: "4px",
                color: "white",
                fontWeight: "700",
              }}
            >
              <img src={KaikasLogo} alt="" width="36px" height="36px" />
              지갑 연결하기
            </button>
          </div>
        </div>
      </section>
    );
  }
}

export default Intro;
