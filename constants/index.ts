export const BALTIMORE_CITY_HALL_COORDINATES = {
    latitude: 39.29098863071233,
    longitude: -76.61055925974375,
}
export const TOWSON_UNIVERSITY_COORDINATES = {
    latitude: 39.392686191140164,
    longitude: -76.6125533713848,
}
export const EMPIRE_STATE_BUILDING_COORDINATES = {
    latitude: 40.74865992639316,
    longitude: -73.9857073173735,
}

/**
 * Census.gov
 * ------------------
 * No authentication required for API
 * GET requests only
 *
 * Substitute the /<number>/ in the url with the number that corresponds to the desired API here:
 * https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer
 *
 * For example, STATE = 80 and COUNTY = 82
 *
 * Get the STATE from the Baltimore City Hall Coordinates (copy + paste into browser)
 * https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/82/query?geometry=-76.61055925974375,39.29098863071233&inSR=4269&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=json&outFields=NAME
 */
export const CENSUS_BASE_URL__STATE =
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/80/query?geometry=<longitude>,<latitude>&inSR=4269&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=json&outFields=STUSAB"

export const CENSUS_BASE_URL__COUNTY =
    "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/82/query?geometry=<longitude>,<latitude>&inSR=4269&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=true&f=json&outFields=NAME"

export enum FormOfIdentity {
    DRIVERS_LICENSE = 1,
    BIRTH_CERTIFICATE = 2,
    PASSPORT = 3,
}
