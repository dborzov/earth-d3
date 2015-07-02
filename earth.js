var zoomIn = function() {},
    zoomOut = function() {};

var colorScheme = {
  land: "#f6fcfb",
  sea: "#6ea5cf",
  space: "#121e37"
}

var scale = 548;

var width = 1000,
    height = 500,
    globe = {type: "Sphere"};

var projection = d3.geo.orthographic()
    .scale(scale)
    .clipAngle(80);

var canvas = d3.select("canvas")
    .attr("width", width)
    .attr("height", height);

var clearScreen = function() {
  cxt.fillStyle = colorScheme.space;
  cxt.fillRect(0, 0, width, height);
};

var cxt = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(cxt);


queue()
    .defer(d3.json, "/world-110m.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {
  if (error) throw error;

  var land = topojson.feature(world, world.objects.land),
      countries = topojson.feature(world, world.objects.countries).features,
      borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
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
