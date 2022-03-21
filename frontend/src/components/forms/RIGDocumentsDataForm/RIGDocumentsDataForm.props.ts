import { RIGDocumentsDataFormOnSubmitData } from ".";
import { Country } from "types/Country";

export type RIGDocumentsDataFormProps = {
    defaultData?: RIGDocumentsDataFormOnSubmitData;
    backButtonOnClick?: () => void;
    onSubmit?: (data: RIGDocumentsDataFormOnSubmitData) => void;
    countries?: Array<Country>;
};
