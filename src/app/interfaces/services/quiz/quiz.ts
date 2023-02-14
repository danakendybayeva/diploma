import {VariantTest} from './test';
import {VariantOrder} from './order-quiz';
import {VariantMatch} from './match-quiz';
import {VariantFIB} from './fib-quiz';
import {VariableGN} from './generate-quiz';

export interface Quiz {
    id: string;
    description: string;
    descriptionRu?: string;
    descriptionEn?: string;
    type: number;
    variants?: string;

    variantTest?: VariantTest[];
    variantOrder?: VariantOrder[];
    variantMatch?: VariantMatch[];
    variantFIB?: VariantFIB[];

    variableGN?: VariableGN[];
}
