import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import './App.css';
import BounceLoader from "react-spinners/BounceLoader";
import LoadingInit from './components/loading/loadinginit.js';
import Body from './components/body/body.js';
import Header from './components/header/index.js';
import Footer from './components/footer/index.js';
import MapBox from './components/views/map/index.js';
import Feed from './components/views/feed/index.js';
import Mint from './components/views/mint/index.js';
import Notification from './components/notifications/notifications.js';
import factoryContract from './contracts/NFTFactory.json';
//Web3
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';

//Ceramic
import CeramicClient from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';

//Fluece
import { createClient } from "@fluencelabs/fluence";
import { testNet } from "@fluencelabs/fluence-network-environment";
import { nifti_proximity_filter } from "./utils/fluence/compiled/nifti.js";

//Web3.Storage
import { NFTStorage, File } from 'nft.storage';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFiNjY3NTA0QjkxMURCZjZFNzNjN0IxNUNGQUYyNTVmYzlBM2ZENTEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTAyNzQ4MzI5NywibmFtZSI6Im5pZnRpZm9yZXZlcnlvbmUifQ.Ps0j3DUwuO0GFRPttgHjeS8KP9iLw0SJ62oeLTvyXss';
const client = new NFTStorage({ token: apiKey })

const CERAMIC_API_URL = "https://ceramic-clay.3boxlabs.com/";

const ceramic = new CeramicClient(CERAMIC_API_URL);

//const streamId = "kjzl6cwe1jw148d384e00juj0sho9r5er8ju462545afehveirvzjbraxkjrxwi";

const nftContractAddress = '0x0425dDdc40d73E485ecd5aC25bd787b588f6f109';

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    137, // Matic Mainnet
    80001, //Mumbai
  ],
});


function NotificationSwitch(control, stateChageFn){
  switch(control){
      case 1:
        return (
          <Notification position='bottom-right' message='Saving Data' block='1'>
            <BounceLoader loading={1}  />
          </Notification>
        )
      case 2:
        return (
          <Notification position='bottom-right' message='Minting NFT' block='1'>
            <BounceLoader loading={1}  />
          </Notification>
        )
      case 0:
        return (
          <Notification position='bottom-right' message='Mint Failed' note='1' onClick={() => stateChageFn()}>
            <span>
              <i class="fas fa-times" style={{color: 'red'}}/>
            </span>
          </Notification>
        )
      case 9:
        return (
          <Notification position='bottom-right' message='Success!' note='1' onClick={() => stateChageFn()}>
          <span>
            <i class="fas fa-check" style={{color: 'green'}}/>
          </span>
          </Notification>
        )
        case 10:
          return (
            <Notification position='bottom-right' message='Wrong Network' note='1' onClick={() => stateChageFn()}>
              <span>
                <i class="fas fa-times" style={{color: 'red'}}/>
              </span>
            </Notification>
          )
      default :
        return (
          ''
        )
  }
}

function App() {
  const web3React = useWeb3React();
  const web3 = new Web3(Web3.givenProvider);
  let [walletConnected, setWalletConnected] = React.useState(0);
  let [contract, setContract] = React.useState(undefined);
  let [chainIdCompatability, setChainIdCompatability] = React.useState(undefined);
  let [transactionStatus, setTransactionStatus] = React.useState();
  let [userLat, setUserLat] = React.useState(undefined);
  let [userLong, setUserLong] = React.useState(undefined);
  let [userLocationLoaded, setUserLocationLoaded] = React.useState(0);
  let [geoLocationDenied, setGeoLocationDenied] = React.useState(0);
  let [bypassWeb3, setBypassWeb3] = React.useState(0);
  let [networkChain, setNetworkChain] = React.useState(0);
  let [currentNftData, setCurrentNftData] = React.useState(undefined);

  async function getMetaDataUrl(url){
    fetch(url)
    .then(response => response.json())
    .then((jsonData) => {
      return jsonData;
    })
    .catch((error) => {
      console.error(error)
    });
  }
  async function saveCoordsNft(uLat, uLong, metadata_url, content_cid, content_filename, file_type, name, desc, tokenId, txnHash, nsfw){
    fetch('https://04178543ba7d.ngrok.io/crtRec', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        desc: desc,
        lat: uLat,
        long: uLong,
        metadata_url: metadata_url,
        content_cid: content_cid,
        content_filename: content_filename,
        content_type: file_type,
        nftContractAddress: nftContractAddress,
        ownerAddress: web3React.account,
        chainId: networkChain,
        tokenId: parseInt(tokenId),
        category:1,
        txnHash:txnHash,
        nsfw: nsfw
      })
    })
    .then((response) => {
      console.log(response);
      loadCeramicStream();
      setTransactionStatus(9);
    })
    .catch((error) => {
      console.error(error);
    });
  }
  async function mintNFT(name, desc, file, nsfw){
    let metadata = await saveNFT(name, desc, file);
    console.log(metadata[0]);
    console.log(metadata[0].data.image.pathname);
    //let content_url = await getMetaDataUrl(metadata[0].url);
    try {
      setTransactionStatus(2);
      await contract.methods.mintNFT(
        web3React.account,
        metadata[0].url
        ).send({ from:web3React.account, gasLimit: 2000000}).then((receipt) => {
          saveCoordsNft(
            userLat, 
            userLong, 
            metadata[0].url, 
            metadata[0].data.image.pathname.split('//')[1].split('/')[0],
            metadata[0].data.image.pathname.split('//')[1].split('/')[1], 
            metadata[3], 
            metadata[1], 
            metadata[2],
            receipt.events.Transfer.returnValues.tokenId,
            receipt.transactionHash,
            nsfw
          );
          //setNftDeployedAddress()
        });
    } catch(e){
      console.log(e);
      setTransactionStatus(0);
    }
  };
  async function saveNFT(name, desc, file){
    setTransactionStatus(1);
    let metadata = await client.store({
      name: name,
      description: desc,
      image: new File([file], file.name, { type: file.type })
    });
    return [metadata, name, desc, file.type];
  };
  async function getData(data){
      const client = await createClient(testNet[1]);
      
      let w = await nifti_proximity_filter(client, 
        "12D3KooWFEwNWcHqi9rtsmDhsYcDbRUCDXH84RC4FW6UfsFWaoHi", 
        "fe706e05-d00c-4310-9c30-4415abb48ae9",
        data,
        userLat,
        userLong,
        1000.00,
        ""
        );
      //console.log(w);
      setCurrentNftData(w[0][0].result);
      await client.disconnect();
  };
  async function loadCeramicStream(){
    let out = []
    let db = await TileDocument.load(ceramic, "kjzl6cwe1jw149nt5bsoyni2pd74yoemp43k8g6kr789lebgklj3jjx2ps0qngv");
    let streamData = await ceramic.multiQuery(db.content.data);
    let keys = Object.keys(streamData);
    keys.forEach(key => {
        out.push({...streamData[key].content, "key": key});
    });
    
    if(out.length > 0){
      await getData(out);
    } else {
      setCurrentNftData(out);
    }
  }
  React.useEffect(async () => {
    if(userLat & userLong){
      await loadCeramicStream();
    }
  }, [userLat, userLong]);
  React.useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      setUserLat(position.coords.latitude);
      setUserLong(position.coords.longitude);
      setTimeout(() => setUserLocationLoaded(1), 5000);
    }, function(err){
        setGeoLocationDenied(1);
    });
  }, []);

  React.useEffect(() => {
    console.log(bypassWeb3);
    console.log('bypassWeb3 clicked');
  }, [bypassWeb3]);

  async function connectWallet(){
    setWalletConnected(0);
    if(!walletConnected){
      console.log('connect wallet')
      web3React.activate(injectedConnector);
    } else {
      web3React.deactivate();
    }
  }

  React.useEffect(() => {
    if(web3React.account){
      setContractToCorrectChain(web3React.chainId);
      console.log(web3React);
    } else {
      setWalletConnected(0);
      setNetworkChain(0);
    }
  }, [web3React.account]);

  async function setContractToCorrectChain(chainId){
    console.log(chainId);
    switch(chainId){
      /*case 0:
        setChainIdCompatability(0);
        setContract(undefined);*/
      /*case 1:
        setContract(new web3.eth.Contract(factoryContract.abi, nftContractAddress));*/
      case 42: {
        setContract(new web3.eth.Contract(factoryContract.abi, '0xd2386f2818fa8375b93cbd7f80f81c59f995e8a7'));
        setWalletConnected(1);
        setNetworkChain(chainId);
        setChainIdCompatability(1);
        console.log('kovan');
        break;
      }
      /*case 137:
          setContract(new web3.eth.Contract(factoryContract.abi, nftContractAddress));*/
      case 80001: {
        setContract(new web3.eth.Contract(factoryContract.abi, '0x0425dDdc40d73E485ecd5aC25bd787b588f6f109'));
        setWalletConnected(1);
        setNetworkChain(chainId);
        setChainIdCompatability(1);
        console.log('mumbai');
        break;
      }
      default : {
        setWalletConnected(0);
        setNetworkChain(0);
        setChainIdCompatability(0);
        setContract(undefined);
        web3React.deactivate();
        console.log('default');
        break;
      }
    }
  }

  if(userLocationLoaded == 0 || currentNftData == undefined){
    return <LoadingInit geoLocationDenied={geoLocationDenied}/>;
  }

  return (
    <Router>
    <div className="App">
      <Header web3={web3React} connectWallet={connectWallet}/>
      <Body>
        <Switch>
            <Route path="/mint">
              <Mint 
                walletConnected={walletConnected} 
                web3={web3React} 
                connectWallet={connectWallet} 
                bypassWeb3={bypassWeb3}
                setBypassWeb3={setBypassWeb3}
                userLat={userLat}
                userLong={userLong}
                networkChain={networkChain}
                saveNFT={mintNFT}
              />
            </Route>
            <Route path="/feed">
              <Feed data={currentNftData}/>
            </Route>
            <Route default path="/">
              <MapBox userLat={userLat} userLong={userLong} nftData={currentNftData}/>
            </Route>
          </Switch>
      </Body>
      
      <Footer />
      
      <div className='help'>
        <a href='https://www.notion.so/NiFTi-FAQs-df2f9f05550143d0ac2bf71dfb7d5b05' target='_blank'><i class="fas fa-question" style={{padding: '15px', fontSize: '20px'}} /></a>
      </div>
      {/*<div className={`connect-wallet-module ${!walletConnected ? 'connect-wallet-module-display-on' : 'connect-wallet-module-display-off'}`}>
      </div>*/}
        {NotificationSwitch(transactionStatus, setTransactionStatus)}
    </div>
    </Router>
  );
}

export default App;
