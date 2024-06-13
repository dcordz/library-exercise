import {
    BALTIMORE_CITY_HALL_COORDINATES,
    CENSUS_BASE_URL__STATE,
    CENSUS_BASE_URL__COUNTY,
} from "../constants"

interface ICensusStateResult {
    features: {
        attributes: {
            STUSAB: string
        }
    }[]
}
interface ICensusCountyResult {
    features: {
        attributes: {
            NAME: string
        }
    }[]
}

export default class Address {
    street1: string
    street2?: string
    street3?: string
    city: string
    county: string
    stateCode: string
    postalCode: string
    postalCodeExtension?: string

    latitude: number | null
    longitude: number | null
    isResidentMaryland: boolean | null
    isResidentBaltimoreCity: boolean | null

    constructor(props: {
        street1: string
        city: string
        county: string
        stateCode: string
        postalCode: string
        optional?: {
            street2?: string
            street3?: string
            postalCodeExtension?: string
            latitude?: number
            longitude?: number
        }
    }) {
        this.street1 = this.initializeString(props.street1)
        this.street2 =
            props.optional?.street2 &&
            this.initializeString(props.optional?.street2)
        this.street3 =
            props.optional?.street3 &&
            this.initializeString(props.optional?.street3)

        this.city = this.initializeString(props.city)
        this.county = this.initializeString(props.county)
        this.stateCode = this.initializeString(props.stateCode)

        this.postalCode = this.initializeString(props.postalCode)
        this.postalCodeExtension =
            props.optional?.postalCodeExtension &&
            this.initializeString(props.optional?.postalCodeExtension)

        this.latitude =
            props.optional?.latitude || BALTIMORE_CITY_HALL_COORDINATES.latitude

        this.longitude =
            props.optional?.longitude ||
            BALTIMORE_CITY_HALL_COORDINATES.longitude

        // transitive
        this.isResidentMaryland = null
        this.isResidentBaltimoreCity = null

        this.postInitialize().catch(console.error)
    }

    public async isMarylandResident(): Promise<boolean> {
        this.geocode()
        return !!(await this.isCoordinatesWithinMaryland())
    }

    public async isBaltimoreCityResident(): Promise<boolean> {
        this.geocode()
        return !!(await this.isCoordinatesWithinBaltimoreCity())
    }

    // Private - only expose what we need to expose until requirements change.

    private async postInitialize() {
        this.validate()
    }

    private validate(): void {
        if (!this.street1) {
            throw new Error("Address: Street is required.")
        }
        if (!this.city) {
            throw new Error("Address: City is required.")
        }
        if (!this.county) {
            throw new Error("Address: County is required.")
        }
        if (!this.stateCode) {
            throw new Error("Address: State is required.")
        }
        if (!this.postalCode) {
            throw new Error("Address: Postal Code is required.")
        }
    }

    private initializeString(s: string): string {
        return s.trim().toLowerCase()
    }

    /**
     * Geocode address using an external service (Google Maps, USPS, etc.) if no lat/long is set in the constructor.
     * Some services through an AddressAutoComplete front-end feature may return these coordinates in addition to the address.
     * If this.latitude OR this.longitude is falsey, do the geocode lookup.
     *
     * https://developers.google.com/maps/documentation/geocoding/overview
     */
    private geocode(): void {
        if (this.latitude && this.longitude) {
            // noop - don't need to re-query
        } else {
            // Typically we would call an external service here, but because there aren't any free services that geocode
            // we'll use the hardcoded coords of Baltimore City Hall instead
            this.latitude = BALTIMORE_CITY_HALL_COORDINATES.latitude
            this.longitude = BALTIMORE_CITY_HALL_COORDINATES.longitude
        }
    }

    private getCensusURL(baseUrl: string): string | undefined {
        if (!this.latitude || !this.longitude) return

        return baseUrl
            .replace("<latitude>", this.latitude.toString())
            .replace("<longitude>", this.longitude.toString())
    }

    /**
     * We use the Census Tigerweb API to check that latitude/longitude
     * on a Resident's address are within the county of Baltimore City.
     *
     * @returns {Promise<Boolean>}
     */
    private async isCoordinatesWithinMaryland(): Promise<boolean | null> {
        const state = await this.getCensusState()
        if (state === null) return null

        return state === "md"
    }

    private async isCoordinatesWithinBaltimoreCity(): Promise<boolean | null> {
        const county = await this.getCensusCounty()
        if (county === null) return null

        return county === "baltimore city"
    }

    private async getCensusState(): Promise<string | null> {
        const u = this.getCensusURL(CENSUS_BASE_URL__STATE)
        if (!u) return null

        return this.getCensus(u, "STUSAB")
    }

    private async getCensusCounty(): Promise<string | null> {
        const u = this.getCensusURL(CENSUS_BASE_URL__COUNTY)
        if (!u) return null

        return this.getCensus(u, "NAME")
    }

    private async getCensus(
        url: string,
        key: "STUSAB" | "NAME"
    ): Promise<string | null> {
        return fetch(url)
            .then((r) => r.json())
            .then((j: ICensusStateResult | ICensusCountyResult) =>
                this.initializeString(j.features[0].attributes[key])
            )
            .catch((e) => {
                console.log(
                    `There was an issue fetching data from census.gov. Please try running this script again. ERROR: ${e.message}`
                )
                return null
            })
    }
}
