import {Injectable} from '@angular/core';

export interface SelfDev {
    id: string;
    title?: string;
    parentId: string;
    description?: string;
    image?: string;
    avatar?: string;
    bgColor?: string;
    members?: number;
    connections?: any[];
}
