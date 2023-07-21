import "./App.css";
import MyComponent from "./components/MapContainer";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  return (
    <div className="App">
      <div className="container-map">
        <MyComponent />
      </div>
    </div>
  );
}

export default App;
