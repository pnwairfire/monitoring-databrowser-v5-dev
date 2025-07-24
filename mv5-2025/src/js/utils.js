// General utility functions
//
// NOTE:  These functions do not need access to any reactive variables.

// Replace window history without reloading the page.
export function replaceWindowHistory(
  centerlat = "",
  centerlon = "",
  zoom = "",
  monitors = "",
  purpleair = "",
  clarity = ""
) {
  const params = new URLSearchParams();

  if (centerlat !== "") {
    params.set("centerlat", (Math.round(centerlat * 10000) / 10000).toString());
  }

  if (centerlon !== "") {
    params.set("centerlon", (Math.round(centerlon * 10000) / 10000).toString());
  }

  if (zoom !== "") {
    params.set("zoom", zoom.toString());
  }

  if (Array.isArray(monitors) && monitors.length > 0) {
    params.set("monitors", monitors.join(","));
  }

  if (Array.isArray(purpleair) && purpleair.length > 0) {
    params.set("purpleair", purpleair.join(","));
  }

  if (Array.isArray(clarity) && clarity.length > 0) {
    params.set("clarity", clarity.join(","));
  }

  const base = window.location.origin + window.location.pathname;
  const url = `${base}?${params.toString()}`;

  window.history.replaceState(null, "Monitoring v5", url);
}

// Parse window URL
export function parseWindowQueryParams() {
  const params = new URLSearchParams(window.location.search);

  const result = {};

  if (params.has("centerlat")) {
    result.centerlat = parseFloat(params.get("centerlat"));
  }

  if (params.has("centerlon")) {
    result.centerlon = parseFloat(params.get("centerlon"));
  }

  if (params.has("zoom")) {
    result.zoom = parseInt(params.get("zoom"), 10);
  }

  if (params.has("monitors")) {
    result.monitors = params.get("monitors").split(",").filter(Boolean);
  }

  if (params.has("purpleair")) {
    result.purpleair = params.get("purpleair").split(",").filter(Boolean);
  }

  if (params.has("clarity")) {
    result.clarity = params.get("clarity").split(",").filter(Boolean);
  }

  return result;
}

// Create data-service URL
export function createDataServiceUrl(ids = []) {
  const baseUrl = "https://tools.airfire.org/monitor-data/v2/data";
  const monitorids = ids.reduce((a, o) => a + "," + o);
  const url = baseUrl + "?" + "monitorids=" + ids;
  return url;
}
