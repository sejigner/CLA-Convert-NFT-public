import Caver from "caver-js";
import KeyringContainer from "caver-js/packages/caver-wallet";
// import CounterABI from '../abi/CounterABI.json';
import CCTABI from "../abi/ClaConvertNFTABI.json";
import ERC20ABI from "../abi/ERC20ABI.json";
import { CLA_CONVERT_NFT_ADDRESS, CLAIM_TOKEN_ADDRESS } from "../constants";
// const option = {
//   headers: [
//     {
//       name: "Authorization",
//       value:
//         "Basic " +
//         Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
//     },
//     { name: "x-chain-id", value: CHAIN_ID },
//   ],
// };

const caver = new Caver(window.klaytn);
// new Caver.providers.HttpProvider(
//   "https://node-api.klaytnapi.com/v1/klaytn",
//   option
// )
// );
// const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);
const CCTContract = new caver.contract(CCTABI, CLA_CONVERT_NFT_ADDRESS);
const ERC20Contract = new caver.contract(ERC20ABI, CLAIM_TOKEN_ADDRESS);

export const getClaBalance = async (address) => {
  return await CCTContract.methods.claBalanceOf(address).call();
};

export const getCctBalance = async (address) => {
  return await CCTContract.methods.balanceOf(address).call();
};

export const getCctId = async (address, index) => {
  return await CCTContract.methods.tokenOfOwnerByIndex(address, index).call();
};

export const getCct = async (tokenId) => {
  return await CCTContract.methods.ccts(tokenId).call();
};

export const harvest = async (tokenId) => {
  try {
    return caver.klay
      .sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: window.klaytn.selectedAddress,
        to: CLA_CONVERT_NFT_ADDRESS,
        data: CCTContract.methods
          .claimClaReward(tokenId, window.klaytn.selectedAddress)
          .encodeABI(),
        // value: "",
        gas: "600000",
      })
      .on("transactionHash", (hash) => {
        console.log(hash);
      })
      .on("receipt", (receipt) => {
        // success
        console.log(receipt);
      })
      .on("error", (e) => {
        // failed
        console.log(e);
      });
  } catch (e) {
    console.error(e);
  }
};

export const burnCct = async (tokenId) => {
  try {
    caver.klay
      .sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: window.klaytn.selectedAddress,
        to: CLA_CONVERT_NFT_ADDRESS,
        data: CCTContract.methods.burn(tokenId).encodeABI(),
        // value: "",
        gas: "600000",
      })
      .on("transactionHash", (hash) => {
        console.log(hash);
      })
      .on("receipt", (receipt) => {
        // success
        console.log(receipt);
      })
      .on("error", (e) => {
        // failed
        console.log(e);
      });
  } catch (e) {
    console.error(e);
  }
};

export const getAccumulatedReward = async (tokenId) => {
  try {
    return await CCTContract.methods.accumulatedRewardCla(tokenId).call();
  } catch (e) {
    console.error(e);
  }
};

export const approveCla = async (amount) => {
  return caver.klay
    .sendTransaction({
      type: "SMART_CONTRACT_EXECUTION",
      from: window.klaytn.selectedAddress,
      to: CLAIM_TOKEN_ADDRESS,
      data: ERC20Contract.methods
        .approve(CLA_CONVERT_NFT_ADDRESS, amount)
        .encodeABI(),
      gas: "500000",
    })
    .on("transactionHash", (hash) => {
      console.log(hash);
    })
    .on("receipt", (receipt) => {
      // success
      console.log(receipt);
    })
    .on("error", (e) => {
      // failed
      console.log(e);
    });
};

export const convertClaToCct = async (amount) => {
  return caver.klay
    .sendTransaction({
      type: "SMART_CONTRACT_EXECUTION",
      from: window.klaytn.selectedAddress,
      to: CLA_CONVERT_NFT_ADDRESS,
      data: CCTContract.methods.convertClaToCct(amount).encodeABI(),
      // value: "",
      gas: "800000",
    })
    .on("transactionHash", (hash) => {
      console.log(hash);
    })
    .on("receipt", (receipt) => {
      // success
      console.log(receipt);
    })
    .on("error", (e) => {
      // failed
      console.log(e);
    });
};

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};
