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
                    <img src={`https://${props.data.content_cid}.ipfs.dweb.link/${props.data.content_filename}` }/>
                </div>
                <div className='drawer-control' onClick={() => setDrawerActive(drawerActive ? 0 : 1)}>
                    <i class="fas fa-chevron-up"></i>
                </div>
            </div>
            <div className={`content-drawer ${drawerActive ? 'content-drawer-show content-drawer-animation-show ' : 'content-drawer-noshow content-drawer-animation-noshow'}`}>
                <span className='media-stat-interact'>
                    <div className='metadata-title'>
                       {props.data.name}
                    </div>
                    <div className='content-controls'>
                        <label onClick={() => console.log('clap')}>👏</label>
                        <label onClick={() => console.log('yawn')}>🥱</label>
                    </div>
                </span>
                <div className='image-text-metadata'>
                    <div className='metadata-desc'>
                        {props.data.desc}
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
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                    asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
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
                <span className='audio-metadata-title'>aassasa aa ewewewe</span>
                <span className='metadata-desc'>
                asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
                asdf wed saxfwef  asax aff bbb bbbb bbbbbbb. bbbb bbb bbb bbb bbb bbb
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
        {
            props.data.map((x) => <ImageTemplate data={x} />)
        }
        </div>
    );
}