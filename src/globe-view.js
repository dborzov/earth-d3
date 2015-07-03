var GlobeView = function(world) {
  this.config = {
    width: document.getElementById('globe-view').offsetWidth,
    height: document.getElementById('globe-view').offsetHeight,
    land: "#f6fcfb",
    sea: "#6ea5cf",
    space: "#121e37"
  }

  this._land = topojson.feature(world, world.objects.land),
  this._regions = topojson.feature(world, world.objects.countries).features,
  this._borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

  var p = d3.geo.centroid(this._regions[0]);
  this.scale = 548;
  this.longitude = 0.;
  this.lattitude = 0.;

  this.render = function() {
    var canvas = d3.select("#globe-view")
        .attr("width", this.config.width)
        .attr("height", this.config.height);
    this.cxt = canvas.node().getContext("2d");


    this.projection = d3.geo.orthographic()
        .scale(this.scale)
        .clipAngle(90);

    this.path = d3.geo.path()
        .projection(this.projection)
        .context(this.cxt);

    this.projection.rotate([this.longitude, this.lattitude]);
    this.draw();
  }

  this.draw = function() {
    // clear screen
    this.cxt.fillStyle = this.config.space;
    this.cxt.fillRect(0, 0, this.config.width, this.config.height);
    // draw globe contour
    this.cxt.fillStyle = this.config.sea;
    this.cxt.lineWidth = 3;
    this.cxt.beginPath();
    this.path({type: "Sphere"});
    this.cxt.fill();
    // draw land
    this.cxt.fillStyle = this.config.land, this.cxt.beginPath(), this.path(this._land), this.cxt.fill();
    this.cxt.strokeStyle = this.config.space, this.cxt.lineWidth = 0.5, this.cxt.beginPath(), this.path(this._land), this.cxt.stroke();
  }

  this.zoomIn = function() {
    this.scale += 50;
    this.render();
  }

  this.zoomOut = function() {
    this.scale -= 50;
    this.render();
  }

  var self = this;
  this.rotate = function() {
    console.log("rotating to long: ", this.longitude, ", lat: ", this.lattitude);
    d3.transition()
        .duration(250)
        .tween("rotate", function() {
          var r = d3.interpolate(self.projection.rotate(), [self.longitude, self.lattitude]);
          return function(t) {
            self.projection.rotate(r(t));
            self.draw();
          };
        });
  }

  this.rotateLeft = function() {
    this.longitude = this.longitude + 5 > 180 ? (this.longitude -360 + 5) : (this.longitude + 5);
    this.rotate();
  }

  this.rotateRight = function() {
    this.longitude = this.longitude -5 <= -180 ? (this.longitude + 360 - 5) : this.longitude -5;
    this.rotate();
  }

  this.rotateUp = function() {
    this.lattitude = this.lattitude <= -85 ? this.lattitude : this.lattitude - 5;
    this.rotate();
  }

  this.rotateDown = function() {
    this.lattitude = this.lattitude >= 85 ? this.lattitude : this.lattitude + 5;
    this.rotate();
  }

}
