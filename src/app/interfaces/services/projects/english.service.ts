import {Injectable} from '@angular/core';
import {StudentMiniList} from '../studentList.service';

export interface EnglishGroupTableService {
    id: string;
    fio: string;
    gender: number;
    grants: boolean;
    title: string;
    address: string;
    speciality: string;
    course: number;
}
export interface EnglishGroup {
    id: string;
    title: string;
    city: string;
    englishType: number;
    englishLevel: string;
    totalHour: number;
    status: number;
    mentorId: string;
    wdays: number[];
    description: string;
    listStudents: StudentMiniList[];
    teacherId?: string;
    teacher?: any;
    listDays: EnglishDays[];
    startDate: Date;
    attendance?: number;
    reportIds?: string[];
}

export interface EnglishGroupProfile {
    id: string;
    title: string;
    city: string;
    englishType: number;
    englishLevel: string;
    totalHour: number;
    status: number;
    teamleadId: string;
    wdays: number[];
    description: string;
    listStudents: EnglishProfile[];
    listDays: EnglishDays[];
    startDate: Date;
    attendance: number;
}

export interface EnglishDays {
    id: string;
    day: Date;
    type: number;
    status: number;
}

export interface EnglishProfile {
    id: string;
    profileId: string;
    fio: string;
    dayId: string;
    status: number;
    statusB?: boolean;
    attendance: number;
    teamlead: boolean;
}

export interface IndividualWork {
    date: Date;
    countHour: number;
    workDone: string;
}

export interface EnglishReport {
    id: string;
    englishId: string;
    englishGroup?: EnglishGroup;
    period: string;
    orderNum: number;
    mocksCount: number;
    ceptsCount: number;
    datesReport: string[];
    datesReportDays?: EnglishDays[];
    dateStartId?: string;
    dateEndId?: string;
}
export interface EnglishStudent {
    id: string;
    profileId: string;
    dayId: string;
    status: number;
    fio: string;
}

export interface EnglishStudentReport {
    id: string;
    englishReportId: string;
    englishReport?: EnglishReport;
    studentId: string;
    student: any;
    active: number;
    homeProject: number;
    reading: number;
    listening: number;
    writing: number;
    speaking: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    mocks: number[];
    cepts: number[];
    averageResult: number;
    comment: string;
    individualWork?: string;
    individualWorkArr?: IndividualWork[];
    dateReport: Date;
    attendance?: EnglishStudent[];
}
