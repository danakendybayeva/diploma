import {Injectable} from '@angular/core';

export interface User {
    // id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const roleReference = {
    'id': 'roles',
    'hint': null,
    'type': 'reference',
    'limit': -1,
    'title': 'Roles',
    'fields': [
        'display_name'
    ],
    'isSingle': false,
    'isUnique': false,
    'orderNum': 27,
    'separator': ', ',
    'isRequired': false,
    'defaultSort': {
        'type': 'asc',
        'field': ''
    },
    'disableLink': false,
    'referenceId': '00000000-0000-0000-0000-000000000019',
    'defaultGroup': [],
    'defaultValue': [],
    'templateView': '{Название}',
    'enableNumbered': false
};
