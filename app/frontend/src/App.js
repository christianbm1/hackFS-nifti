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
import { test } from "./utils/fluence/compiled/nifti.js";

//Web3.Storage
import { NFTStorage, File } from 'nft.storage';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFiNjY3NTA0QjkxMURCZjZFNzNjN0IxNUNGQUYyNTVmYzlBM2ZENTEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyOTAyNzQ4MzI5NywibmFtZSI6Im5pZnRpZm9yZXZlcnlvbmUifQ.Ps0j3DUwuO0GFRPttgHjeS8KP9iLw0SJ62oeLTvyXss';
const client = new NFTStorage({ token: apiKey })

const CERAMIC_API_URL = "https://ceramic-clay.3boxlabs.com/";

const ceramic = new CeramicClient(CERAMIC_API_URL);

//const streamId = "kjzl6cwe1jw148d384e00juj0sho9r5er8ju462545afehveirvzjbraxkjrxwi";

const nftContractAddress = '0xD2386f2818FA8375b93cbd7f80F81c59f995e8a7';

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet
    3, // Ropsten
    4, // Rinkeby
    5, // Goerli
    42, // Kovan
    137, // Matic Mainnet
  ],
});


function ListItem(props){
  return(
    <li className={`${props.vertical ? 'item itemv' : 'item itemh'}`}>
      <div className='item-left'>
        {props.label}:
      </div>
      <div className='item-right'>
        {props.children}
      </div>
    </li>
  );
}

function NotificationSwitch(control, stateChageFn){
  switch(control){
      case 1:
        return (
          <Notification position='bottom-right' message='Pending' block='1'>
            <BounceLoader loading={1}  />
          </Notification>
        )
      case 0:
        return (
          <Notification position='bottom-right' message='Txn Fail' note='1' onClick={() => stateChageFn()}>
            <span>
              <i class="fas fa-times" style={{color: 'red'}}/>
            </span>
          </Notification>
        )
      case 9:
        return (
          <Notification position='bottom-right' message='Success' note='1' onClick={() => stateChageFn()}>
          <span>
            <i class="fas fa-check" style={{color: 'green'}}/>
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
  let [contract, setContract] = React.useState(new web3.eth.Contract(factoryContract.abi, nftContractAddress));
  let [transactionStatus, setTransactionStatus] = React.useState();
  let [userLat, setUserLat] = React.useState(undefined);
  let [userLong, setUserLong] = React.useState(undefined);
  let [userLocationLoaded, setUserLocationLoaded] = React.useState(0);
  let [geoLocationDenied, setGeoLocationDenied] = React.useState(0);
  let [bypassWeb3, setBypassWeb3] = React.useState(0);
  let [networkChain, setNetworkChain] = React.useState(0);
  let [currentNftData, setCurrentNftData] = React.useState(undefined);
  let [nftDeployedAddress, setNftDeployedAddress] = React.useState(undefined);

  function saveCoordsNft(){
    fetch('https://9e051238b990.ngrok.io/crtRec', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userLat: userLat,
        userLong: userLong,
        uri: 'uri'
      })
    });
  }

  async function mintNFT(name, desc, file){
    let uri = await saveNFT(name, desc, file);
    //console.log(uri.url);

    try {
      saveCoordsNft(uri);
      setTransactionStatus(1);
      await contract.methods.mintNFT(
        web3React.account,
        uri.url
        ).send({ from:web3React.account, gasLimit: 2000000}).then((receipt) => {
          console.log(receipt);
          //setNftDeployedAddress(receipt.evets.['0'].address)
          setTransactionStatus(9);
        });
    } catch(e){
      console.log(e);
      setTransactionStatus(0);
    }
  }
  
  async function saveNFT(name, desc, file){
    let metadata = await client.store({
      name: name,
      description: desc,
      image: new File([file], file.name, { type: file.type })
    });
    return metadata;
  }
  async function getData(data){
      console.log(data);
      const client = await createClient(testNet[1]);
      
      let w = await test(client, 
        "12D3KooWFEwNWcHqi9rtsmDhsYcDbRUCDXH84RC4FW6UfsFWaoHi", 
        "3e4924f0-8a65-40d4-a743-7451eda9918d",
        data,
        userLat,
        userLong,
        1000.00,
        ""
        );
      console.log(w);
      setCurrentNftData(w[0][0].result);

      await client.disconnect();
  };

  async function loadCeramicStream(){
    let out = []
    let db = await TileDocument.load(ceramic, "kjzl6cwe1jw149nt5bsoyni2pd74yoemp43k8g6kr789lebgklj3jjx2ps0qngv");
    //const stream = await ceramic.loadStream(db);
    let streamData = await ceramic.multiQuery(db.content.data);
    let keys = Object.keys(streamData);
    keys.forEach(key => {
        out.push({...streamData[key].content, "key": key});
    });
    /*let filteredD;
    //filteredD = await getData(out);
    if(filteredD !== undefined){
      setCurrentNftData(filteredD[0][0].result);
    } else {
      setCurrentNftData(out);
    }*/
    setCurrentNftData(out);
  }

  React.useEffect(async () => {
    await loadCeramicStream();
  }, []);

  async function connectWallet(){
    if(!walletConnected){
      web3React.activate(injectedConnector);
    } else {
      web3React.deactivate();
    }
  }

  React.useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      setUserLat(position.coords.latitude);
      setUserLong(position.coords.longitude);
      setTimeout(() => setUserLocationLoaded(1), 5000);
    }, function(err){
        setGeoLocationDenied(1);
      console.log(err);
    });
  }, []);

  React.useEffect(() => {
    if(web3React.account){
      setWalletConnected(1);
      setNetworkChain(web3React.chainId);
    } else {
      setWalletConnected(0);
      setNetworkChain(0);
    }
  }, [web3React.account]);

  React.useEffect(() => {
    console.log(bypassWeb3);
    console.log('bypassWeb3 clicked');
  }, [bypassWeb3]);

  if(!currentNftData){
    return <LoadingInit geoLocationDenied={geoLocationDenied}/>;
  }
  /*<input type="file" onChange={this.onFileChange} />
  <button onClick={this.onFileUpload}>
  Upload!
</button>*/
  return (
    <Router>
    <div className="App">
    
      <Header web3={web3React} connectWallet={connectWallet}/>
      <Body >
      <button onClick={saveCoordsNft}>ssss</button>
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
              <Feed />
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
