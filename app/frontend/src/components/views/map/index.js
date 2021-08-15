import React from 'react';
import './styles.css';
import { Map, Marker } from "pigeon-maps";
import { stamenToner } from 'pigeon-maps/providers'
import data from '../../../data/data.json';

function markers(){ 
    for(var i=0; i < 20; i++ ){
        console.log(data[i]);
        <Marker width={50} anchor={[50.879, 4.6997 + (1.0 * 10)]} />;
    }
}

export default function MapBox (props) {
    return(
        <div className='map-container container'>
                <Map provider={stamenToner} dprs={[1, 2]} defaultCenter={[props.userLat, props.userLong]} defaultZoom={15}>
                    {
                        props.nftData.map(x => <Marker color={"#FF6666"}  width={50} anchor={[x.lat, x.long]} onClick={() => console.log(x.name)}/>)
                    }
                </Map>
        </div>
    );

}