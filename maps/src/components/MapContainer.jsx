import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { saveAs } from "file-saver";
import Cuboid from "./Cuboid";
import { REACT_APP_MAPBOX_ACCESS_TOKEN } from "../utils/constant";
mapboxgl.accessToken = REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null);
  const [center, setCenter] = useState([18, 77]);
  const [locationInput, setLocationInput] = useState("");
  const [map, setMap] = useState(null);
  const [imageURL, setImageURL] = useState(null); 
  const [isCapturing, setIsCapturing] = useState(false);
  const cuboidRef = useRef(null);
  const [searchedLocation, setSearchedLocation] = useState(null);

  const captureVisibleRegion = () => {
    setIsCapturing(true);
  };

  const handleInputChange = (event) => {
    setLocationInput(event.target.value);
  };

  const handleDownload = () => {
    saveAs(imageURL, "maps");
  };
  const handleSubmit = async (event) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent
        (locationInput)}
        .json?access_token=${mapboxgl.accessToken}`
      );
      console.log(response);
      if (!response.ok) {
        throw new Error("Location not found.");
      }

      const data = await response.json();
      console.log(data);

      if (data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        setCenter([longitude, latitude]);
        setSearchedLocation({ longitude, latitude });
      } else {
        alert("Location not found.");
      }
    } catch (error) {
      alert(
        "Error fetching location data. Please check the location and try again."
      );
    }
  };
  

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: 15,
    });

    map.on("render", () => {
      setMap(map);
    });

    return () => map.remove();
  }, [center]);


  //checks if capturing is true and then map is available or not
  useEffect(() => {
    if (isCapturing && map) {
      map.once("render", () => {
        const canvas = map.getCanvas();
        const dataURL = canvas.toDataURL("image/jpeg"); 

        setImageURL(dataURL);
        setIsCapturing(false);
      });
    }
  }, [isCapturing, map]);

  return (
    <div className="box">
      {/* Map */}
      <div className="navbar">
        <input
          className="input"
          type="text"
          value={locationInput}
          onChange={handleInputChange}
          placeholder="Enter location"
        />
        <button className="btns" type="submit" onClick={handleSubmit}>
          Search
        </button>
        <button className="btns" onClick={captureVisibleRegion}>
          Capture Visible Region
        </button>
        <button className="btns">3D Image</button>
        <button className="btns" onClick={handleDownload}>
          Download
        </button>
      </div>
      <h2 className="heading">Map</h2>
      <div className="map-area" ref={mapContainerRef} />

      {/* Captured Image  */}

      {isCapturing && <h1>Capturing...</h1>}
      {!isCapturing && imageURL && (
        <div>
          <h2 className="heading">Captured Image: </h2>
          <img src={imageURL} className="map-area" alt="Captured Map" />
        </div>
      )}

      {/* cuboid */}

      <h2 className="heading">3D Model</h2>
      <Cuboid
        imageURL={imageURL}
        cuboidRef={cuboidRef}
        className="map-area"
      />

      {/* pin icon */}
      {searchedLocation && (
        <div>
          <div
            className="location-pin"
          ></div>
        </div>
      )}
    </div>
  );
};

export default Map;
