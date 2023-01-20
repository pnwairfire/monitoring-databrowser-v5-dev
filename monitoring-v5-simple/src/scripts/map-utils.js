// Leaflet (NOTE:  Don't put {} around the 'L'!)
import L from 'leaflet';
// Plotting helpers
import { pm25ToColor } from 'air-monitor-plots';
import { selected_id } from '../stores/gui-store.js';

/**
 *
 * @param {json} geojson to be converted to a leaflet layer
 * @returns
 */
export function createMonitorLayer(geojson) {
	var this_layer = L.geoJSON(geojson, {
		// Icon appearance
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: pm25ToColor(feature.properties.last_pm25),
				color: '#000',
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		},

		// Icon behavior
		onEachFeature: function (feature, layer) {
			let valueText;
			if (isNaN(feature.properties.last_pm25)) {
				valueText = "<span style='font-style:italic'> no data</span>";
			} else {
				valueText = feature.properties.last_pm25 + ' &#xb5;g/m<sup>3</sup>';
			}
			layer.bindPopup(feature.properties.locationName + '<br>' + valueText);

			layer.on('mouseover', function (e) {
				this.openPopup();
			});

			layer.on('mouseout', function (e) {
				this.closePopup();
			});

			layer.on('click', function (e) {
				selected_id = feature.properties.deviceDeploymentID;
				selectMonitor();
			});
		}
	});
	return this_layer;
}
