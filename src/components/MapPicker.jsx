// file: components/MapPicker.jsx (Conceptual Example)
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";

// Fix for default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

export const MapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);

  const handlePositionChange = (latlng) => {
    setPosition(latlng);
    onLocationSelect(latlng);
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker
        position={position}
        onPositionChange={handlePositionChange}
      />
    </MapContainer>
  );
};
