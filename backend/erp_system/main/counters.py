# State for User registration
READY = 'READY'
PROBLEM = 'PROBLEM'
BAN = 'BAN'
CHECK = 'CHECK'
WAITING_EMP = 'WAITING_EMP'
REFUSED = 'REFUSED'
DENIDED = 'DENIDED'

STATE = [
    (READY, 'Готов к работе'),
    (PROBLEM, 'Есть проблемы'),
    (BAN, 'Черный список'),
    (CHECK, 'Проверка документов'),
    (WAITING_EMP, 'Ожидание подписания Исполнителем'),
    (REFUSED, 'Отказался'),
    (DENIDED, 'Документы отклонены')
]

# Type of employees
SP = 'SP'
SELF_EMPLOYED = 'SE'
NATURAL_PERSON = 'NP'
FOREIGN_RESIDENT = 'FR'

TYPE_OF_EMPLOYEES = [
    (SP, 'Индивидуальный предприниматель'),
    (SELF_EMPLOYED, 'Самозанятый'),
    (NATURAL_PERSON, 'Физ. лицо'),
    (FOREIGN_RESIDENT, 'РИГ'),
]

# Type of company
LLC = 'LLC'

TYPE_OF_COMPANY = [
    (LLC, 'ООО'),
    (SP, 'Индивидуальный предприниматель')
]

# State of Task
ISSUED = 'ISSUED'
STARTED = 'STARTED'
FINISHED = 'FINISHED'
CHECK_TASK = 'CHECK'
CLOSED = 'CLOSED'

STATE_OF_TASK = [
    (ISSUED, 'Выдано'),
    (STARTED,'В процессе'),
    (FINISHED, 'Выполнено'),
    (CHECK_TASK, 'Проверка'),
    (CLOSED, 'Завершено'),  
]


STATE_OF_PAYMENT = {
    'NEW': 'Платеж создан',
    'PAYMENT_IN_PROGRESS': 'Платеж обрабатывается',
    'COMPLETED':'Платеж выполнен',
    'CANCELLED':'Платеж отменен',
    'PAYMENT_FAILED':'Ошибка оплаты',
}
