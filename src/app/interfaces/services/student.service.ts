import {Injectable} from '@angular/core';

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    birthday: Date;
    gender: number;
    description: string;
    avatar: string;
    grants: boolean;
    speciality: string;
    address: string;
    phone: any;
    social: string;
    english_type: number;
    english_value: string;
    skills: string;
    username: string;
    email: string;
    password: string;
    enabled: boolean;
    roles: Roles[];
    education: Education[];
    experience: Experience[];

    readsFinishedBooks?: any;
    readsPoint?: number;
    readsReviewNumber?: number;
    readsRecommendation?: any;
}

export interface Roles {
    id: number;
    name: string;
}

export interface Education {
    id: string;
    yearStart: Date;
    yearEnd: Date;
    gpa: string;
    speciality: string;
    course: number;
    eduType: EduType;
    eduStatus: EduStatus;
}
export interface EduType {
    id: string;
    title: string;
    address: string;
    eduStatus: EduStatus;
}

export interface EduStatus {
    id: number;
    title: string;
    order: number;
}

export interface Experience {
    id: string;
    title: string;
    speciality: string;
    yearStart: Date;
    yearEnd: Date;
}

export interface StudentCsv {
    firstName?: string;
    lastName?: string;
    birthday?: string;
    genderString?: string;
    grants?: boolean;
    speciality?: string;
    address?: string;
    phone?: string;
    email?: string;
    course?: string;
    english_type?: string;
    english_value?: string;
    user?: string;
    educationStr?: string;
}

@Injectable({providedIn: 'root'})
export class StudentService {
    date = new Date();

    public newStudent: Student = {
        id: '',
        firstName: '',
        lastName: '',
        middleName: '',
        birthday: null,
        gender: 1,
        description: '',
        avatar: '',
        grants: false,
        speciality: '',
        address: '',
        phone: '',
        social: '[{"title":"instagram","link":""},{"title":"twitter","link":""}]',
        english_type: 1,
        english_value: 'Beginner',
        skills: '',
        username: '',
        email: '',
        password: '',
        enabled: false,
        roles: [{ id: 1, name: 'ROLE_USER' }],
        education: [],
        experience: []
    };

    public roles: any[] = [
        {label: 'ROLE_USER', value: 1},
        {label: 'ROLE_ADMIN', value: 2}
    ];

    public enable: any[] = [
        {label: 'TRUE', value: true},
        {label: 'FALSE', value: false}
    ];

    public gender: any[] = [
        {label: 'Male', value: 1},
        {label: 'Female', value: 2},
    ];

    public english_type: any[] = [
        {value: 1, label: 'Standard'},
        {value: 2, label: 'IELTS'},
        {value: 3, label: 'TOEFL'},
    ];

    public english_st_title: any[] = [
        {value: 'Beginner', label: 'Beginner'},
        {value: 'Elementary', label: 'Elementary'},
        {value: 'Pre-Intermediate', label: 'Pre-Intermediate'},
        {value: 'Intermediate', label: 'Intermediate'},
        {value: 'Advanced', label: 'Advanced'},
    ];

    public grants: any[] = [
        {label: 'Yes', value: true},
        {label: 'No', value: false}
    ];

    public univer_type: any[] = [
        {label: 'Бакалавр', value: 1},
        {label: 'Магистратура', value: 2},
        {label: 'Докторантура', value: 3}
    ];
    //
    //
    addPhone(item: Student) {
        const phone = '';
        if (item.phone == null) {
            item.phone = [];
        }
        item.phone.push(phone);
    }
    removePhone(student: any[], ind: number) {
        // if (student.indexOf(ind) > -1) {
        //     student.splice(student.indexOf(ind), 1);
        // }
        student.splice(ind, 1);
    }
    addUniver(item: Student) {
        const edu_status: EduStatus = {id: 0, title: '', order: 0};
        const edu_type: EduType =  {id: null, title: '', address: '', eduStatus: edu_status};
        const date = new Date();
        const new_univer: Education = {id: null, speciality: '', yearStart: date, yearEnd: date, gpa: '', eduType: edu_type, course: 1, eduStatus: edu_status};
        item.education.push(new_univer);
    }
    addExp(item: Student) {
        const date = new Date();
        const new_exp: Experience = {id: null, title: '', speciality: '', yearStart: date, yearEnd: date };
        if (item.experience == null) {
            item.experience = [];
        }
        item.experience.push(new_exp);
    }
    removeUniver(item: Student, index: number) {
        item.education.splice(index, 1);
    }
    removeExp(item: Student, index: number) {
        item.experience.splice(index, 1);
    }

}
