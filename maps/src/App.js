import "./App.css";
import Map from "./components/MapContainer";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <div className="App">
      <div className="container-map">
        <Map />
      </div>
    </div>
  );
}

export default App;
