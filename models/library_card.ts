import { FormOfIdentity } from "../constants";
import Resident from "./resident"

export default class LibraryCard {
    resident: Resident
    formsOfId: FormOfIdentity[]

    constructor(resident: Resident) {
        this.resident = resident
        this.formsOfId = this.resident.ids;
    }

    public async borrowBook(): Promise<string> {
        if (!(await this.isLibraryCardable())) {
            return `No library card for you ${this.resident.name}. You must live in Maryland.`
        } else if (!(await this.isLibraryServiceable())) {
            return `No book for you ${this.resident.name}. You must live in Baltimore City.`
        } else {
            return `A book for you ${this.resident.name}.`
        }
    }

    // Private

    /**
     * Any Maryland resident can obtain a City library card, however we only want services connected to it for City residents
     *
     * @returns {Promise<Boolean>}
     */
    private async isLibraryCardable(): Promise<boolean> {
        return await this.resident.isMarylandResident()
    }

    /**
     * Any Maryland resident can obtain a City library card, however we only want services connected to it for City residents
     *
     * @returns {Promise<Boolean>}
     */
    private isLibraryServiceable(): Promise<boolean> {
        return this.resident.isBaltimoreCityResident()
    }
}
