var width = 960,
    height = 500,
    globe = {type: "Sphere"};

var projection = d3.geo.orthographic()
    .scale(248)
    .clipAngle(90);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var cxt = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(cxt);

var title = d3.select("h1");

queue()
    .defer(d3.json, "/world-110m.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(ready);

function ready(error, world, names) {
  if (error) throw error;

  var land = topojson.feature(world, world.objects.land),
      countries = topojson.feature(world, world.objects.countries).features,
      borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
      i = -1,
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
        .each("start", function() {
          title.text(countries[i = (i + 1) % n].name);
        })
        .tween("rotate", function() {
          var p = d3.geo.centroid(countries[i]),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            cxt.clearRect(0, 0, width, height);
            drawGlobe();
            cxt.fillStyle = "#bbb", cxt.beginPath(), path(land), cxt.fill();
            cxt.fillStyle = "#f00", cxt.beginPath(), path(countries[i]), cxt.fill();
            cxt.strokeStyle = "#fff", cxt.lineWidth = .5, cxt.beginPath(), path(borders), cxt.stroke();
          };
        });
  })();
}

function drawGlobe() {
   cxt.fillStyle = "#6682ad";
   cxt.lineWidth = 3;
   cxt.beginPath();
   path(globe);
   cxt.fill();
}
