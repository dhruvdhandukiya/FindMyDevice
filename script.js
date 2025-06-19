let map, marker;

function initMap() {
  map = L.map('map').setView([20.5937, 78.9629], 5); // India
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function updateDeviceInfo(coords) {
  const lat = coords.latitude.toFixed(5);
  const lon = coords.longitude.toFixed(5);
  const timestamp = new Date().toLocaleString();

  document.getElementById("deviceCoords").textContent = `${lat}, ${lon}`;
  document.getElementById("deviceLastSeen").textContent = timestamp;

  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      const level = Math.round(battery.level * 100) + "%";
      document.getElementById("deviceBattery").textContent = level;
    });
  } else {
    document.getElementById("deviceBattery").textContent = "Unavailable";
  }

  document.getElementById("deviceStatus").textContent = "Online";
  document.getElementById("deviceStatusBadge").textContent = "Online";
  document.getElementById("deviceStatusBadge").classList.remove("offline");
}

function setMarker(lat, lon) {
  if (marker) {
    marker.setLatLng([lat, lon]).openPopup();
  } else {
    marker = L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();
  }
  map.setView([lat, lon], 13);
}

document.getElementById("getLocationBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      setMarker(latitude, longitude);
      updateDeviceInfo(position.coords);
    },
    error => {
      alert("Unable to retrieve your location.");
    }
  );
});

window.addEventListener("DOMContentLoaded", initMap);
