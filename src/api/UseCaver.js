import Caver from "caver-js";
import KeyringContainer from "caver-js/packages/caver-wallet";
// import CounterABI from '../abi/CounterABI.json';
import CCTABI from "../abi/ClaConvertNFTABI.json";
import KIP17ABI from "../abi/KIP17TokenABI.json";
import {
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  CLA_CONVERT_NFT_ADDRESS,
  // COUNT_CONTRACT_ADDRESS,
  // NFT_CONTRACT_ADDRESS,
  CHAIN_ID,
} from "../constants";
const option = {
  headers: [
    {
      name: "Authorization",
      value:
        "Basic " +
        Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64"),
    },
    { name: "x-chain-id", value: CHAIN_ID },
  ],
};

const caver = new Caver(window.klaytn);
// new Caver.providers.HttpProvider(
//   "https://node-api.klaytnapi.com/v1/klaytn",
//   option
// )
// );
// const NFTContract = new caver.contract(KIP17ABI, NFT_CONTRACT_ADDRESS);
const CCTContract = new caver.contract(CCTABI, CLA_CONVERT_NFT_ADDRESS);

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
    caver.klay
      .sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: window.klaytn.selectedAddress,
        to: CLA_CONVERT_NFT_ADDRESS,
        data: CCTContract.methods.claimClaReward(tokenId).encodeABI(),
        // value: "",
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
  } catch (e) {
    console.error(e);
  }
};

export const accumulatedReward = async (tokenId) => {
  try {
    return await CCTContract.methods.accumulatedRewardCla(tokenId).call();
  } catch (e) {
    console.error(e);
  }
};

export const approveCla = async (amount) => {
  try {
    caver.klay
      .sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: window.klaytn.selectedAddress,
        to: CLA_CONVERT_NFT_ADDRESS,
        data: CCTContract.methods.approveCla(amount).encodeABI(),
        // value: "",
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
    // const receipt = await CCTContract.methods.approveCla(amount).send({
    //   from: window.klaytn.selectedAddress, // address
    //   gas: "0x4bfd200", //
    // });
    // .then((receipt) => {
    //   console.log(receipt);
    //   if (receipt.status) {
    //     const tokenId = receipt.events.Approve.returnValues[0];
    //     console.log(tokenId);
    //   }
    // });
  } catch (error) {
    console.log(error);
  }
};

export const convertClaToCCT = async (amount) => {
  try {
    caver.klay
      .sendTransaction({
        type: "SMART_CONTRACT_EXECUTION",
        from: window.klaytn.selectedAddress,
        to: CLA_CONVERT_NFT_ADDRESS,
        data: CCTContract.methods.convertClaToCCT(amount).encodeABI(),
        // value: "",
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
  } catch (error) {
    console.log(error);
  }
};

// export const fetchCardsOf = async (address) => {
//   // Fetch Balance
//   const balance = await NFTContract.methods.balanceOf(address).call();
//   console.log(`[NFT Balance]${balance}`);
//   // Fetch Token IDs
//   const tokenIds = [];
//   for (let i = 0; i < balance; i++) {
//     const id = await NFTContract.methods.tokenOfOwnerByIndex(address, i).call();
//     tokenIds.push(id);
//   }
//   // Fetch Token URIs
//   const tokenUris = [];
//   for (let i = 0; i < balance; i++) {
//     const uri = await NFTContract.methods.tokenURI(tokenIds[i]).call();
//     tokenUris.push(uri);
//   }
//   const nfts = [];
//   for (let i = 0; i < balance; i++) {
//     nfts.push({ uri: tokenUris[i], id: tokenIds[i] });
//   }
//   console.log(nfts);
//   return nfts;
// };

export const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((response) => {
    const balance = caver.utils.convertFromPeb(
      caver.utils.hexToNumberString(response)
    );
    console.log(`BALANCE: ${balance}`);
    return balance;
  });
};

// const CountContract = new caver.contract(CounterABI, COUNT_CONTRACT_ADDRESS);

// export const readCount = async () => {
//   const _count = await CountContract.methods.count().call();
//   console.log(_count);
// }

// export const setCount = async (newCount) => {
//   // 사용할 account 설정
//   try {
//     const privatekey = '0x26c8485748a7f9e9ae637a5c014f9955c2be9aa24ca8f1674e7e98c7123c9a4d';
//     const deployer = caver.wallet.keyring.createFromPrivateKey(privatekey);
//     caver.wallet.add(deployer);
//     // 스마트 컨트랙트 실행 트랜젝션 날리기
//     // 결과 확인

//     const receipt = await CountContract.methods.setCount(newCount).send({
//       from: deployer.address, // address
//       gas: "0x4bfd200"//
//     })
//     console.log(receipt);
//   } catch(e) {
//     console.log(`[ERROR_SET_COUNT]${e}`);
//   }

// }
