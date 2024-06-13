import { FormOfIdentity } from "../constants"
import Address from "./address"
import { dedupe } from "../utils"

interface IBasicInfo {
    name: string
    phone: string
    email?: string
}


export default class Resident {
    address: Address
    ids: FormOfIdentity[]
    name: string
    phone: string
    email?: string

    constructor(address: Address, ids: FormOfIdentity[], info: IBasicInfo) {
        this.address = address

        this.ids = ids

        this.name = info.name
        this.phone = info.phone
        this.email = info.email

        this.postInitialize()
    }

    /**
     * We use the Census Tigerweb API to check that latitude/longitude
     * on a Resident's address are within the state of Maryland.
     *
     * @returns {Promise<Boolean>}
     */
    public isMarylandResident(): Promise<boolean> {
        return this.address.isMarylandResident()
    }

    /**
     * We use the Census Tigerweb API to check that latitude/longitude
     * on a Resident's address are within the county of Baltimore City.
     *
     * @returns {Promise<Boolean>}
     */
    public isBaltimoreCityResident(): Promise<boolean> {
        return this.address.isBaltimoreCityResident()
    }

    // Private

    private postInitialize() {
        this.throwOnInvalidIds()
        this.throwOnInvalidPhone();
    }

    private throwOnInvalidIds(): void {
        if (dedupe(this.ids).length < 2) {
            throw new Error(
                "Resident must have 2 different forms of ID at a minimum."
            )
        }
    }

    private throwOnInvalidPhone() {
        if (!this.phone) {
            throw new Error(`Resident requires a valid phone number.${this.email ? " An email address is not a substitute for a phone number." : ""}`);
        }
    }
}