import {Injectable} from '@angular/core';

export interface StudentList {
    id: string;
    fio: string;
    gender: number;
    grants: boolean;
    title: string;
    address: string;
    speciality: string;
    course: number;
}

export interface University {
    id: string;
    year_start: Date;
    year_end: Date;
    gpa: string;
    speciality: string;
    edu_type: EduType;
}

export interface EduType {
    id: string;
    title: string;
    address: string;
    edu_status: EduStatus;
}

export interface EduStatus {
    id: number;
    title: string;
    order: number;
}

export interface StudentMiniList {
    id: string;
    fio: string;
    gender: number;
    grants: boolean;
    title: string;
    address: string;
    speciality: string;
    course: number;
    selectedC: boolean;
    teamLead: boolean;
}
