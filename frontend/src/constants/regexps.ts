export const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
export const PASSWORD_REGEXP = /^[a-zA-Z0-9 `~!@#$%^&*()_+={}[\]\\|:;"'<>,.?/-]+$/;

export const INN_REGEXP_LEGAL_ENTITY = /^\d{10}$/i;
export const INN_REGEXP = /^\d{12}$/i;

export const KPP_REGEXP = /^[\d_]{9}$/i;
export const OGRN_REGEXP = /^\d{13}$/i;
export const OGRNIP_REGEXP = /^\d{15}$/i;
export const OKPO_REGEXP = /^(\d{8}|\d{10})$/i;
export const RS_REGEXP = /^(\d{20}|\d{22})$/i;
export const KS_REGEXP = /^\d{20}$/i;
export const BIK_REGEXP = /^\d{9}$/i;
export const CARD_REGEXP = /^\d{13,16}$/i;
export const BANK_ACCOUNT_REGEXP = /^\d{20}$/i;
export const PRICE_REGEXP = /^\d+\.?\d{0,2}$/i;

export const PATTERN_INPUT_NOT_FILLED_REGEXP = /^[^_]*$/;

export const PASSWORD_REGEXP_ERROR_MESSAGE =
    "Пароль содержит недопустимые символы (только a-z, A-Z, 0-9 и спецсиволы `~!@#$%^&*()_+={}[]\\|:;\"'<>,.?/-)";
