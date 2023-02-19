import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {UIModule} from '../ui/ui.module';
import {TranslateModule} from '@ngx-translate/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TCTreeDropComponent} from './components/tree-drop';
import {TCAvatarComponent} from './components/avatar';
import {TCTestComponent} from './components/quiz/test';
import {ReferenceModule} from '../reference/reference.module';
import {TCMultipleComponent} from './components/quiz/multiple';
import {TCFilterStudentsComponent} from './components/filter-students';
import {ReportTableComponent} from './components/report-table';

import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        UIModule,
        TranslateModule,
        DragDropModule,
        ReferenceModule,
        NzTableModule,
    ],
    declarations: [
        TCTreeDropComponent,
        TCAvatarComponent,
        TCTestComponent,
        TCMultipleComponent,
        TCFilterStudentsComponent,
        ReportTableComponent,
    ],
    entryComponents: [],
    exports: [
        TCTreeDropComponent,
        TCAvatarComponent,
        TCTestComponent,
        TCMultipleComponent,
        TCFilterStudentsComponent,
        ReportTableComponent,
    ]
})
export class OwnUiModule {}
