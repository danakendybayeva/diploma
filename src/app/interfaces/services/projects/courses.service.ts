import {Injectable} from '@angular/core';

export interface Company {
    id: string;
    title: string;
    description: string;
    image: string;
    logo: string;
    views: number;
}
export interface Package {
    id: string;
    title: string;
    companyId: string;
    description: string;
    image: string;
}
export interface Course {
    id: string;
    title: string;
    packageId: string;
    companyId: string;
    description: string;
    image: string;
    introVideo: string;
    introDescription: string;
    language: string;
    active: boolean;
    activeDatetime: Date;
    access: string;
    leftRatings: number;
    ratingSum: number;
    rating: number;
    finishedStudents: number;
    progress: number;
    allLesson: number;
    allTime: number;
    isJoined: boolean;
    packages: Package;
    company: Company;
    commentNumber: 0;
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
    teacherIds: string;
    studyingLesson: string;
}
export interface Module {
    id: string;
    title: string;
    description: string;
    videoNum: number;
    orderNum: number;
    access: boolean;
    finished: boolean;
    studying: boolean;
    coursesId: string;
    videos: Video[];
}
export interface Video {
    id: string;
    title: string;
    modulesId: string;
    coursesId: string;
    description: string;
    linkVideo: string;
    duration: number;
    test: string;
    point: number;
    orderNum: number;
    access: boolean;
    studying: boolean;
    previousId: string;
    nextId: string;
    videoStatus: string;
    company: Company;
}
export interface VideoPayload {
    id: string;
    title: string;
    modulesId: string;
    coursesId: string;
    description: string;
    linkVideo: string;
    duration: number;
    test: Test[];
    point: number;
    orderNum: number;
    access: boolean;
    studying: boolean;
    previousId: string;
    nextId: string;
    videoStatus: string;
    company: Company;
}
export interface Test {
    id: string;
    question: string;
    answer: string[];
    variants: string[];
    answerNum: number;
}
export interface LessonTest {
    id: string;
    test: Test[];
}

export interface Teachers {
    id: string;
    fio: string;
    avatar: string;
    profession: string;
}

export interface Comment {
    id: string;
    comment: string;
    rating: number;
    courseId: string;
    parentId: string;
    profileName: string;
}

export interface Teacher {
    id: string;
    fio: string;
    image: string;
    speciality: string;
    coursesId: string;
    companyId: string;
}
