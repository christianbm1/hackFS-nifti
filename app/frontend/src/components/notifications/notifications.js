import React from 'react';
import './styles.css';



export default function Notification(props){
    return(
        <div className={`${props.block ? 'notification-block' : ''}`}>
        <div className={`${props.position ? props.position : 'display-none'} notification-margin notification-container`} onClick={props.onClick}>
            <div className={`note ${props.note ? 'note-show' : 'note-noshow'} `}>Click to Dismiss</div>
            <div className='main-container'>
                <span>
                    {props.message}
                </span>
                <span className='notification-loading'>
                    {props.children}
                </span>
            </div>
        </div>
        </div>
    );
}