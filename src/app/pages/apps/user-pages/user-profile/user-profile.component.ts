import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../base-page';
import { Store } from '@ngrx/store';
import { IAppState } from '../../../../interfaces/app-state';
import { HttpService } from '../../../../services/http/http.service';
import { IOption } from '../../../../ui/interfaces/option';

import {StudentService, Student, Education, Experience} from '../../../../interfaces/services/student.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {EduType} from '../../../../interfaces/services/studentList.service';
import {HttpClient} from '@angular/common/http';
import {SelfDev} from '../../../../interfaces/services/self-dev.service';
import {Skills} from '../../../../interfaces/services/projects/skills.service';
import {Course} from '../../../../interfaces/services/projects/courses.service';
import {UserService} from '../../../../user/_services/user.service';

@Component({
  selector: 'page-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class PageUserProfileComponent extends BasePageComponent implements OnInit, OnDestroy {
  userInfo: any;
  gender: IOption[];
  status: IOption[];
  currentAvatar: string | ArrayBuffer;
  defaultAvatar: string;
  changes: boolean;

  editPencil = true;

  userInform: Student;
  ProjectSkills: Skills[] = [];
  education: any[];
  experience: any[];

  profileDetails: Student;

  id: string;

  phones: any[] = [];
  skills: any[] = [];
  socials: any[] = [];

  educationType: any[] = [];

  //TODO истеу керек
  englishList: any[] = [''];

  listSkills: SelfDev[] = [];

  chartColors: any;

  lineChartData: any[];
  lineChartOptions: any;
  lineChartLegend: boolean;
  lineChartType: string;
  lineChartLabels: any[];

  courseList: Course[] = [];
  isAdmin = false;

  constructor(
    store: Store<IAppState>,
    httpSv: HttpService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
  ) {
    super(store, httpSv);

    this.pageData = {
      title: 'User profile',
      // breadcrumbs: [
      //   {
      //     title: 'Apps',
      //     route: 'dashboard'
      //   },
      //   {
      //     title: 'Service pages',
      //     route: 'dashboard'
      //   },
      //   {
      //     title: 'User profile'
      //   }
      // ]
    };
    this.defaultAvatar = 'assets/content/anonymous-400.jpg';
    this.currentAvatar = this.defaultAvatar;
    this.changes = false;

    // this.userInform = this.StudentService.student;
    // this.education = this.sectionDataUniver(this.userInform.education);
    // this.experience = this.sectionDataExperience(this.userInform.experience);
    if (this.route.snapshot.params['id']) {
      this.id = this.route.snapshot.params['id'];
    }

  }

  async ngOnInit() {
    super.ngOnInit();

    // this.getData('assets/data/user-profile.json', 'userInfo', 'loadedDetect');
    this.setLoaded();
    this.getListEducationType();
    this.getListProfiles();
    //TODO Skill
    // this.getListSkills();
    this.setLineChart();
    this.isAdmin = await this.userService.isAdmin();
    console.log(this.isAdmin);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  loadedDetect() {
    this.setLoaded();

    this.currentAvatar = this.userInfo.mainInfo.img;
    this.inituserForm(this.userInfo.mainInfo);
  }

  setLineChart() {
    this.lineChartData = [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
      { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ];

    this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    this.lineChartOptions = {
      responsive: true
    };

    this.lineChartLegend = true;

    this.lineChartType = 'line';
  }

  // init form
  inituserForm(data: any) { }

  sectionDataUniver(data: Education[]) {
    const res: any[] = [];
    const result: any[] = [];
    data.forEach(function (item) {
      const year_begin = new Date(item.yearStart);
      const year_end = new Date(item.yearEnd);
      res.push({
        content: '<strong>' + item.speciality + '</strong> - ' + item.eduType.title,
        iconBg: '#7cdb86'
      });
    });
    result.push({ sectionData: res });
    return result;
  }

  sectionDataExperience(data: Experience[]) {
    const res: any[] = [];
    const result: any[] = [];
    data.forEach(function (item) {
      const year_begin = new Date(item.yearStart);
      const year_end = new Date(item.yearEnd);
      res.push({
        date: year_begin.getFullYear() + ' - ' + year_end.getFullYear(),
        content: '<strong>' + item.speciality + '</strong> - ' + item.title,
        iconBg: '#7cdb86'
      });
    });
    result.push({ sectionData: res });
    return result;
  }


  nullToDefaul(data: any, type: string): any {
    if (data == null) {
      switch (type) {
        case 'string':
          return '';
        case 'array':
          return [];
        case 'number':
          return 0;
        default:
      }
    }
    return null;
  }

  getListProfiles() {
    let sUrl = `${environment.apiUrl}/api/myprofile`;
    if (this.id && this.id.length > 0) {
      sUrl = `${environment.apiUrl}/api/profiles/${this.id}`;
    }
    return this.http.get<Student>(sUrl)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.profileDetails = data;
          this.profileDetails.middleName = this.nullToDefaul(this.profileDetails.middleName, 'string');
          if (this.profileDetails.phone == null) {
            this.profileDetails.phone = '';
          } else {
            this.phones = this.profileDetails.phone.split(',');
          }
          if (this.profileDetails.skills == null) {
            this.profileDetails.skills = '';
            this.skills = null;
          } else {
            const skill = this.profileDetails.skills.split(',');
            skill.forEach(value => {
              if (value.length) {
                this.skills.push({display: value, value: value});
              }
            });
          }
          if (this.profileDetails.social != null) {
            this.socials = JSON.parse(this.profileDetails.social);
          }
          this.education = this.sectionDataUniver(this.profileDetails.education);
          this.experience = this.sectionDataExperience(this.profileDetails.experience);
          //TODO Skill
          // this.getSkillListByProfile();
          console.log(this.profileDetails.id);
          this.getCourseList(this.profileDetails.id);
        });
  }

  getListEducationType() {
    return this.http.get<EduType[]>(`${environment.apiUrl}/api/education/types`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          data.forEach( item => {
            this.educationType.push({label: item.title, value: item.id});
          });
        });
  }

  getCourseList(id: string) {
    return this.http.get<Course[]>(`${environment.apiUrl}/api/project/courses/personjoinedlist/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.courseList = data;
        });
  }

  gotoProfile() {
    let id = this.id;
    if (!id && this.profileDetails.id) {
      id = this.profileDetails.id;
    }
    this.router.navigateByUrl('/vertical/profile/edit/' + id);
  }

  gotoSkills(id: string) {
    this.router.navigateByUrl('/vertical/self-dev-sub-list/' + id + '/' + this.id);
  }

  getListSkills() {
    return this.http.get<SelfDev[]>(`${environment.apiUrl}/api/project/skills-project/list`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.listSkills = data;
        });
  }

  getSkillListByProfile() {
    let id = this.id;
    if (!id && this.profileDetails.id) {
      id = this.profileDetails.id;
    }
    return this.http.get<Skills[]>(`${environment.apiUrl}/api/project/skills-project/profiles/${id}/${id}`)
        .pipe(map(data => {
          return data;
        }))
        .subscribe(data => {
          this.ProjectSkills = data;
        });
  }

}
