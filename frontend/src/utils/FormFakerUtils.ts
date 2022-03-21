import faker from "@faker-js/faker";

export class FormFakerUtils {
    public static generateFormattedStringDate() {
        const date = faker.date.past();
        const year = String(date.getFullYear());

        let month = String(date.getMonth() + 1);
        if (Number(month) < 10) month = "0" + month;

        let day = String(date.getDate());
        if (Number(day) < 10) day = "0" + day;
        if (Number(month) === 2 && Number(day) > 28) day = "28";

        return `${day}.${month}.${year}`;
    }

    public static generateRandomStringNumber(length: number) {
        return String(faker.datatype.number({ min: 10 ** (length - 1), max: 10 ** length - 1, precision: 1 }));
    }

    public static generateRandomEmail() {
        const emailDomain = faker.internet.email().split("@")[1];
        const emailName = faker.datatype.uuid().slice(undefined, 12);
        return `${emailName}@${emailDomain}`;
    }
}
