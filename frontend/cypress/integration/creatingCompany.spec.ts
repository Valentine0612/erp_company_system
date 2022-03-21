import faker from "@faker-js/faker";
import { CompanyTypeEnum, CompanyTypesArray } from "enums/CompanyTypeEnum";
import { FormFakerUtils } from "utils/FormFakerUtils";

function selfCompanyCreating(companyType: CompanyTypeEnum) {
    const companyFindName = faker.git.shortSha();
    const bankFindName = faker.git.shortSha();

    cy.get("input#dadata-company-search-input").type(companyFindName);
    cy.contains("div", "Ввести данные компании вручную").click();

    cy.get("input#dadata-bank-search-input").type(bankFindName);
    cy.contains("div", "Ввести данные вручную").click();

    const companyFullName = faker.datatype.uuid();
    const companyShortName = faker.git.shortSha();
    const companyOwnerName = `${faker.name.lastName(0)} ${faker.name.firstName(0)} ${faker.name.middleName(0)}`;
    const companyEmail = FormFakerUtils.generateRandomEmail();
    const companyAddress = faker.address.streetAddress(true);
    const companyPhone = faker.phone.phoneNumber("9#########");
    const companyInn = FormFakerUtils.generateRandomStringNumber(12);
    const companyOgrn = FormFakerUtils.generateRandomStringNumber(13);
    const companyOkpo = FormFakerUtils.generateRandomStringNumber(8);
    const companyRs = FormFakerUtils.generateRandomStringNumber(20);
    const companyKs = FormFakerUtils.generateRandomStringNumber(20);
    const companyBik = "044525225";

    cy.contains("Тип занятости").click();
    cy.contains(CompanyTypesArray.find((item) => item.type === companyType)?.name || "").click();

    cy.get('input[name="full_name"]').type(companyFullName);
    cy.get('input[name="short_name"]').type(companyShortName);
    cy.get('input[name="owner"]').type(companyOwnerName);
    cy.get('input[name="email"]').type(companyEmail);
    cy.get('input[name="address"]').type(companyAddress);
    cy.get('input[name="phone"]').type(companyPhone);
    cy.get('input[name="inn"]').type(companyInn);
    cy.get('input[name="ogrn"]').type(companyOgrn);
    cy.get('input[name="okpo"]').type(companyOkpo);
    cy.get('input[name="rs"]').type(companyRs);
    cy.get('input[name="ks"]').type(companyKs);
    cy.get('input[name="bik"]').type(companyBik);

    if (companyType === CompanyTypeEnum.OOO) {
        const companyKpp = FormFakerUtils.generateRandomStringNumber(9);
        cy.get('input[name="kpp"]').type(companyKpp);
    }

    cy.contains("button", "Далее").click();

    const managerLastName = faker.name.lastName(0);
    const managerFirstName = faker.name.firstName(0);
    const managerMiddleName = faker.name.middleName(0);
    const managerEmail = FormFakerUtils.generateRandomEmail();
    const managerPhone = faker.phone.phoneNumber("9#########");

    cy.get('input[name="surname"]').type(managerLastName);
    cy.get('input[name="name"]').type(managerFirstName);
    cy.get('input[name="patronymic"]').type(managerMiddleName);
    cy.get('input[name="email"]').type(managerEmail);
    cy.get('input[name="phone"]').type(managerPhone);
    cy.contains("button", "Создать").click();

    cy.wait("@creatingCompany").should((xhr) => {
        expect(xhr.response?.statusCode, "Successful creating company").to.equal(201);
    });
}

describe("Company creating", () => {
    beforeEach(() => {
        faker.setLocale("ru");
        cy.intercept({ method: "POST", url: Cypress.env().DJANGO_URL + "/main/companies/" }).as("creatingCompany");

        cy.visit(Cypress.env().NEXT_URL);

        const login = Cypress.env().CYPRESS_TEST_STAFF_LOGIN;
        const password = Cypress.env().CYPRESS_TEST_STAFF_PASSWORD;

        cy.get('input[name="login"]').type(login);
        cy.get('input[name="password"]').type(password);
        cy.contains("button", "Войти").click();

        cy.location("pathname").should("eq", "/staff");
        cy.contains("a", "Добавить").should("have.attr", "href", "/staff/create-company").click();
        cy.location("pathname").should("eq", "/staff/create-company");
    });

    it("Self IP company creating", () => {
        selfCompanyCreating(CompanyTypeEnum.IP);
    });

    it("Self OOO company creating", () => {
        selfCompanyCreating(CompanyTypeEnum.OOO);
    });
});

export {};
