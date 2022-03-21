import React from "react";
import { BankSearchInputProps } from ".";
import { DaDataAPI } from "api/DaDataAPI";
import { DaDataBank } from "types/DaDataTypes";
import { DaDataSearchInput } from "components/shared/DaDataSearchInput";
import styles from "./BankSearchInput.module.scss";

function BankSearchInput(props: BankSearchInputProps) {
    async function searchCompanies(query: string) {
        const searchResult = await DaDataAPI.searchBanks(query);

        if (searchResult.status === 200) {
            return searchResult.data.suggestions;
        }

        return [];
    }

    return (
        <DaDataSearchInput
            id="dadata-bank-search-input"
            placeholder={props.placeholder || "Введите название, БИК, SWIFT или ИНН"}
            searchItems={props.searchItems || searchCompanies}
            itemKey={props.itemKey || "BankSearchInput_bank__"}
            itemComponent={
                props.itemComponent ||
                ((company: DaDataBank) => (
                    <>
                        <div className={styles.companyName}>{company.value}</div>
                        <div className={styles.companyAddress}>{company.data.address.value}</div>
                    </>
                ))
            }
            {...props}
        />
    );
}

export { BankSearchInput };
