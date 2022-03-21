import faker from "@faker-js/faker";
import { CountryAPIGetAllCountriesData } from "api/CountryAPI";
import { OccupationTypeEnum, OccupationTypes } from "enums/OccupationTypeEnum";
import { FormFakerUtils } from "utils/FormFakerUtils";

function selectUserTypeRegistration(userType: OccupationTypeEnum) {
    cy.contains("Тип занятости").click();
    cy.contains(OccupationTypes[userType] || "").click();
    cy.contains("button", "Далее").click();
}

function personDataRegistrate() {
    cy.intercept("POST", Cypress.env().DJANGO_URL + "/main/check_email/").as("checkingEmail");
    cy.get('input[name="surname"]').type(faker.name.lastName(0));
    cy.get('input[name="name"]').type(faker.name.firstName(0));
    cy.get('input[name="patronymic"]').type(faker.name.middleName(0));
    cy.get('input[name="email"]').type(FormFakerUtils.generateRandomEmail());
    cy.get('input[name="phone"]').type(faker.phone.phoneNumber("9#########"));
    cy.contains("button", "Далее").click();
    cy.wait("@checkingEmail");
}

function bankDetailsCardRegistrate() {
    const card = FormFakerUtils.generateRandomStringNumber(16);

    cy.contains("Тип выплаты").click();
    cy.contains("Номер карты").click();
    cy.get('input[name="card"]').type(card);
    cy.contains("button", "Далее").click();
}

function bankDetailsBankAccountOnlyRegistrate() {
    const bik = "044525225";
    const rs = FormFakerUtils.generateRandomStringNumber(20);
    const ks = FormFakerUtils.generateRandomStringNumber(20);
    const bankAccount = FormFakerUtils.generateRandomStringNumber(20);

    cy.get('input[name="bik"]').type(bik);
    cy.get('input[name="rs"]').type(rs);
    cy.get('input[name="ks"]').type(ks);
    cy.get('input[name="bank_account"]').type(bankAccount);
    cy.contains("button", "Далее").click();
}

function filesRegistrate(inputsNames: Array<string>) {
    inputsNames.forEach((name) =>
        cy.get(`input[name="${name}"]`).attachFile("blank.pdf", { subjectType: "drag-n-drop" })
    );

    cy.contains("button", "Далее").click();
}

function acceptRegistration() {
    cy.get('label[for="AcceptForm__checkbox_1"]').click("left");
    cy.get('label[for="AcceptForm__checkbox_2"]').click("left");
    cy.contains("button", "Готово").click();
}

describe("Simple employees registration", () => {
    beforeEach(() => {
        cy.visit(Cypress.env().NEXT_URL + "/register");

        cy.intercept({ method: "POST", url: Cypress.env().DJANGO_URL + "/main/register/**" }).as("registration");
        cy.intercept({ method: "POST", url: Cypress.env().DJANGO_URL + "/main/register/documents/" }).as(
            "documentsUpload"
        );
    });

    it("FL Registration", () => {
        selectUserTypeRegistration(OccupationTypeEnum.FL);
        personDataRegistrate();

        const passport = FormFakerUtils.generateRandomStringNumber(10);
        const placeOfIssue = faker.company.companyName();
        const issuedCode = FormFakerUtils.generateRandomStringNumber(6);
        const issued = FormFakerUtils.generateFormattedStringDate();
        const dob = FormFakerUtils.generateFormattedStringDate();
        const pob = faker.address.streetAddress(true);
        const residence = faker.address.streetAddress(true);
        const snils = FormFakerUtils.generateRandomStringNumber(11);
        const inn = FormFakerUtils.generateRandomStringNumber(12);

        cy.get('input[name="passport"]').type(passport);
        cy.get('input[name="place_of_issue"]').type(placeOfIssue);
        cy.get('input[name="issued_code"]').type(issuedCode);
        cy.get('input[name="issued"]').type(issued);
        cy.get('input[name="dob"]').type(dob);
        cy.get('input[name="pob"]').type(pob);
        cy.get('input[name="residence"]').type(residence);
        cy.get('input[name="snils"]').type(snils);
        cy.get('input[name="inn"]').type(inn);
        cy.contains("button", "Далее").click();

        filesRegistrate(["password_1", "password_2", "selfi"]);
        bankDetailsCardRegistrate();
        acceptRegistration();

        cy.wait("@registration").should((xhr) => {
            expect(xhr.response?.statusCode, "Successful FL Registration").to.equal(201);
        });

        cy.wait("@documentsUpload").should((xhr) => {
            expect(xhr.response?.statusCode, "Successful documents upload of FL Registration").to.equal(201);
        });
    });

    it("SZ Registration", () => {
        selectUserTypeRegistration(OccupationTypeEnum.SZ);
        personDataRegistrate();

        const passport = FormFakerUtils.generateRandomStringNumber(10);
        const placeOfIssue = faker.company.companyName();
        const issuedCode = FormFakerUtils.generateRandomStringNumber(6);
        const issued = FormFakerUtils.generateFormattedStringDate();
        const dob = FormFakerUtils.generateFormattedStringDate();
        const pob = faker.address.streetAddress(true);
        const residence = faker.address.streetAddress(true);
        const snils = FormFakerUtils.generateRandomStringNumber(11);
        const inn = FormFakerUtils.generateRandomStringNumber(12);

        cy.get('input[name="passport"]').type(passport);
        cy.get('input[name="place_of_issue"]').type(placeOfIssue);
        cy.get('input[name="issued_code"]').type(issuedCode);
        cy.get('input[name="issued"]').type(issued);
        cy.get('input[name="dob"]').type(dob);
        cy.get('input[name="pob"]').type(pob);
        cy.get('input[name="residence"]').type(residence);
        cy.get('input[name="snils"]').type(snils);
        cy.get('input[name="inn"]').type(inn);
        cy.contains("button", "Далее").click();

        filesRegistrate(["password_1", "password_2", "selfi"]);
        bankDetailsCardRegistrate();
        acceptRegistration();

        cy.wait("@registration").should((xhr) => {
            expect(xhr.response?.statusCode, "Successful SZ Registration").to.equal(201);
        });

        cy.wait("@documentsUpload").should((xhr) => {
            expect(xhr.response?.statusCode, "Successful documents upload of SZ Registration").to.equal(201);
        });
    });

    it("IP Registration", () => {
        selectUserTypeRegistration(OccupationTypeEnum.IP);
        personDataRegistrate();

        const passport = FormFakerUtils.generateRandomStringNumber(10);
        const placeOfIssue = faker.company.companyName();
        const issuedCode = FormFakerUtils.generateRandomStringNumber(6);
        const issued = FormFakerUtils.generateFormattedStringDate();
        const residence = faker.address.streetAddress(true);
        const dob = FormFakerUtils.generateFormattedStringDate();
        const pob = faker.address.streetAddress(true);
        const ogrnip = FormFakerUtils.generateRandomStringNumber(15);
        const inn = FormFakerUtils.generateRandomStringNumber(12);

        cy.get('input[name="passport"]').type(passport);
        cy.get('input[name="place_of_issue"]').type(placeOfIssue);
        cy.get('input[name="issued_code"]').type(issuedCode);
        cy.get('input[name="issued"]').type(issued);
        cy.get('input[name="residence"]').type(residence);
        cy.get('input[name="dob"]').type(dob);
        cy.get('input[name="pob"]').type(pob);
        cy.get('input[name="ogrnip"]').type(ogrnip);
        cy.get('input[name="inn"]').type(inn);
        cy.contains("button", "Далее").click();

        filesRegistrate(["password_1", "password_2", "selfi", "inn", "egrip"]);
        bankDetailsBankAccountOnlyRegistrate();
        acceptRegistration();

        cy.wait("@registration").should((xhr) => {
            expect(xhr.response?.statusCode, "Successful IP Registration").to.equal(201);
        });

        cy.wait("@documentsUpload").should((xhr) => {
            expect(xhr.response?.statusCode, "Successful documents upload of IP Registration").to.equal(201);
        });
    });

    it("RIG Registration", () => {
        cy.request("GET", Cypress.env().DJANGO_URL + "/main/countries/").then(
            (response: Cypress.Response<CountryAPIGetAllCountriesData>) => {
                if (!(response.status === 200 && response.body.length)) throw new Error("RIG Country not found");

                const countryName = response.body[0].name;

                selectUserTypeRegistration(OccupationTypeEnum.RIG);
                personDataRegistrate();

                const passport = FormFakerUtils.generateRandomStringNumber(10);
                const residence = faker.address.streetAddress(true);
                const inn = FormFakerUtils.generateRandomStringNumber(12);

                cy.get('input[name="passport"]').type(passport);
                cy.get('input[name="residence"]').type(residence);
                cy.get('input[name="inn"]').type(inn);

                cy.contains("Гражданство").click();
                cy.contains(countryName).click();
                cy.contains("button", "Далее").click();

                filesRegistrate(["password_1", "password_2", "selfi", "migrate", "notification"]);
                bankDetailsCardRegistrate();
                acceptRegistration();

                cy.wait("@registration").should((xhr) => {
                    expect(xhr.response?.statusCode, "Successful RIG Registration").to.equal(201);
                });

                cy.wait("@documentsUpload").should((xhr) => {
                    expect(xhr.response?.statusCode, "Successful documents upload of RIG Registration").to.equal(201);
                });
            }
        );
    });
});

export {};
