import { BigNumber, ethers, Signer } from "ethers";
import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";
import { useState } from "react";
import { address } from "./contracts/address.json";
import { abi } from "./contracts/abi.json";
import { abi as myBankabi } from "./contracts/mybank/myBankabi.json";
import { address as myBankaddress } from "./contracts/mybank/myBankaddress.json";

import { Greeter } from "../../typechain-types/Greeter";
import { MyBank } from "../../typechain-types/MyBank";

let prodivder: JsonRpcProvider;
let signer: JsonRpcSigner;
let greeterContract: Greeter;
let bankContract: MyBank;

function App() {
  const [walletAddress, setWalletAddress] = useState("0x");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState(0);

  let [balance, setBalance] = useState("");

  async function connect() {
    // prodivder = new ethers.providers.Web3Provider(window.ethereum);
    prodivder = new ethers.providers.JsonRpcProvider();

    signer = prodivder.getSigner();
    setWalletAddress(await signer.getAddress());

    //create contract instance
    greeterContract = new ethers.Contract(address, abi, signer) as Greeter;
    bankContract = new ethers.Contract(
      myBankaddress,
      myBankabi,
      signer
    ) as MyBank;

    setBalance(`${await bankContract.getBalance()}`);
  }

  const getBalance = async () => {
    if (bankContract === undefined) {
      setStatus("please firstly reconnect wallet");
    } else {
      setBalance(`${await bankContract.getBalance()}`);
    }
  };

  const onDeposite = async (amount: number) => {
    if (bankContract === undefined) {
      setStatus("please firstly reconnect wallet");
    } else {
      await bankContract.deposite(amount);
      balance = `${Number(balance) + amount}`;
      setBalance(balance);
    }
  };

  const onWithdraw = async (amount: number) => {
    if (bankContract === undefined) {
      setStatus("please firstly reconnect wallet");
    } else {
      await bankContract.withdraw(amount);
      balance = `${Number(balance) - amount}`;
      setBalance(balance);
    }
  };

  const greet = async () => {
    if (greeterContract === undefined) {
      setStatus("please firstly reconnect wallet");
    } else {
      setStatus(await greeterContract.greet());
    }
  };

  const setGreet = async () => {
    if (greeterContract === undefined) {
      setStatus("please firstly reconnect wallet");
    } else {
      console.log("message", message);

      const tx = await greeterContract.connect(signer).setGreeting(message);
      await tx.wait();
      setStatus("write to block successfully");
    }
  };

  return (
    <>
      <div>
        Hello
        <h1>{walletAddress}</h1>
      </div>
      <div>status: {status}</div>
      <button onClick={() => connect()}>Connect</button>
      <input type="text" onChange={(e) => setMessage(e.target.value)}></input>
      <div>
        <button onClick={() => setGreet()}>set</button>
        <button onClick={() => greet()}>Get</button>
      </div>
      <hr />
      <div>
        <h1>{balance}</h1>
        <input
          type="number"
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />
        <button onClick={() => onDeposite(amount)}>Deposite</button>
        <button onClick={() => onWithdraw(amount)}>withdraw</button>
      </div>
    </>
  );
}

export default App;
