import {
    BALTIMORE_CITY_HALL_COORDINATES,
    EMPIRE_STATE_BUILDING_COORDINATES,
    TOWSON_UNIVERSITY_COORDINATES,
} from "../constants"
import Address from "../models/address"

export default {
    baltimore: new Address({
        street1: "100 Holliday St",
        city: "Baltimore",
        county: "Baltimore City",
        stateCode: "MD",
        postalCode: "21202",
        optional: {
            latitude: BALTIMORE_CITY_HALL_COORDINATES.latitude,
            longitude: BALTIMORE_CITY_HALL_COORDINATES.longitude,
        },
    }),
    towson: new Address({
        street1: "8000 York Rd",
        city: "Towson",
        county: "Baltimore",
        stateCode: "MD",
        postalCode: "21252",
        optional: {
            latitude: TOWSON_UNIVERSITY_COORDINATES.latitude,
            longitude: TOWSON_UNIVERSITY_COORDINATES.longitude,
        },
    }),
    nyc: new Address({
        street1: "20 W 34th St",
        city: "New York",
        county: "New York",
        stateCode: "NY",
        postalCode: "10001",
        optional: {
            latitude: EMPIRE_STATE_BUILDING_COORDINATES.latitude,
            longitude: EMPIRE_STATE_BUILDING_COORDINATES.longitude,
        },
    }),
}
