import {Quiz} from '../quiz/quiz';

export interface Program {
    id: string;
    title: string;
    relativeTopics: string[];
    selected: boolean;
}

export interface Topic {
    id: string;
    title: string;
    key?: string;
    parentId: string;
    orderNum: number;
    hidden: boolean;
    children: Topic[];
    isLeaf?: boolean;
    topicVersion?: number[];
    selected?: boolean;
}

// export interface  Problem {
//     id: string;
//     variables: Variables[];
//     result: string;
//     condition: string;
//     text: string;
//     solve: string[];
// }

export interface Questions {
    id: string;
    topicId: string;
    relativeTopics: string[];
    topic?: Topic;
    description: string;
    descriptionRu?: string;
    descriptionEn?: string;
    type: number;

    variables?: Variable[];
    variants?: Variant[];
}

export interface GenerateQuiz {
    id: string;
    description: string;
    descriptionRu: string;
    descriptionEn: string;
    answerType: string;

    answerVariants?: Variant[];
    answerRelVariants?: Variant[];
    studentAnswer?: Variant[];
}

export interface Variable {
    id: string;
    name: string;
    type: string;
    delimiter?: number;
    condition: string;
    range: number[];
    isAssign: boolean;
    assignText: string;
}

export interface Variant {
    id: string;
    text: string;
    textRu: string;
    textEn: string;
    textRel: string;
    textRuRel: string;
    textEnRel: string;
    isAnswer: boolean;
    orderNum: number;
}
