(function () {
  'use strict';

  var mapEl = document.getElementById('service-map');
  if (!mapEl || typeof L === 'undefined') return;

  var wilmington = [34.2257, -77.9447];

  var cities = [
    { name: 'Wilmington, NC', coords: [34.2257, -77.9447] },
    { name: 'Leland, NC', coords: [34.2563, -78.0447] },
    { name: 'Castle Hayne, NC', coords: [34.3568, -77.8997] },
    { name: 'Carolina Beach, NC', coords: [34.0352, -77.8936] },
    { name: 'Wrightsville Beach, NC', coords: [34.2085, -77.7961] },
    { name: 'Kure Beach, NC', coords: [33.9985, -77.9073] },
    { name: 'Hampstead, NC', coords: [34.3677, -77.7105] },
    { name: 'Holly Ridge, NC', coords: [34.4954, -77.5541] },
    { name: 'Sneads Ferry, NC', coords: [34.5527, -77.3972] },
    { name: 'Jacksonville, NC', coords: [34.7540, -77.4302] },
    { name: 'Hubert, NC', coords: [34.6899, -77.2208] },
    { name: 'Oak Island, NC', coords: [33.9563, -78.1611] },
    { name: 'Southport, NC', coords: [33.9204, -78.0203] },
    { name: 'Shallotte, NC', coords: [33.9732, -78.3858] },
    { name: 'Calabash, NC', coords: [33.8907, -78.5683] },
    { name: 'Ocean Isle Beach, NC', coords: [33.8943, -78.4267] },
    { name: 'Bolivia, NC', coords: [34.0677, -78.1483] },
    { name: 'Burgaw, NC', coords: [34.5521, -77.9261] },
    { name: 'Surf City, NC', coords: [34.4271, -77.5464] },
    { name: 'Swansboro, NC', coords: [34.6877, -77.1191] },
    { name: 'New Bern, NC', coords: [35.1085, -77.0441] },
    { name: 'Morehead City, NC', coords: [34.7229, -76.7260] },
    { name: 'Loris, SC', coords: [34.0563, -78.8903] },
    { name: 'Conway, SC', coords: [33.8360, -79.0478] },
    { name: 'Whiteville, NC', coords: [34.3388, -78.7031] },
    { name: 'Little River, SC', coords: [33.8732, -78.6142] },
    { name: 'North Myrtle Beach, SC', coords: [33.8160, -78.6800] }
  ];

  var map = L.map('service-map').setView(wilmington, 8);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

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
