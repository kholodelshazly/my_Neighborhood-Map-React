
import React, {Component} from 'react';
import LocationItem from './LocationItem';

class LocationList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'places': '',
            'q': '',
            'sugg': true,
        };

        this.filterL = this.filterL.bind(this);
        this.suggtoggel = this.suggtoggel.bind(this); 
    }


    /*show and hide places*/
    suggtoggel() {
        this.setState({
            'sugg': !this.state.sugg
        });
    }

    
     /* Filter places*/
     
    filterL(event) {
        this.props.closein();
        const {value} = event.target;
        var places = [];
        this.props.placess
        .forEach(function (place) {
            if (place.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                place.marker.setVisible(true);
                places.push(place);
            } else {
                place.marker.setVisible(false);
            }
        });

        this.setState({
            'places': places,
            'q': value
        });
    }




    componentWillMount() {
        this.setState({
            'places': this.props.placess

        });
    }

    
    
     /* Render of LocationList*/
     
    render() {
        var locationlist = this.state.places.map(function (listItem, index) {
            return (
                <LocationItem key={index} openinfo={this.props.openinfo.bind(this)} data={listItem}/>
            );
        }, this);

       return (
            <div className="lookfor">
            <button className="butt" onClick={this.suggtoggel}>places</button>
                <input role="search" aria-labelledby="filter" id="look" className="look" type="text" placeholder="search for"
                       value={this.state.q} onChange={this.filterL}/>
                <ul>
                    {this.state.sugg && locationlist}
                </ul>
                
            </div>
        );
    }
}

export default LocationList;