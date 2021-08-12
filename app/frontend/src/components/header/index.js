import React from 'react';
import Button from '../button/button.js';
import ButtonDismissable from '../button/buttonDismissable.js';
import './styles.css';

export default function Header(props){
    return(
        <div className='header'>
          <div className='header-logo'>
            <img src="/nifti_logo_sm.png"></img>
          </div>
        </div>
    )
}

/*
        {
          props.web3.account ? 
          <ButtonDismissable onClick={props.connectWallet}>Using Account: {props.web3.account.substring(0, 15) + "..."}</ButtonDismissable>
          /*<Button theme='connected' onClick={connectWallet} >{web3React.account.substring(0, 15) + "..."}</Button> */
          //: 
          //<Button theme='main' onClick={props.connectWallet} >Connect MetaMask </Button>
        //}