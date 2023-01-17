import "./Card.css";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import tokenABI from "./tokenABI.json";
import { useState, useEffect } from "react";

function Card(props) {
  const [Bought, setBought] = useState(false);

  const checkBought = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const currentAddress = await provider.getSigner().getAddress();
    const marketplaceContract = new ethers.Contract(
      "0x96E955E8820B5e0f42A21F2d18fbeb49c40Be77c",
      ABI,
      signer
    );
    const bought = await marketplaceContract.alreadyBought(currentAddress);
    setBought(bought);
    console.log(Bought);
  };
  const Connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts");
    console.log("Trying to connect");
  };

  const payInETH = async () => {
    Connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const currentAddress = await provider.getSigner().getAddress();
    const marketplaceAddress = "0x96E955E8820B5e0f42A21F2d18fbeb49c40Be77c";
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      ABI,
      signer
    );
    const amount = await provider.getBalance(currentAddress);
    const formatted = ethers.utils.formatEther(amount);
    console.log(formatted);
    const price = await marketplaceContract.getPriceOfETH();

    console.log(ethers.utils.formatEther(price));
    console.log(ethers.utils.formatEther(amount));

    if (ethers.utils.formatEther(amount) >= ethers.utils.formatEther(price)) {
      console.log("trying to buy");
      //they can buy
      const pay = await marketplaceContract.payInETH({ value: price });
      console.log(pay);
      const receipt = await pay.wait();
      if (receipt.confirmations > 0) {
        setBought(pay);
        console.log(pay);
      }
    } else {
      console.log("Not enough eth" + amount + ":" + price);
      //they can't buy
    }
  };

  const payInUSDC = async () => {
    Connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const currentAddress = await provider.getSigner().getAddress();
    const marketplaceAddress = "0x96E955E8820B5e0f42A21F2d18fbeb49c40Be77c";
    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      ABI,
      signer
    );
    const token = new ethers.Contract(
      "0xE959831014074A78a0D523709786F201F1FF30f9",
      tokenABI,
      signer
    );

    const totalAmount = await token.balanceOf(currentAddress);
    const totalAllowed = await token.allowance(
      currentAddress,
      marketplaceAddress
    );
    const price = await marketplaceContract.price();

    console.log("TOTAL:" + totalAmount);
    console.log("ALLOWED:" + totalAllowed);
    console.log("PRICE:" + price);

    if (price <= totalAmount) {
      //They have enough to buy
      if (price <= totalAllowed) {
        //they can buy
        const purchase = await marketplaceContract.payInUSDC();
        setBought(purchase);
      } else {
        //they have enough money, but they need to allow it
        const approve = await token.approve(marketplaceAddress, price);
        const receipt = await approve.wait();
        if (receipt.confirmations > 0) {
          const purchase = await marketplaceContract.payInUSDC();
          setBought(purchase);
        }
      }
    } else {
      //they don't have enough to buy
    }
  };

  useEffect(() => {
    checkBought();
  }, []);
  return (
    <div className="card">
      <div class="card__image-container">
        <img src={props.imageURL} width="400" />
      </div>
      <div className="card__content">
        <p className="card__title text--medium">{props.name}</p>
        <div class="card__info">
          <p class="text--medium">{props.description} </p>
        </div>
        <div>
          <img class="buyIcon" src="https://imgur.com/MQHRBrg.png"></img>
          <img class="buyIcon" src="https://imgur.com/wndKTZS.png"></img>
          <img class="buyIcon" src="https://imgur.com/sQsv7UD.png"></img>
        </div>
        <div>
          <p class="card__price text__price">
            {props.price != null ? props.price : "Enter"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;
