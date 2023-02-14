import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {UIModule} from '../ui/ui.module';
import {TranslateModule} from '@ngx-translate/core';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {TCTreeDropComponent} from './components/tree-drop/tree-drop.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        UIModule,
        TranslateModule,
        DragDropModule,
        NgZorroAntdModule,
    ],
    declarations: [
        TCTreeDropComponent,

    ],
    entryComponents: [],
    exports: [
        TCTreeDropComponent,
    ]
})
export class OwnUiModule {}
