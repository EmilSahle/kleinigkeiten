// Die Karte wird gesetzt über den Mittelpunkt und die Zoom-Stufe
var map = L.map('map').setView([51.362234458487755, 9.89077814831739], 5.5);

// Eine Quelle für die Karte wird geholt, hier: openstreetmap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Leeres Array für alle Marker
let allMarkers = [];

// Funktion zum Laden der JSON-Daten
fetch('universitaeten.json')
    .then(response => response.json())
    .then(universitaeten => {
        console.log("Daten geladen:", universitaeten);

        // Jede Universität um eine Größenklasse ergänzen
        universitaeten.forEach(universitaet => {
            if (universitaet.anzahl_studierenden <= 10000) {
                universitaet.groesse = 1;
            } else if (universitaet.anzahl_studierenden <= 20000) {
                universitaet.groesse = 2;
            } else if (universitaet.anzahl_studierenden <= 30000) {
                universitaet.groesse = 3;
            } else {
                universitaet.groesse = 4;
            }
        });

        // Funktion zum Hinzufügen der Marker basierend auf den Checkboxen
        function addMarkers() {
            // Zuerst alle vorhandenen Marker von der Karte entfernen
            allMarkers.forEach(marker => {
                map.removeLayer(marker);
            });
            allMarkers = []; // Array leeren

            // Checkboxen abfragen
            const bscChecked = document.getElementById('bsc-checkbox').checked;
            const baChecked = document.getElementById('ba-checkbox').checked;
            const group1Checked = document.getElementById('group-1-checkbox').checked;
            const group2Checked = document.getElementById('group-2-checkbox').checked;
            const group3Checked = document.getElementById('group-3-checkbox').checked;
            const group4Checked = document.getElementById('group-4-checkbox').checked;

            // Durch alle Universitäten iterieren und basierend auf den Checkboxen Marker setzen
            universitaeten.forEach(universitaet => {
                const inSizeGroup =
                    (universitaet.groesse === 1 && group1Checked) ||
                    (universitaet.groesse === 2 && group2Checked) ||
                    (universitaet.groesse === 3 && group3Checked) ||
                    (universitaet.groesse === 4 && group4Checked);

                const matchesDegree =
                    (bscChecked && universitaet.bsc) ||
                    (baChecked && universitaet.ba);

                // Nur Marker setzen, wenn die Uni in die Größenklasse passt und mindestens ein Abschluss übereinstimmt
                if (inSizeGroup && matchesDegree) {
                    const marker = L.marker(universitaet.geokoordinaten)
                        .bindPopup(`
                            <b>${universitaet.name}</b><br>
                            Studierende: ${universitaet.anzahl_studierenden}<br>
                            BSc: ${universitaet.bsc ? 'Ja' : 'Nein'}, BA: ${universitaet.ba ? 'Ja' : 'Nein'}
                        `);

                    // Marker zur Karte hinzufügen und im Array speichern
                    marker.addTo(map);
                    allMarkers.push(marker);
                }
            });
        }

        // Initial alle Marker hinzufügen
        addMarkers();

        // Event-Listener für alle Checkboxen
        document.getElementById('bsc-checkbox').addEventListener('change', addMarkers);
        document.getElementById('ba-checkbox').addEventListener('change', addMarkers);
        document.getElementById('group-1-checkbox').addEventListener('change', addMarkers);
        document.getElementById('group-2-checkbox').addEventListener('change', addMarkers);
        document.getElementById('group-3-checkbox').addEventListener('change', addMarkers);
        document.getElementById('group-4-checkbox').addEventListener('change', addMarkers);
    })
    .catch(error => console.error('Fehler beim Laden der JSON-Datei:', error));
