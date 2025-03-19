import geojsonData from './data/Kommuner-M.json';
import './App.css';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { useState } from 'react';


const MapComponent = ({ geojsonData }) => {
  const [selectedFeature, setSelectedFeature] = useState([]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFeature((prevSelected) => {
          if (prevSelected.includes(feature.properties.id)) {
            // Remove the feature ID if it's already selected
            return prevSelected.filter(id => id !== feature.properties.id);
          } else {
            // Add the feature ID if it's not selected
            return [...prevSelected, feature.properties.id];
          }
        });
      }
    });
  };

  const styleFeature = (feature) => {
    return {
      color: selectedFeature.includes(feature.properties.id) ? 'red' : 'blue', // Change color based on selection
      weight: 2,
      fillOpacity: 0.5,
    };
  };

  const exportFunction = () => {
    const element = document.createElement("a");
    const textFile = new Blob([JSON.stringify(selectedFeature)], {type: "text/plain"});
    element.href = URL.createObjectURL(textFile)
    element.download = "selected.json";
    document.body.appendChild(element);
    element.click()
    document.body.removeChild(element);
  }
  let fileHandle;

  const importFunction = async () => {
    try {
      [fileHandle] = await window.showOpenFilePicker();
      const fileData = await fileHandle.getFile();
      const fileText = await fileData.text();
      setSelectedFeature(JSON.parse(fileText));
    } catch (error) {
      console.warn(error);
      return;
    }
  }

  return (
    <MapContainer center={[63, 12]} zoom={5} style={{ height: '100vh', width: '100%' }}>
      <GeoJSON 
        data={geojsonData} 
        onEachFeature={onEachFeature} 
        style={styleFeature} 
      />
      <button onClick={exportFunction}>Export</button>
      <button onClick={importFunction}>Import</button>
    </MapContainer>
  );
};

function App() { 
  return (
    <div className="App">
      <MapComponent geojsonData={geojsonData}></MapComponent>
    </div>
  );
}

export default App;
