import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IAppSettings } from '../../../interfaces/settings';
import { select, Store } from '@ngrx/store';
import { IAppState } from '../../../interfaces/app-state';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Input() data: any;
  @Input() layout: string;
  searchForm: FormGroup;
  color: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>
  ) {
    this.data = [];
    this.layout = 'vertical';
  }

  ngOnInit() {
    this.initSearchForm();

    this.store.select('appSettings').subscribe((settings: IAppSettings) => {
      this.color = settings.topbarColor;
    });
  }

  initSearchForm() {
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
  }

  goTo(event: Event, value: string) {
    if (value) {
      let currentPage;

      currentPage = this.data.find(item =>  item.title === value);

      if (currentPage && currentPage.routing) {
        this.router.navigate([currentPage.layout ? currentPage.layout : this.layout, currentPage.routing]);
      }
    }
  }

  hex2rgba(hex: string, alpha: number = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }
}
