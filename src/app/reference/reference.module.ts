import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {UIModule} from '../ui/ui.module';
import {TCIntegerFieldComponent} from './fields/integer';
import {TCFloatFieldComponent} from './fields/float';
import {TCStringFieldComponent} from './fields/string';
import {TCDateFieldComponent} from './fields/date';
import {TCTimestampFieldComponent} from './fields/timestamp';
import {TCBooleanFieldComponent} from './fields/boolean';
import {TCEnumerationFieldComponent} from './fields/enumeration';
import {TranslateModule} from '@ngx-translate/core';
import {TCReferenceFieldComponent} from './fields/reference';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {TCMiniFolderRefComponent} from './mini-folder';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {TCStructureFieldComponent} from './fields/structure';
import {TCFactoryFieldComponent} from './fields/factory-field';


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
    TCIntegerFieldComponent,
    TCFloatFieldComponent,
    TCStringFieldComponent,
    TCDateFieldComponent,
    TCTimestampFieldComponent,
    TCBooleanFieldComponent,
    TCEnumerationFieldComponent,
    TCReferenceFieldComponent,
    TCStructureFieldComponent,
    TCMiniFolderRefComponent,
    TCFactoryFieldComponent,
  ],
  entryComponents: [],
  exports: [
    TCIntegerFieldComponent,
    TCFloatFieldComponent,
    TCStringFieldComponent,
    TCDateFieldComponent,
    TCTimestampFieldComponent,
    TCBooleanFieldComponent,
    TCEnumerationFieldComponent,
    TCReferenceFieldComponent,
    TCStructureFieldComponent,
    TCMiniFolderRefComponent,
    TCFactoryFieldComponent,
  ]
})
export class ReferenceModule {}
