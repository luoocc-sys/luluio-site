import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

const visitedPlaces = [
  { name: 'Paris', lat: 48.8566, lng: 2.3522, date: '2025-09-15', emoji: '🗼' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, date: '2025-11-20', emoji: '🗾' },
  { name: 'New York', lat: 40.7128, lng: -74.0060, date: '2026-01-10', emoji: '🗽' },
  { name: 'Bali', lat: -8.3405, lng: 115.0920, date: '2026-03-05', emoji: '🏝️' },
];

const MAP_CENTER: [number, number] = [20, 10];
const MAP_ZOOM = 2;

// Create emoji markers (called inside component to avoid SSR issues)
const createEmojiIcon = (emoji: string) =>
  L.divIcon({
    className: '',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#fb7185;font-size:20px;box-shadow:0 0 14px rgba(251,113,133,0.55);border:2px solid rgba(255,255,255,0.3);">${emoji}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });

// Helper to invalidate map size after mount (fixes Leaflet rendering in hidden/async containers)
const MapInvalidator = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
};

const TravelMap = () => {
  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        {/* Subtle radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

        {/* Header */}
        <motion.div
          className="relative mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">
            Our Travel Map
          </h2>
          <p className="text-white/40 text-sm mt-2">
            Every pin is a memory
          </p>
        </motion.div>

        {/* Map card — NO liquid-glass (breaks Leaflet) */}
        <motion.div
          className="rounded-3xl overflow-hidden border border-white/10 relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Map needs explicit height; use min-h to ensure it renders */}
          <div className="w-full h-[400px] md:h-[500px]">
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              zoomControl
              attributionControl={false}
              scrollWheelZoom={false}
              className="w-full h-full rounded-3xl"
              style={{ background: '#0a0a0a', zIndex: 1 }}
            >
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <MapInvalidator />
              {visitedPlaces.map((place) => (
                <Marker
                  key={place.name}
                  position={[place.lat, place.lng]}
                  icon={createEmojiIcon(place.emoji)}
                >
                  <Popup>
                    <div className="text-sm text-gray-900">
                      <strong>
                        {place.emoji} {place.name}
                      </strong>
                      <br />
                      <span className="text-gray-500">{place.date}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelMap;
