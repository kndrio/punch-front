import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json"

//export default function
const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  //const contractAddress = "0xFc8dfb801E15656626E87b543a64510e716C924D"; //v0.1
  //const contractAddress = "0xB62A4506206d59632c01547e317af7CCD671666a"; //v0.2
  //const contractAddress = "0x6D14F831Bed9d53EBcf12E4a4838F2A9938F3562"; //v0.3
  const contractAddress = "0x41d2AE63f2D8862f78d02ceC91299508d7dD7Ec8"; //v.04
  const contractABI = abi.abi;

  const [message, setMessage] = useState("");

  const handleInput = event => {
      setMessage(event.target.value)
  }

  const getAllWaves = async () => {
    const {ethereum} = window;
    console.log('GettingAllWaves')

    try {
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = waves.map(wave => {
         return {
           address: wave.waver,
           timestamp: new Date(wave.timestamp * 1000),
           message: wave.message,
         };
        });

        setAllWaves(wavesCleaned);
      }else{
        console.log('Ethereum object not exist!')
      }
    } catch (error){
      console.log(error);
    }
  }
  
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
            getAllWaves()

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
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Recuperado o número de soquinhos...", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Minerando...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Minerado -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        
        console.log("Total de tchauzinhos recuperado...", count.toNumber());
      } else {
        console.log("Objeto Ethereum não encontrado!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if(window.ethereum){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave)
    }
    //checkIfWalletIsConnected();

    return () => {
      if (wavePortalContract){
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        The Puncher Portal
        </div>

        <div className="bio">
        Conecte sua Ethereum wallet e senta o braço !
        </div>
        <div>
          <input type="text" name="message" onChange={handleInput} placeholder="Enter your punch message!" style={{width:'100%'}}>
          </input>
        </div>

          <button className="waveButton" onClick={wave}>
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

        {allWaves.map((wave,index) => {
          return(
             <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {wave.address}</div>
              <div>Data/Horário: {wave.timestamp.toString()}</div>
              <div>Mensagem: {wave.message}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
export default App;