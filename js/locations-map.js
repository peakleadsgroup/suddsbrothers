(function () {
  'use strict';

  var mapEl = document.getElementById('service-map');
  if (!mapEl || typeof L === 'undefined') return;

  var wilmington = [34.2257, -77.9447];
  var radiusMeters = 160934; // 100 miles

  var cities = [
    { name: 'Wilmington, NC', coords: [34.2257, -77.9447] },
    { name: 'Leland, NC', coords: [34.2563, -78.0447] },
    { name: 'Burgaw, NC', coords: [34.5521, -77.9261] },
    { name: 'Castle Hayne, NC', coords: [34.3568, -77.8997] },
    { name: 'Hampstead, NC', coords: [34.3677, -77.7105] },
    { name: 'Surf City, NC (Topsail)', coords: [34.4332, -77.5436] },
    { name: 'Oak Island, NC', coords: [33.9563, -78.1611] },
    { name: 'Carolina Beach, NC', coords: [34.0352, -77.8936] },
    { name: 'Wrightsville Beach, NC', coords: [34.2085, -77.7961] },
    { name: 'Southport, NC', coords: [33.9204, -78.0203] },
    { name: 'Shallotte, NC', coords: [33.9732, -78.3858] },
    { name: 'Jacksonville, NC', coords: [34.7540, -77.4302] },
    { name: 'New Bern, NC', coords: [35.1085, -77.0441] },
    { name: 'Kinston, NC', coords: [35.2627, -77.5816] },
    { name: 'Fayetteville, NC', coords: [35.0527, -78.8784] },
    { name: 'Myrtle Beach, SC', coords: [33.6891, -78.8867] }
  ];

  var map = L.map('service-map').setView(wilmington, 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  L.circle(wilmington, {
    radius: radiusMeters,
    color: '#9ACD32',
    fillColor: '#9ACD32',
    fillOpacity: 0.12,
    weight: 2
  }).addTo(map).bindPopup('<strong>100-Mile Service Radius</strong><br>Centered on Wilmington, NC');

  var markerIcon = L.divIcon({
    className: 'map-marker',
    html: '<div style="background:#9ACD32;width:12px;height:12px;border-radius:50%;border:2px solid #111;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  cities.forEach(function (city) {
    L.marker(city.coords, { icon: markerIcon })
      .addTo(map)
      .bindPopup('<strong>' + city.name + '</strong>');
  });
})();
