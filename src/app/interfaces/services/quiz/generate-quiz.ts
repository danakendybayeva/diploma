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
