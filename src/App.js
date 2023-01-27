import React, { useState, useEffect } from "react";
import KaikasLogo from "./assets/kaikas.png";
import CctLogo from "./assets/cct.png";
import Intro from "./components/Intro.js";
import Main from "./components/Main.js";
import {
  getClaBalance,
  getBalance,
  readCount,
  setCount,
  fetchCardsOf,
  getCctBalance,
} from "./api/UseCaver";
// import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./market.css";
import {
  Alert,
  Container,
  Card,
  Nav,
  Form,
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
// import { MARKET_CONTRACT_ADDRESS } from "./constants";

// function onPressButton(balance) {
//   console.log("hi");
// }
// const onPressButton2 = (_balance, _setBalance) => {
//   _setBalance(_balance);
// };
const DEFAULT_QR_CODE = "DEFAULT";
const DEFAULT_ADDRESS = "0x00000000000000000000000000000";

function App() {
  const [nfts, setNfts] = useState([]); // {id: '101', uri: ''}
  const [myBalance, setMyBalance] = useState("0");
  const [myAddress, setMyAddress] = useState("0x00000000000000000000000000000");

  // UI
  const [connect, setConnect] = useState(false);
  const [claBalance, setClaBalance] = useState(0);
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  const [tab, setTab] = useState("MARKET"); // MARKET, MINT, WALLET
  const [mintImageUrl, setMintImageUrl] = useState("");
  // Modal

  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "MODAL",
    onConfirm: () => {},
  });
  const rows = nfts.slice(nfts.length / 2);
  // const fetchMarketNFTs = async () => {
  //   const _nfts = await fetchCardsOf(MARKET_CONTRACT_ADDRESS);
  //   setNfts(_nfts);
  // };

  // const fetchMyNFTs = async () => {
  //   if (myAddress === DEFAULT_ADDRESS) {
  //     alert("NO ADDRESS");
  //     return;
  //   }
  //   const _nfts = await fetchCardsOf(myAddress);
  //   setNfts(_nfts);
  // };
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  const convertUnit = (cla) => {
    return parseInt(cla, 10) / (10**18);
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

  // const onClickMint = async (uri) => {
  //   if (myAddress === DEFAULT_ADDRESS) {
  //     alert("NO ADDRESS");
  //     return;
  //   }
  //   const randomTokenId = parseInt(Math.random() * 10000000);
  //   KlipAPI.mintCardWithURI(
  //     myAddress,
  //     randomTokenId,
  //     uri,
  //     setQrvalue,
  //     (result) => {
  //       alert(JSON.stringify(result));
  //     }
  //   );
  // };
  // const onClickCard = (id) => {
  //   if (tab === "WALLET") {
  //     setModalProps({
  //       title: "NFT를 마켓에 올리시겠어요?",
  //       onConfirm: () => {
  //         onClickMyCard(id);
  //       },
  //     });
  //     setShowModal(true);
  //   }
  //   if (tab === "MARKET") {
  //     setModalProps({
  //       title: "NFT를 구매하시겠어요?",
  //       onConfirm: () => {
  //         onClickMarketCard(id);
  //       },
  //     });
  //     setShowModal(true);
  //   }
  // };
  // const onClickMyCard = (tokenId) => {
  //   KlipAPI.listingCard(myAddress, tokenId, setQrvalue, (result) => {
  //     alert(JSON.stringify(result));
  //   });
  // };

  // const onClickMarketCard = (tokenId) => {
  //   KlipAPI.buyCard(tokenId, setQrvalue, (result) => {
  //     alert(JSON.stringify(result));
  //   });
  // };

  // const getUserData = () => {
  //   setModalProps({
  //     title: "Klip 지갑을 연동하시겠습니까?",
  //     onConfirm: () => {
  //       KlipAPI.getAddress(setQrvalue, async (address) => {
  //         setMyAddress(address);
  //         const _balance = await getBalance(address);
  //         setMyBalance(_balance);
  //       });
  //     },
  //   });
  //   setShowModal(true);
  // };

  useEffect(() => {
    // getUserData();
    // fetchMarketNFTs();
  }, []);
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
          setConnect={setConnect}
        />
      ) : (
        <Intro connectToKaikas={connectToKaikas} />
      )}
      {}
      {/* 모달 */}
      <Modal
        centered
        size="sm"
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Modal.Title>{modalProps.title}</Modal.Title>
        </Modal.Header>
        <Modal.Footer
          style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
        >
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
            }}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              modalProps.onConfirm();
              setShowModal(false);
            }}
            style={{ backgroundColor: "#810034", borderColor: "#810034" }}
          >
            진행
          </Button>
        </Modal.Footer>
      </Modal>
      {/* 탭 */}
      {/* <nav
        style={{ backgroundColor: "#1b1717", height: 45 }}
        className="navbar fixed-bottom navbar-light"
        role="navigation"
      >
        <Nav className="w-100">
          <div className="d-flex flex-row justify-content-around w-100">
            <div
              onClick={() => {
                setTab("MARKET");
                // fetchMarketNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faHome} />
              </div>
            </div>
            <div
              onClick={() => {
                setTab("MINT");
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faPlus} />
              </div>
            </div>
            <div
              onClick={() => {
                setTab("WALLET");
                // fetchMyNFTs();
              }}
              className="row d-flex flex-column justify-content-center align-items-center"
            >
              <div>
                <FontAwesomeIcon color="white" size="lg" icon={faWallet} />
              </div>
            </div>
          </div>
        </Nav>
      </nav> */}
    </div>
  );
}

export default App;
