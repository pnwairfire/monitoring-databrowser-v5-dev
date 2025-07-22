// General utility functions
//
// NOTE:  These functions do not need access to any reactive variables.

// Replace window history without reloading a page.
export function replaceWindowHistory(
  centerlat = "",
  centerlon = "",
  zoom = "",
  monitors = "",
  purpleair = "",
  clarity = ""
) {
  let base = window.location.origin + window.location.pathname;

  if (centerlat !== "") {
    centerlat = "centerlat=" + Math.round(centerlat * 10000) / 10000;
  }

  if (centerlon !== "") {
    centerlon = "centerlon=" + Math.round(centerlon * 10000) / 10000;
  }

  if (zoom !== "") {
    zoom = "zoom=" + zoom;
  }

  if (monitors !== "" && monitors.length > 0) {
    monitors = "monitors=" + monitors.reduce((a, o) => a + "," + o);
  }

  if (purpleair !== "" && purpleair.length > 0) {
    purpleair = "purpleair=" + purpleair.reduce((a, o) => a + "," + o);
  }

  if (clarity !== "" && clarity.length > 0) {
    clarity = "clarity=" + clarity.reduce((a, o) => a + "," + o);
  }

  const url =
    base +
    "?" +
    centerlat +
    "&" +
    centerlon +
    "&" +
    zoom +
    "&" +
    monitors +
    "&" +
    purpleair;

  window.history.replaceState("dummy", "Monitoring v5", url);
}

// Create data-service URL
export function createDataServiceUrl(ids = []) {
  const baseUrl = "https://tools.airfire.org/monitor-data/v2/data";
  const monitorids = ids.reduce((a, o) => a + "," + o);
  const url = baseUrl + "?" + "monitorids=" + ids;
  return url;
}
