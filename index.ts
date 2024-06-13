import {
    FormOfIdentity
} from "./constants"
import Address from "./models/address"
import LibraryCard from "./models/library_card"
import Resident from "./models/resident"

import { default as ADDRESSES } from "./seeds/addresses"
import { default as RESIDENTS } from "./seeds/residents"

const it = async (
    testing: string,
    options: {
        address: Address
        ids: FormOfIdentity[]
        resident: { name: string; phone: string; email?: string }
    }
) => {
    try {
        const resident = new Resident(
            options.address,
            options.ids,
            options.resident
        )

        return { testing, result: await new LibraryCard(resident).borrowBook() }
    } catch (error) {
        return { testing, result: `ERROR: ${error.message}` }
    }
}

Promise.all([
    it("as a baltimore city resident, can borrow a book", {
        address: ADDRESSES.baltimore,
        ids: [FormOfIdentity.DRIVERS_LICENSE, FormOfIdentity.PASSPORT],
        resident: RESIDENTS.baltimore,
    }),
    it(
        "as a maryland resident, can get a library card but cannot borrow a book",
        {
            address: ADDRESSES.towson,
            ids: [FormOfIdentity.DRIVERS_LICENSE, FormOfIdentity.PASSPORT],
            resident: RESIDENTS.towson,
        }
    ),
    it("as a non-maryland resident, cannot get a library card", {
        address: ADDRESSES.nyc,
        ids: [FormOfIdentity.DRIVERS_LICENSE, FormOfIdentity.PASSPORT],
        resident: RESIDENTS.nyc,
    }),
    it("must have a phone to create a resident", {
        address: ADDRESSES.baltimore,
        ids: [FormOfIdentity.DRIVERS_LICENSE, FormOfIdentity.PASSPORT],
        // @ts-ignore
        resident: { ...RESIDENTS.baltimore, phone: undefined },
    }),
    it(
        "must have a phone to create a resident, even though an email is present",
        {
            address: ADDRESSES.baltimore,
            ids: [
                FormOfIdentity.DRIVERS_LICENSE,
                FormOfIdentity.BIRTH_CERTIFICATE,
            ],
            // @ts-ignore
            resident: {
                ...RESIDENTS.baltimore,
                phone: undefined,
                email: "taco@taco.com",
            },
        }
    ),
    it("must have 2 valid forms of id to get a library card", {
        address: ADDRESSES.baltimore,
        ids: [FormOfIdentity.BIRTH_CERTIFICATE],
        resident: RESIDENTS.baltimore,
    }),
    it("must have 2 valid and *distinct* forms of id to get a library card", {
        address: ADDRESSES.baltimore,
        ids: [
            FormOfIdentity.BIRTH_CERTIFICATE,
            FormOfIdentity.BIRTH_CERTIFICATE,
        ],
        resident: RESIDENTS.baltimore,
    }),
]).then((results) => {
    console.table(
        results.reduce((sum, item) => {
            return { ...sum, [item.testing]: [item.result] }
        }, {})
    )
})
