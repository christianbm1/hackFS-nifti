import React from 'react';
import './styles.css';

export default function ButtonDissmisable(props){
    return(
        <div className='container'>
            <div className='button-div'>
                <span>
                    {props.children}
                </span>
                <button onClick={props.onClick}>
                    <i class="fas fa-times"  />
                </button>
            </div>
        </div>

    )
}