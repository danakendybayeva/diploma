import {VariantTest} from './test';
import {VariantOrder} from './order-quiz';
import {VariantMatch} from './match-quiz';
import {VariantFIB} from './fib-quiz';
import {Variable} from './generate-quiz';
import {Variant} from '../projects/community.service';

export interface Quiz {
    id: string;
    description: string;
    descriptionRu?: string;
    descriptionEn?: string;
    type: number;
    variants?: string;
    variableList?: string;

    variables?: Variable[];
    variantTest?: VariantTest[];
    variantOrder?: VariantOrder[];
    variantMatch?: VariantMatch[];
    variantFIB?: VariantFIB[];
}
