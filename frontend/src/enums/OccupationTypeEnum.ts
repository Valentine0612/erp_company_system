export enum OccupationTypeEnum {
    IP = "SP",
    SZ = "SE",
    RIG = "FR",
    FL = "NP",
}

export const OccupationTypesArray = [
    { type: OccupationTypeEnum.FL, name: "Физ. лицо" },
    { type: OccupationTypeEnum.SZ, name: "Самозанятый" },
    { type: OccupationTypeEnum.IP, name: "ИП" },
    { type: OccupationTypeEnum.RIG, name: "Резидент иностранного государства" },
];

export const OccupationTypes = {
    [OccupationTypeEnum.FL]: "Физ. лицо",
    [OccupationTypeEnum.SZ]: "Самозанятый",
    [OccupationTypeEnum.IP]: "ИП",
    [OccupationTypeEnum.RIG]: "Резидент иностранного государства",
};
