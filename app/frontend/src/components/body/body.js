import React from 'react';
import './styles.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";

export default function Body(props){
    let [menuOptionActive, setMenuOptionActive] = React.useState(1);
    return(
        <div className='body-main'>
            <div className='view-container'>
                <div className='view-controller'>
                    <ul>
                        <Link onClick={() => setMenuOptionActive(1)} to={"/"}><li className={`menu-option ${menuOptionActive == 1 ? null : 'container'}`}>
                            <span><i class="far fa-map"></i></span>
                            <label>Explore</label>
                        </li></Link>
                        <Link onClick={() => setMenuOptionActive(2)} to={"/feed"}><li className={`menu-option ${menuOptionActive == 2 ? null : 'container'}`}>
                            <span><i class="fas fa-layer-group"></i></span>
                            <label>Feed</label>
                        </li></Link>
                        <Link onClick={() => setMenuOptionActive(3)} to={"/mint"}><li className={`menu-option ${menuOptionActive == 3 ? null : 'container'}`}>
                            <span><i class="far fa-plus-square"></i></span>
                            <label>Mint</label>
                        </li></Link>
                    </ul>
                </div>
                {props.children}
            </div>
        </div>
    )
}