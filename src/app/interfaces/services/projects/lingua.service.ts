export const LinguaPeriod = {
    period_title: {
        id: 'period_title',
        hint: null,
        type: 'enumeration',
        title: 'Month',
        values: [
            {
                id: 1,
                value: 'Jan',
                selected: false
            },
            {
                id: 2,
                value: 'Feb',
                selected: false
            },
            {
                id: 3,
                value: 'Mar',
                selected: false
            },
            {
                id: 4,
                value: 'Apr',
                selected: false
            },
            {
                id: 5,
                value: 'May',
                selected: false
            },
            {
                id: 6,
                value: 'Jun',
                selected: false
            },
            {
                id: 7,
                value: 'Jul',
                selected: false
            },
            {
                id: 8,
                value: 'Aug',
                selected: false
            },
            {
                id: 9,
                value: 'Sept',
                selected: false
            },
            {
                id: 10,
                value: 'Oct',
                selected: false
            },
            {
                id: 11,
                value: 'Nov',
                selected: false
            },
            {
                id: 12,
                value: 'Dec',
                selected: false
            }
        ],
        isBadges: false,
        isSingle: true,
        orderNum: 0,
        separator: null,
        isRequired: true,
        defaultValue: [],
        value: []
    },
    end_date: {
        id: 'end_date',
        hint: null,
        type: 'enumeration',
        title: 'End Date',
        values: [],
        isBadges: false,
        isSingle: true,
        orderNum: 3,
        separator: null,
        isRequired: true,
        defaultValue: [],
        value: []
    },
    order_num: {
        id: 'order_num',
        hint: null,
        type: 'integer',
        title: 'Order Number',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 1,
        rangeFrom: null,
        isRequired: true,
        defaultValue: 99,
        value: 99
    },
    start_date: {
        id: 'start_date',
        hint: null,
        type: 'enumeration',
        title: 'Start Date',
        values: [],
        isBadges: false,
        isSingle: true,
        orderNum: 2,
        separator: null,
        isRequired: true,
        defaultValue: [],
        value: []
    }
};
