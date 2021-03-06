import React from 'react';
import './styles.css';
import { Map, Marker } from "pigeon-maps";
import { stamenToner } from 'pigeon-maps/providers'

export default function MapBox (props) {
    /*console.log(props);
    if(!props.userLat & !props.userLong){
        return (
            <div className='map-container container'></div>
        );
    }*/
    return(
        <div className='map-container container'>
                <Map provider={stamenToner} dprs={[1, 2]} defaultCenter={[props.userLat, props.userLong]} defaultZoom={15}>
                    {
                        props.nftData.length > 0 ? props.nftData.map(x => <Marker key={x.name} color={"#FF6666"}  width={50} anchor={[x.lat, x.long]} onClick={() => console.log(x.name)}/>) : ''
                    }
                </Map>
        </div>
    );

}