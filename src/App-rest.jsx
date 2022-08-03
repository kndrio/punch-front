import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

//export default function
const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const constractAddress = "0xFc8dfb801E15656626E87b543a64510e716C924D";

  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try{    
    //check if window.ethereum is avaiable
    const { ethereum } = window;

    if(!ethereum){
      console.log('Install metamask!');
      return;
    }else {
      console.log("Ethereum object: ", ethereum);
    }

    //confirmation to use wallet 
      const accounts = await ethereum.request({ method: "eth_accounts"})

      if (accounts.length == 0){
        const account = accounts[0];
        console.log("Authorizated account:", account);
        setCurrentAccount(account)
      } else{
        console.log('Nenhuma conta ');
      }
    
    } catch (error) {
      console.log(error);
    }
  }

  //connecting
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        /*
        * Você está usando o contractABI aqui
        */
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de tchauzinhos...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        Oi Pessoal!
        </div>

        <div className="bio">
        Conecte sua Ethereum wallet e senta o braço !
        </div>

        <button className="waveButton" onClick={null}>
          Mandar 👊
        </button>
        {/*
        * If wallet is not connect..
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar carteira
          </button>
        )}
      </div>
    </div>
  );
}

export default App();