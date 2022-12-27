import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { abi } from "utils/abi";

import {  useAccount, useContract, useSigner, useNetwork, useConnect, useDisconnect, useSwitchNetwork } from 'wagmi'

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

// var sha256 = require("js-sha256").sha256;
// const salt = "1234";

const contractAddress = "0xdDFB7620D78304125b0C3F77d8a3ad1c1f6c9984";

const ContractConnect = (props) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [dispMsg, setDispMsg] = useState("");
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { disconnect } = useDisconnect();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (!isConnected) return;
    if (chains.find((x) => x.id === chain?.id) > 0) return;

    switchNetwork && switchNetwork(1);
  }, [chain?.id, chains, isConnected, switchNetwork]);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      return alert("Wallet Not Connected");
      // return;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    setCurrentAccount(accounts[0]);

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      //   setDispMsg(`Wallet Connected: ${accounts[0]}`);
    } else {
      // setDispMsg("Account Not Found");
    }
  };

  const connectWalletHandler = async () => {

    const { ethereum } = window;
    if (!ethereum) {
        // return setDispMsg("Wallet Not Conntected");
      // return;
    }

    try {
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      setCurrentAccount(accounts[0]);
      // setDispMsg(`Wallet Connected`);
    } catch (e) {
      console.log(e);
      alert("Error, Wallet Not Connected");
    }
  };

  const disconnectWalletHandler = async () => {

    const { ethereum } = window;
    try {
      setCurrentAccount("");
      // setDispMsg("Wallet Disconnected");

    } catch (e) {
      console.log(e);
      alert("Error, Wallet Not Disconnected");
    }
  };

  const mintNftHandler = async () => {
    
    const infos = props.data;
    // setDispMsg("Checking Status");
    const tileUpdate = await axios.get(
      `https://map-api-shha8.ondigitalocean.app/map/getTile?x=${infos.x}&y=${infos.y}`
    );
    if (tileUpdate.data.status === "MINTED") {
      return alert("This Land is already MINTED !");
    } else if (tileUpdate.data.status === "BOOKED") {
      return alert("This Land is BOOKED by someone else !");
    } else if (tileUpdate.data.status === "NOT_FOR_SALE") {
      return alert("This Land is not for SALE !");
    } else if (tileUpdate.data.saleType === "Presale") {
      try {

        let tileData = tileUpdate.data
        let land_type;
        if (infos.landType === "Basic") {
          land_type = 0;
        } else if (infos.landType === "Platinum") {
          land_type = 1;
        } else if (infos.landType === "Prime") {
          land_type = 2;
        }
        
        // const { ethereum } = window;
        // if (ethereum) {
          setDispMsg("Minting ...");
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          // const chainId = signer.provider.provider.networkVersion;
          if (chain?.id === 1) {
            // const contract = new ethers.Contract(contractAddress, abi, signer);
          let x,y
          if (infos.x < 0) {
            x = -(infos.x - 5000)
          } else {
            x = infos.x
          }
          if (infos.y < 0) {
            y = -(infos.y - 5000)
          } else {
            y = infos.y
          }
          const proofData= {
            x:x,
            y:y,
            price:infos.price*(10**18),
            category:land_type,
            url:`ipfs://QmVg3BqbPGMDXLGKhgPZK3hdLzVeHJxksRiXmmzTGuV6hF/${infos.name}.json`
          } 
          let proof = await axios.post('https://map-api-shha8.ondigitalocean.app/map/getMerkleProof', proofData)
          console.log("Proof: ", proof.data)
          const price = Web3.utils.toWei((infos.price).toString(), 'ether')
          console.log("Connected Wallet: ", address)
          let nftTxn = await contract.buyLand(address, proof.data, x, y, land_type, proofData.url,{value: price}).catch((err)=>{
            console.log(err)
            if (chain?.id !== 1) {
              alert("Switch to Mainnet Network");
            } else if (err?.code == 4001) {
              alert("User rejected the transaction");
            } else if (err?.error?.code == -32000) {
              alert("Insufficient funds to complete the transaction");
            } else if (err?.code == 429) {
              alert(err.message);
            } else {
              console.log(err)
              alert("An error occured. Please Try again");
            }
          })
          setDispMsg(
            <p>Check Transaction <a style={{ color:"white"}} href={`https://etherscan.io/tx/${nftTxn.hash}`} target='_blank'>here</a></p>
          );
          tileData.status = "BOOKED"
          await axios.post(
                "https://map-api-shha8.ondigitalocean.app/map/updateTile",
                {x: infos.x, y:infos.y, update: tileData}
              );
          await nftTxn.wait(1).then(()=>{
                console.log(nftTxn);
                tileData.status = "MINTED" 
                axios.post(
                    "https://map-api-shha8.ondigitalocean.app/map/updateTile",
                    {x: infos.x, y:infos.y, update: tileData}
                  );
              }).catch((err) => {
                tileData.status = "FOR_SALE"
                axios.post(
                  "https://map-api-shha8.ondigitalocean.app/map/updateTile",
                  {x: infos.x, y:infos.y, update: tileData}
                );
                console.log(err)
              })
              
          
            
          } else {
            tileData.status = "FOR_SALE"
            axios.post(
              "https://map-api-shha8.ondigitalocean.app/map/updateTile",
              {x: infos.x, y:infos.y, update: tileData}
            );
            alert("Incorrect Network \nSwitch to Ethereum Mainnet")
          }
        // } else {
        //   alert("Wallet not connected");
        // }
      } catch (e) {
        let tileData = tileUpdate.data
        tileData.status = "FOR_SALE"
         axios.post(
            "https://map-api-shha8.ondigitalocean.app/map/updateTile",
            {x: infos.x, y:infos.y, update: tileData}
          );
          console.log(e);
      }
    }
    setDispMsg("");
  };

  const connectWalletButton = () => {
    return (
      <>
      {connectors.map((connector) => (
      <Button
        fullWidth
        sx={{
          background: "linear-gradient(92deg, #72FF79 2.65%, #4AFFDE 81.91%)",
          border: "1px solid #fff",
          borderRadius: "20px",
          marginBottom: "10px"
        }}
        key={connector.id}
        onClick={() => {
            if (connector.ready) {
              connect({ connector })
            } else {
              alert("To connect using metamask \n 1. Open this website in metamask mobile app \n 2. Click Wallet Connect below and select Metamask")
            }
          }
        }
      >
        <Typography variant="button" color="darkblue">
        {connector.name}
          {!connector.ready && ' (Open in Metamask Browser or click Wallet Connect below)'}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            ' (connecting)'}
        </Typography>
      </Button>
      
      ))}
      </>
    );
  };

  const mintNftButton = () => {
    return (
      <>
      <Button
        fullWidth
        sx={{
          background: "linear-gradient(92deg, #72FF79 2.65%, #4AFFDE 81.91%)",
          border: "1px solid #fff",
          borderRadius: "20px",
        }}
        disabled={Object.keys(props?.data)?.length === 0}
        onClick={mintNftHandler}
      >
        <Typography variant="button" color="darkblue">
          Mint Land
        </Typography>
      </Button><br/><br/>
      <Button
        fullWidth
        sx={{
          background: "none",
          border: "1px solid #fff",
          borderRadius: "20px",
        }}
        onClick={disconnect}
      >
        <Typography variant="button" color="white">
          Disconnect Wallet
        </Typography>
      </Button>
      </>
    );
  };

  // useEffect(() => {
  //   checkWalletIsConnected();
  // }, []);

  return (
    <div>
      {isConnected ? mintNftButton() : connectWalletButton()} <br />
      <Typography variant="body1" sx={{ color: "white" }}>
        {dispMsg}
      </Typography>
     
    </div>
  );
};

export default ContractConnect;
