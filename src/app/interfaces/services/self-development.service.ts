import {Injectable} from '@angular/core';

export interface Self_Development {
    id: string;
    title: string;
    parent_id: string;
    children: child[];
}

interface child {
    id: string;
    title: string;
    parent_id: string;
}

@Injectable({providedIn: 'root'})
export class SelfDevelopmentService {
    private child1: child[] = [
        {id: '2', title: 'Жергілікті футбол клубының фандомымен ойынға бар', parent_id: '1'},
        {id: '3', title: 'Досыңмен тренажеркаға бар', parent_id: '1'},
        {id: '4', title: 'Қалада велошеру жаса', parent_id: '1'},
        {id: '5', title: 'Үлкен/кіші теннис жарысына қатыс', parent_id: '1'},
    ];
    private child2: child[] = [
        {id: '7', title: 'Қан тапсыр ', parent_id: '6'},
        {id: '8', title: 'Фондқа киім өткіз', parent_id: '6'},
        {id: '9', title: 'Достармен "Secret Santa" ойна', parent_id: '6'},
        {id: '10', title: 'Қоғамдық бірлестікте волонтер бол', parent_id: '6'},
    ];
    public selfDevelopment: Self_Development[] = [
        {id: '1', title: 'Спорт және Денсаулық', parent_id: '0', children: this.child1},
        {id: '6', title: 'Әлеуметтік белсенділік', parent_id: '0', children: this.child2},
        {id: '11', title: 'Қабілетінді аш', parent_id: '0', children: this.child2},
        {id: '12', title: 'Кино және BAQ', parent_id: '0', children: this.child2},
    ];

}
