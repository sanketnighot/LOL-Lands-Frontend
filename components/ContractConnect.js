import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { abi } from "utils/abi";
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

// var sha256 = require("js-sha256").sha256;
// const salt = "1234";

const contractAddress = "0xb13fc678ba17237A28DB894B295914D5Df379116";

const ContractConnect = (props) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [dispMsg, setDispMsg] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      return setDispMsg("Wallet Not Connected");
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
        return setDispMsg("Wallet Not Conntected");
      // return;
    }

    try {
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      setCurrentAccount(accounts[0]);
      setDispMsg(`Wallet Connected`);
    } catch (e) {
      console.log(e);
      setDispMsg("Error, Wallet Not Connected");
    }
  };

  const disconnectWalletHandler = async () => {

    const { ethereum } = window;
    try {
      setCurrentAccount("");
      setDispMsg("Wallet Disconnected");

    } catch (e) {
      console.log(e);
      setDispMsg("Error, Wallet Not Disconnected");
    }
  };

  const mintNftHandler = async () => {
    
    const infos = props.data;
    // setDispMsg("Checking Status");
    const tileUpdate = await axios.get(
      `https://lolmapapi-k9mkf.ondigitalocean.app/map/getTile?x=${infos.x}&y=${infos.y}`
    );
    if (tileUpdate.data.status === "MINTED") {
      return setDispMsg("This tile is already MINTED !");
    } else if (tileUpdate.data.status === "BOOKED") {
      return setDispMsg("This tile is BOOKED by someone else !");
    } else if (tileUpdate.data.status === "NOT_FOR_SALE") {
      return setDispMsg("This tile is not for SALE !");
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
        
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const chainId = signer.provider.provider.networkVersion;
          if (chainId === "80001") {
            const contract = new ethers.Contract(contractAddress, abi, signer);
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
          tileData.status = "BOOKED"
          axios.post(
              "https://lolmapapi-k9mkf.ondigitalocean.app/map/updateTile",
              {x: infos.x, y:infos.y, update: tileData}
            );
          setDispMsg("Minting ...");
          let nftTxn = await contract.createLand(currentAccount, x, y, land_type).catch((err)=>{
            tileData.status = "FOR_SALE"
            axios.post(
              "https://lolmapapi-k9mkf.ondigitalocean.app/map/updateTile",
              {x: infos.x, y:infos.y, update: tileData}
            );
            console.log(err)
            alert("Error! Try again \n User Rejected")
          })
          console.log(nftTxn);
          tileData.status = "MINTED" 
           axios.post(
              "https://lolmapapi-k9mkf.ondigitalocean.app/map/updateTile",
              {x: infos.x, y:infos.y, update: tileData}
            );
            setDispMsg(
            <p>Check Txn <a style={{ color:"white"}} href={`https://mumbai.polygonscan.com/tx/${nftTxn.hash}`} target='_blank'>here</a></p>
          );
          } else {
            tileData.status = "FOR_SALE"
            axios.post(
              "https://lolmapapi-k9mkf.ondigitalocean.app/map/updateTile",
              {x: infos.x, y:infos.y, update: tileData}
            );
            alert("Incorrect Network \nSwitch to Polygon Mumbai Testnet")
          }
        } else {
          alert("Wallet not connected");
        }
      } catch (e) {
        setDispMsg("Error ! Try Again");
        let tileData = tileUpdate.data
        tileData.status = "FOR_SALE"
         axios.post(
            "https://lolmapapi-k9mkf.ondigitalocean.app/map/updateTile",
            {x: infos.x, y:infos.y, update: tileData}
          );
          console.log(e);
          alert("Error! Try Again")
      }
    }
  };

  const connectWalletButton = () => {
    return (
      <Button
        fullWidth
        sx={{
          background: "linear-gradient(92deg, #72FF79 2.65%, #4AFFDE 81.91%)",
          border: "1px solid #fff",
          borderRadius: "20px",
        }}
        onClick={connectWalletHandler}
      >
        <Typography variant="button" color="darkblue">
          Connect Wallet
        </Typography>
      </Button>
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
          {(dispMsg === "Minting ...")?"Minting ...":"Mint Land"}
        </Typography>
      </Button><br/><br/>
      <Button
        fullWidth
        sx={{
          background: "none",
          border: "1px solid #fff",
          borderRadius: "20px",
        }}
        onClick={disconnectWalletHandler}
      >
        <Typography variant="button" color="white">
          Disconnect Wallet
        </Typography>
      </Button>
      </>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);
  return (
    <div>
      {currentAccount ? mintNftButton() : connectWalletButton()} <br />
      <Typography variant="body1" sx={{ color: "white" }}>
        {dispMsg}
      </Typography>
    </div>
  );
};

export default ContractConnect;
