import {Injectable} from '@angular/core';

export interface Actual {
    id: string;
    title: string;
    dateStart: Date;
    dateEnd: Date;
    actual: boolean;
    dateSelect: Date;
}
export interface Skills {
    id: string;
    title?: string;
    parentId: string;
    parentTitle?: string;
    description?: string;
    image?: string;
    avatar?: string;
    bgColor?: string;
    members?: number;
    connections?: any[];
    selected?: boolean;
    selectEnd?: boolean;
    view?: string;
    done?: boolean;
}

export interface SkillsListProfiles {
    profileId: string;
    fio?: string;
    comment?: string;
    link?: string;
    blocked?: boolean;
    done?: string;
    title?: string;
    listId?: string;
    skillId?: string;
}

export interface SkillsProfile {
    id?: string;
    profileId?: string;
    listId: string;
    actualId?: string;
    comment?: string;
    link?: string;
    blocked?: boolean;
}

export interface SkillsPass {
    id: string;
    title?: string;
    parentId: string;
    description?: string;
    image?: string;
    avatar?: string;
    bgColor?: string;
    members?: number;
    connections?: any[];
    selected?: boolean;
    selectEnd?: boolean;
    view?: string;
    comment?: string;
    link?: string;
}
