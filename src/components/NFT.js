import React, { useEffect, useState } from "react";
import {
  harvest,
  burnCct,
  getAccumulatedReward,
  getCct,
} from "../api/UseCaver.js";

const aDayinSecond = 86400;
const decimal = 10 ** -18;

const NFT = ({ tokenId }) => {
  const [accumulatedReward, setAccumulatedReward] = useState(0);
  const [endDay, setEndDay] = useState(0);
  const [claAmount, setClaAmount] = useState(0);

  const updateClaReward = async (tokenId) => {
    const reward = await getAccumulatedReward(tokenId);
    console.log(`tokenId:${tokenId} reward:${reward * decimal}`);

    if (reward !== undefined)
      setAccumulatedReward((parseInt(reward)*decimal).toFixed(5));
    else setAccumulatedReward(0);
  };

  const isBurnable = () => {
    if (endDay !== 0) {
      return (
        Math.floor(Date.now() / 1000 / aDayinSecond) > parseInt(endDay, 10)
      );
    }
  };

  const getToken = async (tokenId) => {
    const cct = await getCct(tokenId);
    setEndDay(cct.endDay);
    setClaAmount(cct.claAmount * decimal);
  };

  useEffect(() => {
    if (tokenId) {
      updateClaReward(tokenId);
      getToken(tokenId);
    }
  }, [accumulatedReward, tokenId]);

  return (
    <div className="container-nft">
      <div className="wrapper-nft">
        <p className="title">Reward</p>
        <div className="cla-amount">
          <p>{accumulatedReward} CLA</p>
          <i
            className="fa-solid fa-rotate"
            type="button"
            onClick={() => updateClaReward(tokenId)}
          ></i>
        </div>

        <div className="wrapper-button">
          <button
            className="harvest"
            type="button"
            onClick={async () => {
              await harvest(tokenId);
              await updateClaReward(tokenId);
            }}
          >
            harvest
          </button>
          {isBurnable() && (
            <button
              className="burn"
              type="button"
              onClick={async () => {
                await burnCct(tokenId);
              }}
            >
              burn
            </button>
          )}
        </div>
        <div className="wrapper-deposit">
          <span className="title">Locked CLA</span>
          <span id="claAmount" className="amount">
            {claAmount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NFT;
