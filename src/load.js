var renderer = {};
queue()
    .defer(d3.json, "/world-110m.json")
    .defer(d3.tsv, "world-country-names.tsv")
    .await(function(error, world, names) {
      if (error) throw error;
      renderer = new GlobeView(world);
      renderer.render();
    });
