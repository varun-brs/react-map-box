import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
mapboxgl.accessToken = process.env.REACT_APP_MAP_BOX_ACCESS_TOKEN;

const mapTypes = [
  { key: "streets", value: "streets-v12" },
  { key: "light", value: "light-v10" },
  { key: "dark", value: "dark-v10" },
  { key: "outdoors", value: "outdoors-v11" },
  { key: "satellite", value: "satellite-v9" },
];

export const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [geoInfo, setGeoInfo] = useState(null);
  const [layer, setLayer] = useState("streets-v12");

  useEffect(() => {
    // Initial map on page load
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [82.15496352949646, 16.924941311242037],
      zoom: 10,
    });

    // Add the place search control to the map
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: "Search for a place",
      })
    );

    // Add the user location control to the map
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      })
    );

    // Add zoom and rotation controls to the map.
    map.current.addControl(new mapboxgl.NavigationControl());
    // Add fullscreen controls to the map.
    map.current.addControl(new mapboxgl.FullscreenControl());

    map.current.on("mousemove", (e) => {
      setGeoInfo(JSON.stringify(e.lngLat.wrap()));
    });
    // Link geo location search to custom position outside map
    // document.getElementById('geocoder').appendChild(geocoder.onAdd(map.current));

    return () => map.current.remove();
    // eslint-disable-next-line
  }, []);

  const handleMapStyleChange = (e) => {
    setLayer(e.target.id);
  };

  const MapTypes = () => {
    return mapTypes.map((e, i) => {
      return (
        <React.Fragment key={i}>
          <label className="me-2">
            <input
              className="me-2"
              id={e.value}
              type="radio"
              onChange={handleMapStyleChange}
              name="rtoggle"
              value={e.value}
              checked={layer === e.value}
            />
            {e.key}
          </label>
        </React.Fragment>
      );
    });
  };

  useEffect(() => {
    map.current.setStyle("mapbox://styles/mapbox/" + layer);
  }, [layer]);

  return (
    <>
      <div id="menu" className="rounded px-2 mx-4">
        <MapTypes />
      </div>
      {geoInfo && (
        <p className="geo-info text-center p-2 m-0">
          Geographical information: {geoInfo}
        </p>
      )}
      <div ref={mapContainer} className="map-container" />
    </>
  );
};
