
import React from 'react';

class LocationItem extends React.Component {
   
     /*Render function */
     
    render() {
        return (
            <li role="button" className="blockitem" tabIndex="0" onKeyPress={this.props.openinfo.bind(this, this.props.data.marker)} onClick={this.props.openinfo.bind(this, this.props.data.marker)}>{this.props.data.longname}</li>
        );
    }
}

export default LocationItem;