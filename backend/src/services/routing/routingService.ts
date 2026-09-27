import { env } from '../../config/env.js';

export async function getRoute(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }, profile = 'driving') {
  const token = env.mapboxAccessToken;

  if (!token) {
    return {
      provider: 'mock',
      distance: '2.4 km',
      duration: '8 min',
      route: [origin, destination],
      accessibility: { directAccess: true, safeRoute: true, flyoverSide: 'Right side' },
      status: 'mock-mode'
    };
  }

  const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/${profile}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${token}`);

  if (!response.ok) {
    return {
      provider: 'mock',
      distance: '2.4 km',
      duration: '8 min',
      route: [origin, destination],
      accessibility: { directAccess: true, safeRoute: true, flyoverSide: 'Right side' },
      status: 'fallback'
    };
  }

  const data = await response.json();
  const route = data.routes?.[0];

  return {
    provider: 'mapbox',
    distance: `${(route.distance / 1000).toFixed(1)} km`,
    duration: `${Math.ceil(route.duration / 60)} min`,
    route: route.geometry?.coordinates || [origin, destination],
    accessibility: {
      directAccess: true,
      safeRoute: route.legs?.[0]?.summary ? true : true,
      flyoverSide: 'Right side'
    },
    status: 'live'
  };
}
