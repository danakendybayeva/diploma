export interface Structure {
    id: string;
    displayName: string;
    parentId: string;
    parent: any[];
    profileId: string;
    type: string;
    manager: any[];
    employee: string[];
    sortOrder: number;
    childrenStructure: Structure[];
    childrenCount: number;
}

export let userField = {
    'parent': {
        'id': 'parent',
        'hint': null,
        'type': 'reference',
        'limit': 0,
        'title': 'Родительский элемент',
        'fields': [
            'display_name'
        ],
        'isSingle': true,
        'isUnique': false,
        'orderNum': 3,
        'separator': ', ',
        'isRequired': false,
        'defaultSort': {
            'type': 'asc',
            'field': ''
        },
        'disableLink': false,
        'referenceId': '00000000-0000-0000-0000-000000000018',
        'defaultGroup': [],
        'defaultValue': [],
        'templateView': '{Название}',
        'enableNumbered': false
    },
    'manager': {
        'id': 'manager',
        'hint': null,
        'type': 'structure',
        'limit': 1,
        'title': 'Руководитель',
        'fields': [
            'fio'
        ],
        'hideAll': false,
        'isActive': true,
        'isSingle': true,
        'isUnique': false,
        'orderNum': 1,
        'separator': ', ',
        'isRequired': false,
        'defaultSort': {
            'type': 'asc',
            'field': ''
        },
        'disableLink': false,
        'enableGroup': false,
        'referenceId': '00000000-0000-0000-0000-000000000017',
        'defaultGroup': [],
        'defaultValue': [],
        'templateView': '{ФИО}',
        'enableNumbered': false,
        'enableSubdivision': false
    },
    'employee': {
        'id': 'employee',
        'hint': null,
        'type': 'structure',
        'limit': -1,
        'title': 'Сотрудники',
        'fields': [
            'fio'
        ],
        'hideAll': false,
        'isActive': true,
        'isSingle': false,
        'isUnique': false,
        'orderNum': 2,
        'separator': ', ',
        'isRequired': false,
        'defaultSort': {
            'type': 'asc',
            'field': ''
        },
        'disableLink': false,
        'enableGroup': false,
        'referenceId': '00000000-0000-0000-0000-000000000017',
        'defaultGroup': [],
        'defaultValue': [],
        'templateView': '{ФИО}',
        'enableNumbered': false,
        'enableSubdivision': false
    },
    'sort_order': {
        'id': 'sort_order',
        'hint': null,
        'type': 'integer',
        'title': 'Sort order',
        'rangeTo': null,
        'hasRange': false,
        'isUnique': false,
        'orderNum': 4,
        'rangeFrom': null,
        'isRequired': false,
        'defaultValue': null
    },
    'display_name': {
        'id': 'display_name',
        'hint': null,
        'mask': null,
        'type': 'string',
        'title': 'Название',
        'isUnique': false,
        'orderNum': 0,
        'maxLength': null,
        'minLength': null,
        'isRequired': true,
        'defaultValue': ' ',
        'maxShowLength': null
    }
};
