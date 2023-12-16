import Styles from './App.module.css';
import Map, { Source, Layer, Marker } from 'react-map-gl'
import MapComp from './components/MapComp/MapComp';

function App() {
  return (
    <div className={Styles.App}>
      <MapComp />
    </div>
  )
}

export default App;
