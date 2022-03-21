import React from "react";
import { PassportIssuePlaceSearchInputProps } from ".";
import { DaDataAPI } from "api/DaDataAPI";
import { DaDataSearchInput } from "components/shared/DaDataSearchInput";
import styles from "./PassportIssuePlaceSearchInput.module.scss";

function PassportIssuePlaceSearchInput(props: PassportIssuePlaceSearchInputProps) {
    async function searchPassportIssuePlaces(query: string) {
        const searchResult = await DaDataAPI.searchPassportIssuePlace(query);
        if (searchResult.status === 200) return searchResult.data.suggestions;
        return [];
    }

    return (
        <DaDataSearchInput
            id="dadata-passport-issue-place-search-input"
            placeholder={props.placeholder || "Введите место выдачи паспорта или код отделения"}
            searchItems={props.searchItems || searchPassportIssuePlaces}
            itemKey={props.itemKey || "PassportIssuePlaceSearchInput_bank__"}
            itemComponent={
                props.itemComponent ||
                ((place) => (
                    <>
                        <div className={styles.placeName}>{place.data.name}</div>
                        <div className={styles.placeCode}>{place.data.code}</div>
                    </>
                ))
            }
            {...props}
        />
    );
}

export { PassportIssuePlaceSearchInput };
