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
import Button from './components/button/button.js';
import ButtonDismissable from './components/button/buttonDismissable.js';
import RangeComponent from './components/range/range.js';
import LoadingInit from './components/loading/loadinginit.js';
import Body from './components/body/body.js';
import Header from './components/header/index.js';
import Footer from './components/footer/index.js';
import MapBox from './components/views/map/index.js';
import Feed from './components/views/feed/index.js';
import Mint from './components/views/mint/index.js';
import Notification from './components/notifications/notifications.js';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';
import CeramicClient from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import factoryContract from './contracts/Factory.json';

import { createClient } from "@fluencelabs/fluence";
import { testNet } from "@fluencelabs/fluence-network-environment";
import { test } from "./utils/fluence/compiled/nifti.js";

const CERAMIC_API_URL = "https://ceramic-clay.3boxlabs.com/";

const ceramic = new CeramicClient(CERAMIC_API_URL);

const streamId = "kjzl6cwe1jw148d384e00juj0sho9r5er8ju462545afehveirvzjbraxkjrxwi";



const proxyAddress = '0x5536495a6e96BF1BB66F549372c4689bdeA84432';

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
  let [contract, setContract] = React.useState(new web3.eth.Contract(factoryContract.abi, proxyAddress));
  let [transactionStatus, setTransactionStatus] = React.useState();
  
  
  let [userLat, setUserLat] = React.useState(undefined);
  let [userLong, setUserLong] = React.useState(undefined);
  let [userLocationLoaded, setUserLocationLoaded] = React.useState(0);
  let [geoLocationDenied, setGeoLocationDenied] = React.useState(0);
  let [bypassWeb3, setBypassWeb3] = React.useState(0);
  let [networkChain, setNetworkChain] = React.useState(0);
  let [currentNftData, setCurrentNftData] = React.useState(undefined);

  
 async function getData(data){
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
      //console.log(w[0][0].result);
      setCurrentNftData(w[0][0].result);
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
    getData(out);
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
  return (
    <Router>
    <div className="App">
      <Header web3={web3React} connectWallet={connectWallet}/>
      <Body >
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
