export class PrettyUtils {
    /**
     * Replace pattern's "_" symbols to value's symbols
     * @param {string} value
     * @param {string} pattern
     * @returns {string} Formatted string
     */
    public static prettyStringWithPattern(value: string, pattern: string) {
        let result = pattern;
        value.split("").forEach((char) => (result = result.replace("_", char)));
        return result;
    }

    public static getUserFullName(user: { name: string; surname: string; patronymic?: string }) {
        return [user.surname, user.name, user.patronymic].join(" ").trim();
    }

    /**
     * @param {string} phone - Phone for formatting (Example: +71234567890)
     * @returns {string} Formatted date (Example: +7 (123) 456-78-90)
     */
    public static getFormattedPhone(phone: string) {
        return this.prettyStringWithPattern(phone, "__ (___) ___-__-__");
    }

    /**
     * @param {string} date - Date for formatting (Example: 31.12.2020)
     * @param {boolean} reverse - Reverse formatting
     * @returns {string} Formatted date (Example: 2020-12-31)
     */
    public static getFormattedDate(date: string, reverse = false) {
        if (reverse) return (date as string).split("-").reverse().join(".");
        return (date as string).split(".").reverse().join("-");
    }
}
