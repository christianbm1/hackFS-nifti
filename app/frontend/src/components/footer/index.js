import React from 'react';
import Button from '../button/button.js';
import ButtonDismissable from '../button/buttonDismissable.js';

export default function Header(props){
    return(
        <div className='fotter' style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px',
            paddingTop: '20px'
          }}>
            🍻🍻🍻 to 
            <span style={{fontWeight:'bold', color: '#3777FF', margin: '5px'}}>kurisu.argent.xyz</span>
          </div>
    )
}