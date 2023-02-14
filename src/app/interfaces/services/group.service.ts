import {Injectable} from '@angular/core';

export interface Group {
    id: string;
    title?: string;
    description?: string;
    image?: string;
    avatar?: string;
    teamLead?: string;
    specialities?: string;
    bgColor?: string;
    members?: number;
    connections?: any[];
    routerLink?: string;
}
