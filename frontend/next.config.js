/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const path = require("path");
const dotenv = require("dotenv");

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

if (!(JWT_AUTH_HEADER_PREFIX && DJANGO_URL && NEXT_URL && DADATA_API_KEY && DADATA_SECRET_KEY))
    console.error(
        [
            "---------------------------------",
            "-------- Error .env file --------",
            "---------------------------------",
        ].join("\n")
    );

module.exports = {
    reactStrictMode: true,
    env: {
        DJANGO_URL: getValidURL(process.env.DJANGO_URL || ""),
        NEXT_URL: getValidURL(process.env.NEXT_URL || ""),
        JWT_AUTH_HEADER_PREFIX,
        DADATA_API_KEY,
        DADATA_SECRET_KEY,
    },
};
