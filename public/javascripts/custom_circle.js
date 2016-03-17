var DistanceWidget;
function custom_circle(){
    /**
     * Created by Thomas on 9/3/2016.
     */



    /**
     * A distance widget that will display a circle that can be resized and will
     * provide the radius in km.
     *
     * @param {google.maps.Map} map The map to attach to.
     *
     * @constructor
     */
    DistanceWidget = function (map, latlng, onDragCallback, onClickCallback, onDClickCallback) {
        this.set('map', map);
        this.set('position', latlng);

        //var marker = new google.maps.Marker({
        //    draggable: true,
        //    title: 'Move me!'
        //});
        //
        //// Bind the marker map property to the DistanceWidget map property
        //marker.bindTo('map', this);
        //
        //// Bind the marker position property to the DistanceWidget position
        //// property
        //marker.bindTo('position', this);

        // Create a new radius widget
        var radiusWidget = new RadiusWidget(onDragCallback, onClickCallback, onDClickCallback);

        // Bind the radiusWidget map to the DistanceWidget map
        radiusWidget.bindTo('map', this);

        // Bind the radiusWidget center to the DistanceWidget position
        radiusWidget.bindTo('center', this, 'position');

        // Bind to the radiusWidgets' distance property
        this.bindTo('distance', radiusWidget);

        this.bindTo('radius', radiusWidget, 'radius');

        // Bind to the radiusWidgets' bounds property
        this.bindTo('bounds', radiusWidget);

    }
    DistanceWidget.prototype = new google.maps.MVCObject();

    /**
     * A radius widget that add a circle to a map and centers on a marker.
     *
     * @constructor
     */
    function RadiusWidget(onDragCallback, onClickCallback, onDClickCallback) {
        var circle = new google.maps.Circle({
            strokeWeight: 2,
            draggable: true,
            strokeColor: '#FFFF00',
            fillColor: '#FFFF00',
            fillOpacity: 0.6
        });

        circle.addListener('drag', onDragCallback);
        circle.addListener('click', onClickCallback);
        circle.addListener('dblclick', onDClickCallback);

        // Set the distance property value, default to 10km.
        this.set('distance', 10);

        // Bind the RadiusWidget bounds property to the circle bounds property.
        this.bindTo('bounds', circle);

        // Bind the circle center to the RadiusWidget center property
        circle.bindTo('center', this);

        // Bind the circle map to the RadiusWidget map
        circle.bindTo('map', this);

        this.set('radius', 100);
        // Bind the circle radius property to the RadiusWidget radius property
        circle.bindTo('radius', this);

        // Add the sizer marker
        this.addSizer_();
    }
    RadiusWidget.prototype = new google.maps.MVCObject();


    /**
     * Update the radius when the distance has changed.
     */
    RadiusWidget.prototype.distance_changed = function() {
        this.set('radius', this.get('distance') * 1000);
    };


    /**
     * Add the sizer marker to the map.
     *
     * @private
     */
    RadiusWidget.prototype.addSizer_ = function() {
        var sizer = new google.maps.Marker({
            draggable: true,
            title: 'resize',
            icon: {
                path: 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0 M -3,1 L -3,0.5 L 3,0.5 L 3,1 L 4,0 L 3,-1 L 3,-0.5 L -3,-0.5 L -3,-1 L -4,0 Z',
                scale: 2,
                strokeWeight: 1,
                fillColor: '#FFFFFF',
                fillOpacity: 0.8
            }
        });

        sizer.bindTo('map', this);
        sizer.bindTo('position', this, 'sizer_position');

        var me = this;
        google.maps.event.addListener(sizer, 'drag', function() {
            // As the sizer is being dragged, its position changes.  Because the
            // RadiusWidget's sizer_position is bound to the sizer's position, it will
            // change as well.
            var min = 0.5;
            var max = 100000;
            var pos = me.get('sizer_position');
            var center = me.get('center');
            var distance = google.maps.geometry.spherical.computeDistanceBetween(center, pos) / 1000;
            if (distance < min) {
                me.set('sizer_position', google.maps.geometry.spherical.computeOffset(center, min * 1000, google.maps.geometry.spherical.computeHeading(center, pos)));
            } else if (distance > max) {
                me.set('sizer_position', google.maps.geometry.spherical.computeOffset(center, max * 1000, google.maps.geometry.spherical.computeHeading(center, pos)));
            }
            // Set the circle distance (radius)
            me.setDistance();
        });
    };


    /**
     * Update the center of the circle and position the sizer back on the line.
     *
     * Position is bound to the DistanceWidget so this is expected to change when
     * the position of the distance widget is changed.
     */
    RadiusWidget.prototype.center_changed = function() {
        var bounds = this.get('bounds');

        // Bounds might not always be set so check that it exists first.
        if (bounds) {
            var lng = bounds.getNorthEast().lng();

            // Put the sizer at center, right on the circle.
            var position = new google.maps.LatLng(this.get('center').lat(), lng);
            this.set('sizer_position', position);
        }
    };


    /**
     * Set the distance of the circle based on the position of the sizer.
     */
    RadiusWidget.prototype.setDistance = function() {
        // As the sizer is being dragged, its position changes.  Because the
        // RadiusWidget's sizer_position is bound to the sizer's position, it will
        // change as well.
        var pos = this.get('sizer_position');
        var center = this.get('center');
        var distance = google.maps.geometry.spherical.computeDistanceBetween(center, pos)/1000;

        // Set the distance property for any objects that are bound to it
        this.set('distance', distance);
    };

}