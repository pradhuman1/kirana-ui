import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

interface MapRenderProps {
  currentLocation: { lat: number; lng: number };
  onUpdateLocation: (event: any) => void;
}

function MapRender({ currentLocation, onUpdateLocation }: MapRenderProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyD-hU8ShZa9sMcqzS4are3j4UsMK0o-Wp4",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(currentLocation);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const onDragEnd = (event: any) => {
    console.log(event);
    onUpdateLocation(event);
  };
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker
        position={currentLocation}
        draggable={true}
        onDragEnd={onDragEnd}
      />
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default MapRender;
