import React, {Component} from 'react';
import LocationList from './components/LocationList';

class App extends Component {
    /*set of allocation*/
    constructor(props) {
        super(props);
        this.state = {
            'placess': [
                {
                    'name': 'Tahrir Square Egypt',
                    'latitude': 30.044421,
                    'longitude':  31.235719
                },
                {
                    'name': 'Egyptian Museum Cairo',
                    'latitude': 30.047848,
                    'longitude': 31.233637
                },
                {
                    'name': 'Sadat',
                    'latitude': 30.044541,
                    'longitude': 31.234474
                },
                {
                    'name': 'Talaat Harb Square',
                    'latitude': 30.047602,
                    'longitude': 31.238449
                },
                {
                    'name': 'cairo tower',
                    'latitude': 30.045915,
                    'longitude': 31.224290
                }
                
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': '',
            'street':'',
            'city':'',
            'phone':''
        };

        /*retain object  when used this*/

        this.initm = this.initm.bind(this);
        this.openinfo = this.openinfo.bind(this);
        this.closein = this.closein.bind(this);
    }

    componentDidMount() {
        
        // Google Maps can invoke it
        window.initm = this.initm;
        // Asynchronously load the Google Maps script, passing in the callback reference ang key
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyB9BtNyKK3Tlf7abXhPy8kN9mNQ8UHEQi4&callback=initm')
    }

    /* the initiation function*/

    initm() {
        var self = this;
        var cairo= {
        lat: 30.044420,
        lng: 31.235712
    };

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: cairo,
            zoom: 16,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closein();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closein();
        });
        /* to change marker color*/

        var placess = [];
        var defaulte = this.makeMarkerIcon('FF00CC');
        var highlight = this.makeMarkerIcon('66FFFF');
        this.state.placess.forEach(function (location) {
            var longname = location.name;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map,
                icon: defaulte
            });

            // to change the colors back and forth.
            marker.addListener('mouseover', function() {
                this.setIcon(highlight);
            });
            //close the block
            marker.addListener('mouseout', function() {
                this.setIcon(defaulte);
            });
            marker.addListener('click', function () {
                self.openinfo(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            placess.push(location);
        });
        this.setState({
            'placess': placess
        });
    }

    /* creat marker*/
    makeMarkerIcon(markerColor) {
    var markerImage = new window.google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_xpin_letter_withshadow&chld=pin_star|A|' + markerColor +
        '|000000',
        new window.google.maps.Size(34, 34),
        new window.google.maps.Point(0, 0),
        new window.google.maps.Point(5, 34),
        new window.google.maps.Size(34, 34));
    return markerImage;
}
    /*click on marker*/
    openinfo(marker) {
        this.closein();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    /* get info of places*/
    getMarkerInfo(marker) {
        var self = this;
        var clientId = "XTJD34HVVPHNW0YNJ1VQMTINYQ0PXK2UCDMMLMVMYFTCSSSN";
        var clientSecret = "L2XABK12W3S3PQPPS14FSPJIR2AG5Z5B2H3DRE4WQBL043FW";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded!!!! ooooops");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        self.street = '<b>street: </b>' + location_data.location.formattedAddress[0] + '<br>';
                        self.city = '<b>city: </b>' + location_data.location.formattedAddress[1] + '<br>';
                        //self.phone= '<b>phone: </b>' + location_data. + '<br>';

                        var windowContent =self.street+self.city;
                        var streetViewService = new window.google.maps.StreetViewService();
                        var radius = 50;
                        var getStreetView = function (value, status) {
                            if (status === window.google.maps.StreetViewStatus.OK) {
                                    var nearStreetViewLocation = value.location.latLng;
                                    var heading = window.google.maps.geometry.spherical.computeHeading(
                                        nearStreetViewLocation, marker.position);
                                    self.state.infowindow.setContent( windowContent+'<div id="pano"></div>');
                                    var panoramaOptions = {
                                        position: nearStreetViewLocation,
                                        pov: {
                                            heading: heading,
                                            pitch: 30
                                        }
                                    };
                                    new window.google.maps.StreetViewPanorama(
                                        document.getElementById('pano'), panoramaOptions);
                                } else {

                                    //  no  street  found for this place
                                    self.state.infowindow.setContent(windowContent + '<div style="color: gray"> Street not valid</div>');
                                }
                            };
                          
                            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
                            // Open the box on the correct marker.
                            self.state.infowindow.open(self.map, marker);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded!! ooooops");
            });
    }

    /*close info*/

    closein() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    /*
      Render function of App*/
     
    render() {
        return (
            <div id="nave">
                    <h1 id="h11"> Neighborhood map</h1>

                    <LocationList key="100" placess={this.state.placess} openinfo={this.openinfo}
                              closein={this.closein}/>
                <div id="map"></div>
                    </div>
        );
    }
}

export default App;

/**
  Load the google maps Asynchronously*/
 
function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write(" ooooop!!!Google Maps can't be load!!!!!!");
    };
    ref.parentNode.insertBefore(script, ref);
}