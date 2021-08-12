import React from 'react';
import './styles.css';

function videoTemplate(props){
    return(
        <div></div>
    )
}

function audioTemplate(props){
    return(
        <div></div>
    )
}

function imageTemplate(props){
    return(
        <div></div>
    )
}

function textTemplate(props){
    return(
        <div className='media-container audio'>
            <img 
                src='https://www.loc.gov/static/images/original-format/sound-recording.png'
            />
            <div className='audio-metadata'>
                <span className='audio-metadata-title'>Motombo on Grass</span>
                <span className='audio-metadata-desc'>
                When you feeling  down and you cant succeed. when you not and you can
                When you feeling  down and you cant succeed. when you not and you can
                When you feeling  down and you cant succeed. when you not and you can
                When you feeling  down and you cant succeed. when you not and you can
                </span>
            </div>
            <span className='media-stat-interact'>
                <label onClick={() => console.log('clap')}>👏</label>
                <label onClick={() => console.log('yawn')}>🥱</label>
            </span>
        </div>
    )
}

export default function Feed(props){
    return(
        <div className='feed-container container'>
        {textTemplate()}
        </div>
    );
}