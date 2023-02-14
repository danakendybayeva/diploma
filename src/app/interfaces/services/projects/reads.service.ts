import {Quiz} from '../quiz/quiz';

export interface Question extends Quiz {
    bookId: string;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    deadline: number;
    description: string;
    imgStorage: string;
    leftRatings: number;
    pageNumber: number;
    qrCode: string;
    rating: number;
    ratingSum: number;
}
