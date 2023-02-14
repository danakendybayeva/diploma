import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {IFieldSB} from '../../../../../interfaces/services/reference/fields/field-sidebar';
import {FieldService} from '../../../../../interfaces/services/reference/field.service';
import {environment} from '../../../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'reference-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit, OnChanges {
  basicForm: FormGroup;
  @Input() fieldsData: IFieldSB[] = [];
  @Input() sectionsData: IFieldSB[] = [];
  @Input() isNew = true;
  @Input() referenceId = null;
  @Input() fieldType = '';
  urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/sortable`;

  panels = [
    {
      active: false,
      name: 'Поля',
      type: 'field',
      disabled: false
    },
    {
      active: false,
      disabled: false,
      type: 'section',
      name: 'Представления'
    },
    {
      active: false,
      disabled: true,
      type: 'permission',
      name: 'Права доступа'
    }
  ];

  fields = [
    {
      title: 'Целое',
      icon: 'icofont-numbered',
      type: 'integer'
    },
    {
      title: 'Вещественное',
      icon: 'icofont-numbered',
      type: 'float'
    },
    {
      title: 'Строка',
      icon: 'icofont-small-cap',
      type: 'string'
    },
    {
      title: 'Текст',
      icon: 'icofont-ui-text-chat',
      type: 'text'
    },
    {
      title: 'Дата/Время',
      icon: 'icofont-ui-calendar',
      type: 'timestamp'
    },
    {
      title: 'Дата',
      icon: 'icofont-clock-time',
      type: 'date'
    },
    {
      title: 'Справочник',
      icon: 'icofont-book',
      type: 'reference'
    },
    {
      title: 'Структура',
      icon: 'icofont-address-book',
      type: 'structure'
    },
    {
      title: 'Логическое',
      icon: 'icofont-tick-boxed',
      type: 'boolean'
    },
    {
      title: 'Перечисление',
      icon: 'icofont-layout',
      type: 'enumeration'
    },
    {
      title: 'Файл',
      icon: 'icofont-attachment',
      type: 'file'
    },
    {
      title: 'Таблица',
      icon: 'icofont-table',
      type: 'table'
    }
  ];



  constructor(
      private fieldService: FieldService,
      private toastr: ToastrService
  ) {}

  ngOnInit() {
  }

  ngOnChanges(changes) {
    setTimeout(() => {
      const index = this.panels.findIndex(object => object.type === this.fieldType);
      if (index >= 0) {
        this.panels.forEach((obj, key) => {
          this.panels[key].active = false;
        });
        this.panels[index].active = true;
      } else {
        this.panels[0].active = true;
      }
    });
  }

  async onDrop(params, data, type?: string)  {
    moveItemInArray(data, params.previousIndex, params.currentIndex);
    for (let i = 0; i < data.length; i++) {
      if (data[i] != null) {
        data[i].orderNum = i;
      }
    }
    switch (type) {
      case 'section':
        this.urlRequest = `${environment.apiUrl}/api/reference/section/sortable`;
        break;
      default:
        this.urlRequest = `${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/sortable`;
    }

    const result = await this.fieldService.request(this.urlRequest, data);
    if (result.status === 1) {
      this.toastr.success('Saved!', 'Success', { closeButton: true });
    } else {
      this.toastr.error('Not saved!', 'Error', { closeButton: true });
    }
  }

}
