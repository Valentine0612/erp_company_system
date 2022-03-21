import type { NextPage } from "next";
import React, { ChangeEvent, useRef, useState } from "react";
import { AccountPageWrapper } from "components/wrappers/AccountPageWrapper";
import { managersAccountNavbarList } from "constants/navbarLists";
import styles from "styles/pages/manager/ManagerNewTaskPage.module.scss";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { defaultPagination, DEFAULT_PAGINATION_LIMIT, PaginationAPIFilter } from "types/Pagination";
import {
    CompanyAPI,
    CompanyAPIGetAllCompanyEmployeesData,
    CompanyAPIGetAllCompanyEmployeesFilter,
} from "api/CompanyAPI";
import { useDispatch, useSelector } from "react-redux";
import { AlertionActionCreator } from "store/actionCreators/AlertionActionCreator";
import { PrettyUtils } from "utils/PrettyUtils";
import { useForm } from "react-hook-form";
import { PRICE_REGEXP } from "constants/regexps";
import { TaskAPI, TaskAPICreateTaskRequestData, TaskAPIUpdateTaskByManagerRequestData } from "api/TaskAPI";
import { UserStateEnum, UserStates } from "enums/UserStateEnum";
import { acceptedFilesTypes } from "constants/acceptedFilesTypes";
import Head from "next/head";
import { Task, TaskDocument, TaskEmployee, TaskID } from "types/Task";
import { RoutesCreator } from "utils/RoutesCreator";
import { DEFAULT_DATE_FORMAT, DEFAULT_SYSTEM_COMMISSION_PERCENTS } from "constants/defaults";
import {
    Button,
    Card,
    Input,
    Textarea,
    FileInput,
    DateInput,
    Table,
    Avatar,
    PaginationControl,
    FormErrorsBlock,
    Breadcrumbs,
} from "components/shared";
import { StoreWrapper } from "utils/StoreWrapper";
import { IState } from "store";

const ManagerNewTaskPage: NextPage<ManagerNewTaskPageProps> = (props) => {
    const [documentsArray, setDocumentsArray] = useState<
        Array<{ uid: string; file?: File; title?: string; oldDocument?: TaskDocument }>
    >(
        props.task?.documents.map((document) => {
            return { uid: uuidv4(), file: undefined, title: document.title, oldDocument: document };
        }) || [{ uid: uuidv4(), file: undefined, title: "", oldDocument: undefined }]
    );

    const [deletedFiles, setDeletedFiles] = useState<Array<number>>([]);

    const [selectedEmployee, setSelectedEmployee] = useState<TaskEmployee | undefined>(props.task?.user || undefined);

    const [employeePagination, setEmployeePagination] = useState<CompanyAPIGetAllCompanyEmployeesData>(
        props.employeePagination
    );
    const [isEmployeesListShown, setIsEmployeesListShown] = useState<boolean>(true);
    const [searchEmployeeText, setSearchEmployeeText] = useState<string>("");
    const [priceCount, setPriceCount] = useState(0);

    const minDateMoment = useRef(moment(moment(new Date()).format(DEFAULT_DATE_FORMAT)));
    const maxDateMoment = useRef(moment(moment(new Date()).add(100, "years").format(DEFAULT_DATE_FORMAT)));

    const { setError, clearErrors, formState, register, handleSubmit, getValues } = useForm({
        defaultValues: props.task
            ? {
                  title: props.task.title,
                  description: props.task.description,
                  price: props.task.price,
                  expireDate: props.task.to_date,
                  startDate: props.task.from_date,
                  documentsArray: undefined,
                  selectedEmployee: undefined,
              }
            : {
                  title: "",
                  description: "",
                  price: "",
                  expireDate: "",
                  startDate: undefined,
                  documentsArray: undefined,
                  selectedEmployee: undefined,
              },
    });

    const dispatch = useDispatch();

    const userState = useSelector((store: IState) => store.user.userInfo);

    function addDocumentOnClick() {
        setDocumentsArray([...documentsArray, { uid: uuidv4(), file: undefined, title: "", oldDocument: undefined }]);
    }

    function removeDocumentOnClick(uid: string) {
        setDocumentsArray(documentsArray.filter((documetItem) => documetItem.uid !== uid));
    }

    function documentTitleOnChange(title: string, uid: string) {
        setDocumentsArray(
            documentsArray.map((documetItem) => (documetItem.uid !== uid ? documetItem : { ...documetItem, title }))
        );
    }

    function documentFileOnChange(file: File | undefined, uid: string) {
        setDocumentsArray(
            documentsArray.map((documetItem) => {
                if (documetItem.uid !== uid) return documetItem;

                if (documetItem.oldDocument) {
                    setDeletedFiles([...deletedFiles, documetItem.oldDocument.id]);
                }

                return {
                    ...documetItem,
                    file,
                    title: documetItem.title || file?.name || "",
                    oldDocument: undefined,
                };
            })
        );
    }

    async function getEmployeePagination(
        searchText?: string,
        pagination: PaginationAPIFilter = { limit: DEFAULT_PAGINATION_LIMIT, offset: 0 }
    ) {
        const filter: CompanyAPIGetAllCompanyEmployeesFilter = {};
        if (searchText || searchEmployeeText) filter.search = searchText || searchEmployeeText;

        const companyEmployeesResult = await CompanyAPI.getAllCompanyEmployees({ filter, pagination });

        if (companyEmployeesResult.status === 200) return setEmployeePagination(companyEmployeesResult.data);

        dispatch(AlertionActionCreator.createAlerion("Ошибка получения исполнителей", "error"));
        console.log(companyEmployeesResult);
    }

    async function onSubmitCreatingNewTask(data: {
        title: string;
        description: string;
        price: string;
        expireDate: string;
        startDate?: string;
    }) {
        if (userState?.banned)
            return dispatch(AlertionActionCreator.createAlerion("Вы не можете создавать задания", "error", 5000));

        const notEmptyDocuments = documentsArray.filter(
            (documentItem) => documentItem.file && documentItem.title && !documentItem.oldDocument
        ) as Array<{ uid: string; file: File; title: string }>;

        if (!selectedEmployee)
            return setError("selectedEmployee", {
                message: "Исполнитель не выбран",
            });

        if (selectedEmployee.state !== UserStateEnum.READY)
            return setError("selectedEmployee", {
                message: "Исполнитель должен быть готов к работе",
            });

        const formattedData: TaskAPICreateTaskRequestData = {
            user: selectedEmployee.id,
            title: data.title,
            description: data.description,
            price: data.price,
            from_date: data.startDate || undefined,
            to_date: data.expireDate,
            files: notEmptyDocuments.map((documentItem) => documentItem.file),
            titles: notEmptyDocuments.map((documentItem) => documentItem.title),
        };

        if (props.edit) updateTask(formattedData, notEmptyDocuments);
        else createTask(formattedData);
    }

    async function updateTask(
        data: TaskAPIUpdateTaskByManagerRequestData,
        newFiles: Array<{ uid: string; file?: File; title?: string; oldDocument?: TaskDocument }>
    ) {
        if (!props.taskId) return;

        await Promise.all([
            TaskAPI.deleteTaskFilesByManager(props.taskId, { documents: deletedFiles }),
            ...newFiles.map((file) =>
                TaskAPI.addTaskFileByManager(props.taskId as number, {
                    title: file.title as string,
                    file: file.file as File,
                })
            ),
        ]);

        const updateTaskResult = await TaskAPI.updateTaskByManager(props.taskId, data);

        if (updateTaskResult.status === 200) return location.assign(RoutesCreator.getManagerTaskRoute(props.taskId));

        dispatch(AlertionActionCreator.createAlerion("Ошибка изменения задания", "error"));
        console.log(updateTaskResult);
    }

    async function createTask(data: TaskAPICreateTaskRequestData) {
        const createTaskResult = await TaskAPI.createTask(data);

        if (createTaskResult.status === 201)
            return location.assign(RoutesCreator.getManagerTaskRoute(createTaskResult.data.id));

        dispatch(AlertionActionCreator.createAlerion("Ошибка создания задания", "error"));
        console.log(createTaskResult);
    }

    return (
        <>
            <Head>
                <title>{props.edit ? "Редактирование задания" : "Новое задание"} | CyberPay</title>
            </Head>

            <AccountPageWrapper navbarList={managersAccountNavbarList}>
                <Breadcrumbs
                    list={
                        props.edit && props.task
                            ? [
                                  { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                                  { text: "Задания", url: RoutesCreator.getManagerAllTasksRoute() },
                                  {
                                      text: props.task.title,
                                      url: RoutesCreator.getManagerTaskRoute(props.task.id),
                                  },
                                  {
                                      text: "Изменить",
                                      url: RoutesCreator.getManagerNewTaskRoute({ edit: true, taskId: props.task.id }),
                                  },
                              ]
                            : [
                                  { text: "Кабинет менеджера", url: RoutesCreator.getManagerRoute() },
                                  { text: "Задания", url: RoutesCreator.getManagerAllTasksRoute() },
                                  { text: "Новое задание", url: RoutesCreator.getManagerNewTaskRoute() },
                              ]
                    }
                />

                <h2 className={styles.pageTitle}>{props.edit ? "Редактирование задания" : "Новое задание"}</h2>

                <form onSubmit={handleSubmit(onSubmitCreatingNewTask)} className={styles.cardsWrapper}>
                    <Card className={styles.card}>
                        <Input
                            placeholder={"Введите название"}
                            error={Boolean(formState.errors.title)}
                            {...register("title", {
                                required: "Название - обязательное поле",
                                maxLength: { value: 200, message: "Максимальная длина названия 200 символов" },
                            })}
                        />

                        <Textarea
                            placeholder={"Введите описание"}
                            rows={5}
                            error={Boolean(formState.errors.description)}
                            {...register("description")}
                        />

                        <Input
                            placeholder={"Стоимость работы"}
                            error={Boolean(formState.errors.price)}
                            info={`Система удерживает ${DEFAULT_SYSTEM_COMMISSION_PERCENTS}% комиссии (${(
                                (priceCount * DEFAULT_SYSTEM_COMMISSION_PERCENTS) /
                                100
                            ).toFixed(2)})`}
                            {...register("price", {
                                required: "Стоимость работы - обязательное поле",
                                pattern: {
                                    value: PRICE_REGEXP,
                                    message: "Некорректная стоимость работы. Пример: 123456.78",
                                },
                                validate: {
                                    isNumber: (value) =>
                                        !Number.isNaN(Number(value)) ||
                                        "Некорректная стоимость работы. Пример: 123456.78",
                                },
                                onChange: (event: ChangeEvent<HTMLInputElement>) =>
                                    setPriceCount(Number(event.target.value) || 0),
                            })}
                        />

                        <DateInput
                            placeholder="Дата начала работ"
                            min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                            max={maxDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                            error={Boolean(formState.errors.startDate)}
                            {...register("startDate", {
                                validate: {
                                    maxDate: (value) =>
                                        !value ||
                                        moment(value).isSameOrBefore(maxDateMoment.current) ||
                                        `Максимальная дата начала работ - ${maxDateMoment.current.format(
                                            "DD.MM.YYYY"
                                        )}`,
                                    minDate: (value) =>
                                        !value ||
                                        moment(value).isSameOrAfter(minDateMoment.current) ||
                                        `Минимальная дата начала работ - ${minDateMoment.current.format("DD.MM.YYYY")}`,
                                },
                            })}
                        />

                        <DateInput
                            placeholder="Дата окончания работ"
                            min={minDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                            max={maxDateMoment.current.format(DEFAULT_DATE_FORMAT)}
                            error={Boolean(formState.errors.expireDate)}
                            {...register("expireDate", {
                                required: "Дата окончания работ - обязательное поле",
                                validate: {
                                    maxDate: (value) =>
                                        moment(value).isSameOrBefore(maxDateMoment.current) ||
                                        `Максимальная дата окончания работ - ${maxDateMoment.current.format(
                                            "DD.MM.YYYY"
                                        )}`,
                                    minDate: (value) =>
                                        moment(value).isSameOrAfter(minDateMoment.current) ||
                                        `Минимальная дата окончания работ - ${minDateMoment.current.format(
                                            "DD.MM.YYYY"
                                        )}`,
                                    lessThanStartDate: (value) =>
                                        !getValues("startDate") ||
                                        moment(getValues("startDate")).isSameOrBefore(moment(value)) ||
                                        "Дата окончания работ должна быть больше даты начала",
                                },
                            })}
                        />

                        <FormErrorsBlock errors={formState.errors} />

                        <Button type="submit" className={styles.saveButton}>
                            {props.edit ? "Сохранить изменения" : "Создать задание"}
                        </Button>
                    </Card>

                    <div>
                        <Card className={styles.card}>
                            {documentsArray.map((documentItem) => (
                                <div className={styles.documentElement} key={`NewTast__document__${documentItem.uid}`}>
                                    <Input
                                        withoutLabel
                                        placeholder={"Название документа"}
                                        value={documentItem.title}
                                        accept={acceptedFilesTypes}
                                        disabled={Boolean(documentItem.oldDocument)}
                                        onChange={(event) =>
                                            documentTitleOnChange(event.target.value, documentItem.uid)
                                        }
                                    />

                                    <FileInput
                                        placeholder="Загрузить документ"
                                        accept={acceptedFilesTypes}
                                        onChange={(event) =>
                                            event.target.files
                                                ? documentFileOnChange(event.target.files[0], documentItem.uid)
                                                : documentFileOnChange(undefined, documentItem.uid)
                                        }
                                    />

                                    <Button
                                        className={styles.deleteButton}
                                        styleType="white"
                                        onClick={() => {
                                            removeDocumentOnClick(documentItem.uid);

                                            if (documentItem.oldDocument)
                                                setDeletedFiles([...deletedFiles, documentItem.oldDocument.id]);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                </div>
                            ))}

                            <Button type="button" className={styles.saveButton} onClick={addDocumentOnClick}>
                                Добавить документ
                            </Button>
                        </Card>

                        <Card className={styles.card}>
                            <Input
                                name="search"
                                placeholder={"Поиск исполнителя"}
                                icon={faSearch}
                                onChange={(event) => {
                                    setSearchEmployeeText(event.target.value);
                                    getEmployeePagination(event.target.value);
                                    setIsEmployeesListShown(true);
                                }}
                            />

                            {selectedEmployee && (
                                <Table className={styles.employeeTable} withoutHeader>
                                    <div className={[styles.employeeItem, styles.selected].join(" ")}>
                                        <div className={styles.employeeInfo}>
                                            <Avatar
                                                src={selectedEmployee.avatar}
                                                alt={selectedEmployee.email}
                                                size="small"
                                                className={styles.avatar}
                                            />

                                            <div>
                                                <div className={[styles.employeeTextInfo, styles.name].join(" ")}>
                                                    {PrettyUtils.getUserFullName(selectedEmployee)}
                                                </div>
                                                <div className={styles.employeeTextInfo}>{selectedEmployee.email}</div>
                                                <div className={styles.employeeTextInfo}>{selectedEmployee.phone}</div>
                                                <div className={styles.employeeTextInfo}>
                                                    {UserStates[selectedEmployee.state]}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Table>
                            )}

                            {isEmployeesListShown &&
                                ((employeePagination.results.length > 0 && (
                                    <Table className={styles.employeeTable} withoutHeader>
                                        {employeePagination.results.map((employee) => (
                                            <div
                                                className={styles.employeeItem}
                                                key={`NewTast__employee__${employee.id}`}
                                            >
                                                <div className={styles.employeeInfo}>
                                                    <Avatar
                                                        src={employee.avatar}
                                                        alt={employee.email}
                                                        size="small"
                                                        className={styles.avatar}
                                                    />

                                                    <div>
                                                        <div
                                                            className={[styles.employeeTextInfo, styles.name].join(" ")}
                                                        >
                                                            {PrettyUtils.getUserFullName(employee)}
                                                        </div>
                                                        <div className={styles.employeeTextInfo}>{employee.email}</div>
                                                        <div className={styles.employeeTextInfo}>{employee.phone}</div>
                                                        <div className={styles.employeeTextInfo}>
                                                            {UserStates[employee.state]}
                                                        </div>
                                                        <div className={styles.employeeTextInfo}>{employee.about}</div>
                                                    </div>
                                                </div>

                                                <Button
                                                    type="button"
                                                    className={styles.selectEmployeeButton}
                                                    onClick={() => {
                                                        clearErrors("selectedEmployee");
                                                        setSelectedEmployee(employee);
                                                        setIsEmployeesListShown(false);
                                                    }}
                                                >
                                                    Выбрать
                                                </Button>
                                            </div>
                                        ))}
                                    </Table>
                                )) || <div>Исполнители не найдены</div>)}

                            <PaginationControl
                                itemsCount={employeePagination.count}
                                onPageSelected={(pageNumber) =>
                                    getEmployeePagination(searchEmployeeText, {
                                        limit: DEFAULT_PAGINATION_LIMIT,
                                        offset: (pageNumber - 1) * DEFAULT_PAGINATION_LIMIT,
                                    })
                                }
                            />
                        </Card>
                    </div>
                </form>
            </AccountPageWrapper>
        </>
    );
};

ManagerNewTaskPage.getInitialProps = StoreWrapper.getInitialPageProps<ManagerNewTaskPageProps>(
    {
        notAuthenticatedRedirect: "/",
        storeRedirect: {
            redirect: (store) => !store.user.userInfo?.manager,
            redirectLocation: "/",
        },
    },
    () => async (context) => {
        const companyEmployeesResult = await CompanyAPI.getAllCompanyEmployees({}, context.req);

        if (context.query.edit === "true" && !Number.isNaN(Number(context.query.taskId))) {
            const taskResult = await TaskAPI.getTask(Number(context.query.taskId), context.req);

            if (taskResult.status === 200)
                return {
                    edit: true,
                    task: taskResult.data,
                    taskId: Number(context.query.taskId),
                    employeePagination:
                        companyEmployeesResult.status === 200
                            ? (companyEmployeesResult.data as CompanyAPIGetAllCompanyEmployeesData)
                            : defaultPagination,
                };

            context.res?.writeHead(302, { Location: "/" });
            context.res?.end();
            return;
        }

        return {
            edit: false,
            employeePagination:
                companyEmployeesResult.status === 200
                    ? (companyEmployeesResult.data as CompanyAPIGetAllCompanyEmployeesData)
                    : defaultPagination,
        };
    }
);

export type ManagerNewTaskPageProps = {
    edit?: boolean;
    task?: Task;
    taskId?: TaskID;
    employeePagination: CompanyAPIGetAllCompanyEmployeesData;
};

export default ManagerNewTaskPage;
