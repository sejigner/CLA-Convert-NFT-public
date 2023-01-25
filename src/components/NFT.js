import React from "react";
import { harvest, burnCct, accumulatedReward } from "../api/UseCaver.js";

class NFT extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accumulatedReward: 0,
    };
  }

  componentDidMount() {
    this.harvest = harvest.bind(this);
    this.burnCct = burnCct.bind(this);
    this.accumulatedReward = accumulatedReward.bind(this);
  }

  async updateClaReward(tokenId) {
    const reward = await accumulatedReward(tokenId);

    if (reward !== undefined) this.setState({ accumulatedReward: reward });
    else this.setState({ accumulatedReward: 0 });
  }

  render() {
    const { claAmount, endDay, tokenId } = this.props;
    const isBurnable = (endDay) => {
      return Math.floor(Date.now() / 1000) > endDay;
    };

    return (
      <div className="container-nft">
        <div className="wrapper-nft">
          <p className="title">Reward</p>
          <p className="cla-amount">
            {this.state.accumulatedReward} CLA
            <i
              className="fa-solid fa-rotate"
              type="button"
              onClick={() => this.updateClaReward(tokenId)}
            ></i>
          </p>
          <div className="wrapper-button">
            <button
              className="harvest"
              type="button"
              onClick={async () => {
                await this.harvest(tokenId);
                await this.updateClaReward(tokenId);
              }}
            >
              harvest
            </button>
            {isBurnable(endDay) && (
              <button
                className="burn"
                type="button"
                onClick={() => {
                  this.burnCct(tokenId);
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
  }
}

export default NFT;
