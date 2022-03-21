import React from "react";
import { CompanySearchInputProps } from ".";
import { DaDataAPI } from "api/DaDataAPI";
import { DaDataCompany } from "types/DaDataTypes";
import { DaDataSearchInput } from "components/shared/DaDataSearchInput";
import styles from "./CompanySearchInput.module.scss";

function CompanySearchInput(props: CompanySearchInputProps) {
    async function searchCompanies(query: string) {
        const searchResult = await DaDataAPI.searchCompanies(query);

        if (searchResult.status === 200) {
            return searchResult.data.suggestions;
        }

        return [];
    }

    return (
        <DaDataSearchInput
            id="dadata-company-search-input"
            placeholder={props.placeholder || "Введите название компании, адрес, ИНН или ОГРН"}
            searchItems={props.searchItems || searchCompanies}
            itemKey={props.itemKey || "CompanySearchInput_company_"}
            itemComponent={
                props.itemComponent ||
                ((company: DaDataCompany) => (
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

export { CompanySearchInput };
