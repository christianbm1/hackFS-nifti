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

function ImageTemplate(props){
    let [drawerActive, setDrawerActive] = React.useState(0);
    return(
        <div className='proxy-container'>
            <div className='media-container image'>
                <div className='image-metadata'>
                    <img src='http://www.coogfans.com/uploads/db5902/original/3X/8/1/81173237ffa580ef710b0862fdddaac163274db1.jpeg' />
                </div>
                <div className='drawer-control' onClick={() => setDrawerActive(drawerActive ? 0 : 1)}>
                    <i class="fas fa-chevron-up"></i>
                </div>
            </div>
            <div className={`content-drawer ${drawerActive ? 'content-drawer-show content-drawer-animation-show ' : 'content-drawer-noshow content-drawer-animation-noshow'}`}>
                <span className='media-stat-interact'>
                    <div className='metadata-title'>
                        E   lmor fudg
                    </div>
                    <div className='content-controls'>
                        <label onClick={() => console.log('clap')}>👏</label>
                        <label onClick={() => console.log('yawn')}>🥱</label>
                    </div>
                </span>
                <div className='image-text-metadata'>
                    <div className='metadata-desc'>
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    </div>
                </div>
                <div className='drawer-control' onClick={() => setDrawerActive(drawerActive ? 0 : 1)}>
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
        </div>
    );
}

function VideoTemplate(props){
    let [drawerActive, setDrawerActive] = React.useState(0);
    return(
        <div className='proxy-container'>
            <div className='media-container video' >
                <div className='video-metadata'>
                    <video controls>
                        <source src='https://ipfs.io/ipfs/bafybeib7nqahfksohezafrlenzrvlwlmojih4q2qbob2vzusame7t2ipbi' />
                    </video>
                    {/*
                                        <iframe
                        src="https://www.youtube.com/embed/tgbNymZ7vqY">
                    </iframe>
                    */}
                </div>
                <div className='drawer-control' onClick={() => setDrawerActive(drawerActive ? 0 : 1)}>
                    <i class="fas fa-chevron-up"></i>
                </div>
            </div>
            <div className={`content-drawer ${drawerActive ? 'content-drawer-show content-drawer-animation-show ' : 'content-drawer-noshow content-drawer-animation-noshow'}`}>
                <span className='media-stat-interact'>
                    <div className='metadata-title'>
                        E   lmor fudg
                    </div>
                    <div className='content-controls'>
                        <label onClick={() => console.log('clap')}>👏</label>
                        <label onClick={() => console.log('yawn')}>🥱</label>
                    </div>
                </span>
                <div className='image-text-metadata'>
                    <div className='metadata-desc' onClick={() => setDrawerActive(drawerActive ? 0 : 1)}>
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    When you feeling  down and you cant succeed. when you not and you can
                    </div>
                </div>
                <div className='drawer-control' onClick={() => setDrawerActive(drawerActive ? 0 : 1)}>
                    <i class="fas fa-chevron-down"></i>
                </div>
                
            </div>
        </div>
    );
}

function textTemplate(props){
    return(
        <div className='media-container audio'>
            <img 
                src='https://www.loc.gov/static/images/original-format/sound-recording.png'
            />
            <div className='audio-metadata'>
                <span className='audio-metadata-title'>Motombo on Grass</span>
                <span className='metadata-desc'>
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
        <ImageTemplate />
        <VideoTemplate />
        <ImageTemplate />
        <ImageTemplate />
        <ImageTemplate />
        </div>
    );
}