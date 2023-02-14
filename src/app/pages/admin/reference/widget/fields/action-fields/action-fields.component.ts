import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {Status} from '../../../../../../interfaces/services/util.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../../environments/environment';

@Component({
  selector: 'reference-action-fields',
  templateUrl: './action-fields.component.html',
  styleUrls: ['./action-fields.component.scss']
})
export class ActionFieldsComponent implements OnInit, OnChanges {
  @Input() load = false;
  @Input() disable = false;
  @Input() removeBtn = false;
  @Input() referenceId = null;
  @Input() fieldId = null;
  suFieldId = this.fieldId;
  suAdmin = false;

  constructor(
      private toastr: ToastrService,
      private router: Router,
      private route: ActivatedRoute,
      private http: HttpClient
  ) {}

  ngOnInit() {
      if (this.route.snapshot.params['sadmin'] === 'bekzat') {
          this.suAdmin = true;
      }
  }

  ngOnChanges(changes) {
  }

  removeField() {
    this.http.delete<Status>(`${environment.apiUrl}/api/reference/delete/field/${this.referenceId}/${this.fieldId}`)
      .subscribe({
        next: data => {
          if (data.status === 1) {
            this.toastr.success('Saved!', 'Success', { closeButton: true });
            this.router.navigate(['/vertical/admin-panel/reference/edit/', this.referenceId]).then(r => {});
          } else {
            this.toastr.error(data.message, 'Error', { closeButton: true });
          }
        },
        error: error => {
          this.toastr.error(error, 'Error', { closeButton: true });
        }
      });
  }

  changeFieldId() {
    this.suFieldId = this.suFieldId.toLowerCase();
    return this.http.post<Status>(`${environment.apiUrl}/api/reference/${this.referenceId}/edit/field/replace/${this.fieldId}`,
        this.suFieldId)
        .subscribe({
            next: data => {
                if (data.status === 1) {
                    // this.saveTeacher();
                    this.toastr.success(data.message, 'Success', { closeButton: true });
                    this.router.navigate(['/vertical/admin-panel/reference/edit-field/', this.referenceId, data.value, this.suFieldId])
                        .then(r => {});
                } else {
                    this.toastr.error(data.message, 'Error', { closeButton: true });
                }
            },
            error: error => {
                this.toastr.error(error, 'Error', { closeButton: true });
            }
        });
  }

}
