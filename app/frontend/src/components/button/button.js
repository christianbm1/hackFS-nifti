import React from 'react';
import './styles.css';

export default function Button(props){

    return(
        <div className='container'>
        {
            props.disabled == '1' ?
            <button disabled style={{backgroundColor: '#ccc'}}>
                <span>{props.children}</span>
            </button>
            :
            <button className={`${props.theme == 'main' ? 'main' : props.theme == 'action' ? 'action' : 'connected'}`} onClick={props.onClick}>
                <span>{props.children}</span>
            </button>
        }

        </div>
    )
}