import geojsonData from './data/Kommuner-M.json';
import './App.css';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import { useState } from 'react';


const fylkesmapper = {
  "56": "Finnmark",
  "55": "Troms",
  "18": "Nordland",
  "50": "Trøndelag",
  "15": "Møre og Romsdal",
  "46": "Vestland",
  "11": "Rogaland",
  "40": "Telemark",
  "42": "Agder",
  "39": "Vestfold",
  "03": "",//"Oslo",
  "31": "Østfold",
  "33": "Buskerud",
  "32": "Akershus",
  "34": "Innlandet"
}

const kommunemapper = Object.assign({}, ...geojsonData.features.map(feature => {return({[feature.properties.id]: feature.properties.name});}));


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
    <div style={{display: "flex", flexDirection: "row"}}>
      <MapContainer center={[63, 12]} zoom={5} style={{ height: '100vh', width: '70%' }}>
        <GeoJSON 
          data={geojsonData} 
          onEachFeature={onEachFeature} 
          style={styleFeature} 
        />
        
      </MapContainer>
      <div style={{ overflowY: 'scroll', height: '100vh', width: '30%', backgroundColor: '#111', color: "white" }}>
        <button onClick={exportFunction}>Export</button>
        <button onClick={importFunction}>Import</button>
        <p>{selectedFeature.length} / {Object.keys(kommunemapper).length}</p>
        <ul>
          {selectedFeature.map(kommunenr => <li>{kommunemapper[kommunenr]}, {fylkesmapper[kommunenr.slice(0, 2)]} ({kommunenr})</li>).reverse()}
        </ul>
      </div>
    </div>
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
