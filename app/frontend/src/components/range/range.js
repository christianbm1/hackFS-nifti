import React from 'react';
import { Range } from 'react-range';

export default class RangeComponent extends React.Component {
 
    render() {
      return (
        <Range
          step={1}
          min={0}
          max={100}
          values={this.props.state}
          onChange={(values) => this.props.stateChange(values)}
          renderTrack={({ props, children }) => (
            <div
            {...props}
              style={{
                ...props.style,
                height: '6px',
                width: '100%',
                backgroundColor: `black`,
                marginBottom: '25px',
                marginRight: '10px',
                borderRadius: '5px'
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div {...props} style={{
                display: 'flex',
                flexDirection:'column',
                alignItems: 'center',
                paddingTop: '15px',
                outline: '0',
                
            }}>
            <div
              style={{
                ...props.style,
                position: 'relative',
                height: '15px',
                width: '15px',
                borderRadius: '100%',
                backgroundColor: `red`,
                border: 'solid 2px black',
                outline: '0',
              }}
            >
            
            </div>
            <div style={{
                position: 'relative',
                fontSize: '12px',
                fontWeight: 'bold',
                fontStyle: 'italic'
            }}>
                {this.props.state[0]}%
            </div>
            
            </div>
          )}
        />
      );
    }
  };