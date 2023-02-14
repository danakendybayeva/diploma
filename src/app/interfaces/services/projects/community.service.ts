import {Quiz} from '../quiz/quiz';

export interface Topic {
    id: string;
    title: string;
    key?: string;
    parentId: string;
    orderNum: number;
    hidden: boolean;
    children: Topic[];
}

export interface  Problem {
    id: string;
    variables: Variables[];
    result: string;
    condition: string;
    text: string;
    solve: string[];
}

export interface Variables {
    id: string;
    name: string;
    type: string;
}

export interface Questions extends Quiz {
    topicId: string;
    relativeTopics: string[];
    topic?: Topic;
}

export interface Variant {
    id: string;
    text: string;
    textRu: string;
    textEn: string;
    isAnswer: boolean;
}

export interface GenerateQuiz {
    answerVariants: any[];
    description: string;
    descriptionRu: string;
    descriptionEn: string;
    answerType: string;
}
