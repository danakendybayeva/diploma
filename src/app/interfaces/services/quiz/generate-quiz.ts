export interface VariantGN {
    id: string;
    text: string;
    textRu: string;
    textEn: string;
}

export interface VariableGN {
    id: string;
    name: string;
    type: string;
    delimiter?: number;
    condition: string;
    range: number[];
    variantsSolve?: string[];
    isAssign: boolean;
    assignText: string;
}
