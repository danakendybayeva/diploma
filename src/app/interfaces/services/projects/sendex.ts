
export interface ExpEx {
    'variable': [
        {
            'name': string,
            'type': string,
            'delimiter': number,
            'condition': string,
            'range': string;
        }
    ];
    'result':
        {
            'type': string,
            'condition': string,
            'range': string,
            'variantsSolve': [],
            'delimiter': number;
        };
    'condition': string;
    'description': string;
    'solve': string;
    'answerType': string;
}
