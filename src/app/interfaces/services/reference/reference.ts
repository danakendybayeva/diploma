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
    fastEdit: boolean;
}

export interface IAccess {
    subject_id: string;
    title: string;
    view_menu: boolean;
    may_view: boolean;
    may_add: boolean;
    objects: IObject[];
}

export interface IObject {
    id: string;
    title: string;
    may_view: boolean;
    may_edit: boolean;
    may_delete: boolean;
}
