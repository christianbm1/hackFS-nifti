import React from 'react';
import './styles.css';
import RingLoader from "react-spinners/RingLoader";

export default function LoadingInit(props){
    return(
        <div className='init-loading-container'>
            <div className='loading-main'>
                <span>
                    <RingLoader color={'red'} css={`border: 100`} size={150} />
                </span>
               {props.geoLocationDenied == 0 ?
                    <React.Fragment>
                        <label>Welcome to NiFTi </label> 
                        <label>. . . Our Computers are Putin' . . . </label> 
                    </React.Fragment> : 
                    <React.Fragment>
                        <label className='error-label'> Unable to get your Location. </label>
                        <div className='error-icon'><i class="fas fa-heart-broken"></i></div>
                    </React.Fragment>
                }
                
            </div>
            <div className='loading-foot'>
                Please ensure you've enabled the device to locate your location.
            </div>
            
        </div>
    );
}