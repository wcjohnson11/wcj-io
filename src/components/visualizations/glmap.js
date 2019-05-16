import React, { useState } from "react";
import MapGL from "react-map-gl";
import * as topojson from "topojson-client";
import world from "world-atlas/world/110m";
import Immutable from "immutable";

import "mapbox-gl/dist/mapbox-gl.css";
import ChoroplethOverlay from "./glchloropleth";

const GLMap = ({ data }) => {
  const [viewport, setViewport] = useState({
    height: 700,
    width: 700,
    latitude: 30.375999878729193,
    longitude: 11.258032299596003,
    zoom: 0.75,
    bearing: 0,
    pitch: 0
  });

  // Create topology country objects
  const topoCountries = topojson.feature(world, world.objects.countries)
    .features;

  const immutableTopoCountries = Immutable.fromJS(topoCountries)

  // Value accessor function
  function getValue (feature) {
      // console.log(feature)
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%"
      }}
    >
      <MapGL
        {...viewport}
        mapStyle={"mapbox://styles/wcj111/cjuvm4fbw19bp1fphhnuw1vel"}
        mapboxApiAccessToken={process.env.MapboxAccessToken}
        onViewportChange={viewport => setViewport(viewport)}
      >
        <ChoroplethOverlay
          features={immutableTopoCountries}
          colorDomain={[0, 100]}
          colorRange={["hsl(0.8, 1, 0.8)", "hsl(0, 1, 1)"]}
          valueAccessor={getValue}
          globalOpacity={0.8}
          renderWhileDragging={true}
        />
      </MapGL>
    </div>
  );
};

export default GLMap;
