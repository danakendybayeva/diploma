export interface IReference {
    id: string;
    title: string;
    hint: string;
    description: string;
    tableName?: string;
    userFields: string;
    sysFields?: string;
    isSystem?: number;
    creator?: string[];
    editor?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    sections?: ISection[];
}

export interface ISection {
    id: string;
    title: string;
    hint: string;
    access: string[];
    fields: any[];
    groupField: any[];
    sortField: any[];
    enableCustomFields: boolean;
    filterField?: any[];
    referenceId?: string;
    showOrder: number;
}
