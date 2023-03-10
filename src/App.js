import React, { useState, useEffect } from "react";
import KaikasLogo from "./assets/kaikas.png";
import CctLogo from "./assets/cct.png";
import Intro from "./components/Intro.js";
import Main from "./components/Main.js";
import { getClaBalance } from "./api/UseCaver";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [myAddress, setMyAddress] = useState();

  // UI
  const [connect, setConnect] = useState(false);
  const [claBalance, setClaBalance] = useState(0);

  let account = "";
  const connectToKaikas = async () => {
    try {
      if (typeof window.klaytn !== "undefined") {   
        const klaytn = window.klaytn;
        const accounts = await klaytn.enable();
        account = accounts[0];
        setMyAddress(account);
        setConnect(true);
        updateClaBalance();
        console.log("account status: " + account);
      } else {
        alert('Kaikas 지갑이 필요합니다. 크롬 익스텐션을 설치해주세요.')
      }
    } catch (e) {
      console.log(e);
    }
  };

  const convertUnit = (cla) => {
    return parseInt(cla, 10) / 10 ** 18;
  };

  const updateClaBalance = async () => {
    try {
      let balance = await getClaBalance(account);
      console.log(typeof balance);
      balance = convertUnit(balance);
      console.log(balance);
      setClaBalance(balance);
    } catch (e) {
      console.error(e);
    }
  };

  const getBalance = async () => {
    if (myAddress !== undefined) {
      setClaBalance(await getClaBalance(myAddress));
    }
  };

  useEffect(() => {
    getBalance();
  }, [claBalance]);
  return (
    <div className="App" style={{ height: "100%" }}>
      <div
        className="navBar"
        style={{
          height: "80px",
          width: "100%",
          position: "absolute",
          backgroundColor: "#010101",
          display: "flex",
          justifyContent: "center",
          borderBottom: "1px solid #313131",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "66%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img src={CctLogo} width="153px" alt="logo" />
          {!connect && (
            <button
              type="button"
              style={{
                fontSize: "16px",
                display: "flex",
                padding: "12px 16px",
                gap: "10px",
                backgroundColor: "#222226",
                border: "1px solid #404040",
                borderRadius: "4px",
                color: "white",
                fontWeight: "700",
              }}
              onClick={() => {
                connectToKaikas();
              }}
            >
              <img src={KaikasLogo} alt="" width="20px" height="20px" />
              지갑 연결하기
            </button>
          )}
        </div>
      </div>
      {/* Hero */}
      {connect ? (
        <Main
          account={myAddress}
          claBalance={claBalance}
          setConnect={connect}
        />
      ) : (
        <Intro connectToKaikas={connectToKaikas} />
      )}
    </div>
  );
}

export default App;
