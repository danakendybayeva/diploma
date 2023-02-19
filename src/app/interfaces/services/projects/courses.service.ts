import {Injectable} from '@angular/core';
import {StatusFields} from '../status-record';
export const CompanyFields = {
    logo: {
        id: 'logo',
        hint: null,
        type: 'image',
        title: 'Логотип',
        thumbX: 0,
        thumbY: 0,
        maxSize: 0,
        isAvatar: false,
        isSingle: true,
        maxCount: -1,
        orderNum: 3,
        separator: null,
        filterName: '',
        isRequired: false,
        renameFile: '',
        defaultValue: []
    },
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 1,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name: {
        id: 'display_name',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    description_kz: {
        id: 'description_kz',
        hint: null,
        type: 'text',
        title: 'Описание на казахском',
        isUnique: false,
        orderNum: 2,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    }
};

export const PackageFields = {
    bg_image: {
        id: 'bg_image',
        hint: null,
        type: 'image',
        title: 'Изображение',
        thumbX: 0,
        thumbY: 0,
        maxSize: 0,
        isAvatar: false,
        isSingle: true,
        maxCount: -1,
        orderNum: 4,
        separator: null,
        filterName: '',
        isRequired: false,
        renameFile: '',
        defaultValue: []
    },
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 2,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name: {
        id: 'display_name',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    description_kz: {
        id: 'description_kz',
        hint: null,
        type: 'text',
        title: 'Описание на казахском',
        isUnique: false,
        orderNum: 3,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name_kz: {
        id: 'display_name_kz',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название на казахском',
        isUnique: false,
        orderNum: 1,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    }
};

export const TeacherFields = {
    fio: {
        id: 'fio',
        hint: null,
        mask: null,
        type: 'string',
        title: 'ФИО',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    avatar: {
        id: 'avatar',
        hint: null,
        type: 'image',
        title: 'Аватар',
        thumbX: 0,
        thumbY: 0,
        maxSize: 0,
        isAvatar: true,
        isSingle: true,
        maxCount: -1,
        orderNum: 1,
        separator: null,
        filterName: '',
        isRequired: false,
        renameFile: '',
        defaultValue: []
    },
    speciality: {
        id: 'speciality',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Speciality',
        isUnique: false,
        orderNum: 2,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 3,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    description_kz: {
        id: 'description_kz',
        hint: null,
        type: 'text',
        title: 'Описание на казахском',
        isUnique: false,
        orderNum: 4,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    }
};

export const CourseFields = {
    access: {
        id: 'access',
        hint: null,
        type: 'structure',
        limit: -1,
        title: 'Access',
        fields: [
            'fio'
        ],
        hideAll: false,
        isActive: true,
        isSingle: false,
        isUnique: false,
        orderNum: 13,
        separator: ', ',
        isRequired: false,
        defaultSort: {
            type: 'asc',
            field: ''
        },
        disableLink: false,
        enableGroup: true,
        referenceId: '00000000-0000-0000-0000-000000000017',
        defaultGroup: [],
        defaultValue: [],
        templateView: '{ФИО}',
        enableNumbered: false,
        enableSubdivision: true
    },
    rating: {
        id: 'rating',
        hint: null,
        type: 'float',
        title: 'Рейтинг',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 8,
        rangeFrom: null,
        isRequired: false,
        defaultValue: 0
    },
    company: {
        id: 'company',
        hint: null,
        type: 'enumeration',
        title: 'Компания',
        values: [],
        isBadges: false,
        isSingle: true,
        orderNum: 9,
        separator: ', ',
        isRequired: false,
        defaultValue: []
    },
    bg_image: {
        id: 'bg_image',
        hint: null,
        type: 'image',
        title: 'Обложка',
        thumbX: 0,
        thumbY: 0,
        maxSize: 0,
        isAvatar: false,
        isSingle: true,
        maxCount: -1,
        orderNum: 1,
        separator: null,
        filterName: '',
        isRequired: false,
        renameFile: '',
        defaultValue: []
    },
    language: {
        id: 'language',
        hint: null,
        type: 'enumeration',
        title: 'Язык',
        values: [
            {
                id: '00000000-0000-0000-0000-000000000007',
                value: 'Казахский',
                selected: false
            },
            {
                id: '00000000-0000-0000-0000-000000000009',
                value: 'Английский',
                selected: false
            },
            {
                id: '00000000-0000-0000-0000-000000000011',
                value: 'Русский',
                selected: false
            }
        ],
        isBadges: false,
        isSingle: true,
        orderNum: 6,
        isRequired: false,
        defaultValue: []
    },
    packages: {
        id: 'packages',
        hint: null,
        type: 'reference',
        limit: -1,
        title: 'Package',
        fields: [
            'display_name',
            'display_name_kz'
        ],
        isSingle: false,
        isUnique: false,
        orderNum: 10,
        separator: ', ',
        isRequired: false,
        defaultSort: {
            type: 'asc',
            field: ''
        },
        disableLink: false,
        referenceId: 'b8e2e17e-8dce-457a-9387-5c106442f221',
        defaultGroup: [],
        defaultValue: [],
        templateView: '{Название}',
        enableNumbered: false
    },
    teachers: {
        id: 'teachers',
        hint: null,
        type: 'enumeration',
        title: 'Teachers',
        values: [],
        isBadges: false,
        isSingle: false,
        orderNum: 12,
        separator: ', ',
        isRequired: false,
        defaultValue: []
    },
    access_course: {
        id: 'access_course',
        hint: null,
        type: 'integer',
        title: 'Class',
        rangeTo: 5,
        hasRange: true,
        isUnique: false,
        orderNum: 11,
        rangeFrom: 0,
        isRequired: false,
        defaultValue: 0
    },
    order_num: {
        id: 'order_num',
        hint: null,
        type: 'integer',
        title: 'Post order',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 11,
        rangeFrom: null,
        isRequired: false,
        defaultValue: 99999
    },
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 3,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    intro_video: {
        id: 'intro_video',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Интро видео',
        isUnique: false,
        orderNum: 4,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name: {
        id: 'display_name',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    publish_date: {
        id: 'publish_date',
        hint: null,
        type: 'timestamp',
        title: 'Дата публикация',
        maxDay: null,
        minDay: null,
        addDays: null,
        addTime: null,
        maxTime: null,
        minTime: null,
        isUnique: false,
        orderNum: 7,
        isRequired: false,
        viewFormat: 'dd.MM.yyyy HH:mm',
        currentTimestamp: false
    },
    feature_image: {
        id: 'feature_image',
        hint: null,
        type: 'image',
        title: 'Изображение',
        thumbX: 0,
        thumbY: 0,
        maxSize: 0,
        isAvatar: false,
        isSingle: true,
        maxCount: -1,
        orderNum: 2,
        separator: null,
        filterName: '',
        isRequired: false,
        renameFile: '',
        defaultValue: []
    },
    is_prerequisites: {
        id: 'is_prerequisites',
        hint: null,
        type: 'boolean',
        title: 'Enable Prerequisites',
        orderNum: 14,
        isRequired: false,
        defaultValue: false
    },
    intro_description: {
        id: 'intro_description',
        hint: null,
        type: 'text',
        title: 'Интро описание',
        isUnique: false,
        orderNum: 5,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    prerequisites_mode: {
        id: 'prerequisites_mode',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Prerequisites Mode',
        isUnique: false,
        orderNum: 15,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    prerequisites_courses: {
        id: 'prerequisites_courses',
        hint: null,
        type: 'enumeration',
        title: 'Prerequisites Courses',
        values: [],
        isBadges: false,
        isSingle: false,
        orderNum: 16,
        separator: ', ',
        isRequired: false,
        defaultValue: []
    },
    status: StatusFields
};

export const ModuleFields = {
    order_num: {
        id: 'order_num',
        hint: null,
        type: 'integer',
        title: 'Post order',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 11,
        rangeFrom: null,
        isRequired: false,
        defaultValue: 99999
    },
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 3,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name: {
        id: 'display_name',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    publish_date: {
        id: 'publish_date',
        hint: null,
        type: 'timestamp',
        title: 'Дата публикация',
        maxDay: null,
        minDay: null,
        addDays: null,
        addTime: null,
        maxTime: null,
        minTime: null,
        isUnique: false,
        orderNum: 7,
        isRequired: false,
        viewFormat: 'dd.MM.yyyy HH:mm',
        currentTimestamp: false
    },
    status: StatusFields
};

export const LessonFields = {
    teachers: {
        id: 'teachers',
        hint: null,
        type: 'enumeration',
        title: 'Teachers',
        values: [],
        isBadges: false,
        isSingle: false,
        orderNum: 12,
        separator: ', ',
        isRequired: false,
        defaultValue: []
    },
    order_num: {
        id: 'order_num',
        hint: null,
        type: 'integer',
        title: 'Post order',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 11,
        rangeFrom: null,
        isRequired: false,
        defaultValue: 99999
    },
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 3,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name: {
        id: 'display_name',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    publish_date: {
        id: 'publish_date',
        hint: null,
        type: 'timestamp',
        title: 'Дата публикация',
        maxDay: null,
        minDay: null,
        addDays: null,
        addTime: null,
        maxTime: null,
        minTime: null,
        isUnique: false,
        orderNum: 7,
        isRequired: false,
        viewFormat: 'dd.MM.yyyy HH:mm',
        currentTimestamp: false
    },
    is_video_progression: {
        id: 'is_video_progression',
        hint: 'Require users to watch the full video as part of the course progression. Use shortcode [ld_video] to move within the post content.',
        type: 'boolean',
        title: 'Video Progression',
        orderNum: 14,
        isRequired: false,
        defaultValue: false
    },
    video_progression_url: {
        id: 'video_progression_url',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Video URL',
        isUnique: false,
        orderNum: 4,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    video_progression_mode: {
        id: 'video_progression_mode',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Display Timing ',
        isUnique: false,
        orderNum: 15,
        maxLength: null,
        minLength: null,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    is_autostart: {
        id: 'is_autostart',
        hint: 'Note, due to browser requirements videos will be automatically muted for autoplay to work.',
        type: 'boolean',
        title: 'Autostart',
        orderNum: 14,
        isRequired: false,
        defaultValue: false
    },
    is_video_controls_display: {
        id: 'is_video_controls_display',
        hint: 'Only available for YouTube and local videos. Vimeo supported if autostart is enabled.',
        type: 'boolean',
        title: 'Video Controls Display',
        orderNum: 14,
        isRequired: false,
        defaultValue: false
    },
    is_video_pause_unf: {
        id: 'is_video_pause_unf',
        hint: 'Pause the video if user switches to a different window. VooPlayer not supported.',
        type: 'boolean',
        title: 'Video Pause on Window Unfocused',
        orderNum: 14,
        isRequired: false,
        defaultValue: false
    },
    is_video_resume: {
        id: 'is_video_resume',
        hint: 'Allows user to resume video position. Uses browser cookie. VooPlayer not supported.',
        type: 'boolean',
        title: 'Video Resume',
        orderNum: 14,
        isRequired: false,
        defaultValue: false
    },
    status: StatusFields
};

export const QuizFields = {
    description: {
        id: 'description',
        hint: null,
        type: 'text',
        title: 'Описание',
        isUnique: false,
        orderNum: 2,
        isRequired: false,
        defaultValue: null,
        maxShowLength: null
    },
    display_name: {
        id: 'display_name',
        hint: null,
        mask: null,
        type: 'string',
        title: 'Название',
        isUnique: false,
        orderNum: 0,
        maxLength: null,
        minLength: null,
        isRequired: true,
        defaultValue: null,
        maxShowLength: null
    },
    order_num: {
        id: 'order_num',
        hint: null,
        type: 'integer',
        title: 'Post order',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 11,
        rangeFrom: null,
        isRequired: false,
        defaultValue: 99999
    },
    questions: {
        id: 'questions',
        defaultValue: []
    },
    passing_score: {
        id: 'passing_score',
        hint: null,
        type: 'integer',
        title: 'Passing Score',
        rangeTo: null,
        hasRange: false,
        isUnique: false,
        orderNum: 11,
        rangeFrom: null,
        isRequired: false,
        defaultValue: 99999,
        suffix: '%'
    },
    status: StatusFields
};
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
