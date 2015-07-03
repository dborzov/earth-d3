var width = 1000,
    height = 500,
    globe = {type: "Sphere"};


function ready(error, world, names) {
      i = 0,
      n = countries.length;

  countries = countries.filter(function(d) {
    return names.some(function(n) {
      if (d.id == n.id) return d.name = n.name;
    });
  }).sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  (function transition() {
    d3.transition()
        .duration(1250)
        .tween("rotate", function() {
          var p = d3.geo.centroid(countries[i]),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            clearScreen();
            drawGlobe();
            render(land);
          };
        });
  })();

  var p = d3.geo.centroid(countries[i]);
  var long = -p[0],
       lat =-p[1];
  rotateLeft = function() {
      long += 5.;
      console.log("long, lat: ", long, lat);
      d3.transition()
          .duration(250)
          .tween("rotate", function() {
            var r = d3.interpolate(projection.rotate(), [long, lat]);
            return function(t) {
              projection.rotate(r(t));
              clearScreen();
              drawGlobe();
              render(land);
            };
          });
  }

  zoomIn = function() {
    console.log("zooming in to: ", scale);
    scale +=50;
    projection = d3.geo.orthographic()
        .scale(scale)
        .clipAngle(80);
    path = d3.geo.path()
            .projection(projection)
            .context(cxt);
    clearScreen();
    drawGlobe();
    render(land);
  }

  zoomOut = function() {
    console.log("zooming in to: ", scale);
    scale -=50;
    projection = d3.geo.orthographic()
        .scale(scale)
        .clipAngle(80);
    path = d3.geo.path()
            .projection(projection)
            .context(cxt);
    clearScreen();
    drawGlobe();
    render(land);
  }

}

function drawGlobe() {
   cxt.fillStyle = colorScheme.sea;
   cxt.lineWidth = 3;
   cxt.beginPath();
   path(globe);
   cxt.fill();
}

function render(land) {
  cxt.fillStyle = colorScheme.land, cxt.beginPath(), path(land), cxt.fill();
  cxt.strokeStyle = colorScheme.space, cxt.lineWidth = 0.5, cxt.beginPath(), path(land), cxt.stroke();
}
