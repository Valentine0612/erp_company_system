import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(path.resolve(), ".env") });

function getValidURL(url) {
    if (typeof url !== "string") return "";
    return url[url.length] === "/" ? url.slice(0, url.length - 1) : url;
}

const JWT_AUTH_HEADER_PREFIX = process.env.JWT_AUTH_HEADER_PREFIX || "";
const DJANGO_URL = getValidURL(process.env.DJANGO_URL);
const NEXT_URL = getValidURL(process.env.NEXT_URL);
const DADATA_API_KEY = process.env.DADATA_API_KEY || "";
const DADATA_SECRET_KEY = process.env.DADATA_SECRET_KEY || "";
const CYPRESS_TEST_STAFF_LOGIN = process.env.CYPRESS_TEST_STAFF_LOGIN || "";
const CYPRESS_TEST_STAFF_PASSWORD = process.env.CYPRESS_TEST_STAFF_PASSWORD || "";

if (
    !(
        JWT_AUTH_HEADER_PREFIX &&
        DJANGO_URL &&
        NEXT_URL &&
        DADATA_API_KEY &&
        DADATA_SECRET_KEY &&
        CYPRESS_TEST_STAFF_LOGIN &&
        CYPRESS_TEST_STAFF_PASSWORD
    )
)
    console.error(
        [
            "---------------------------------",
            "-------- Error .env file --------",
            "---------------------------------",
        ].join("\n")
    );

module.exports = (on, config) => {
    config.env.JWT_AUTH_HEADER_PREFIX = process.env.JWT_AUTH_HEADER_PREFIX;
    config.env.DJANGO_URL = process.env.DJANGO_URL;
    config.env.NEXT_URL = process.env.NEXT_URL;
    config.env.DADATA_API_KEY = process.env.DADATA_API_KEY;
    config.env.DADATA_SECRET_KEY = process.env.DADATA_SECRET_KEY;
    config.env.CYPRESS_TEST_STAFF_LOGIN = process.env.CYPRESS_TEST_STAFF_LOGIN;
    config.env.CYPRESS_TEST_STAFF_PASSWORD = process.env.CYPRESS_TEST_STAFF_PASSWORD;

    return config;
};
