import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  fullNav = 1;
  courseId;
  subBlockId;
  studentId: any;
  assingmentBadge;
  quizBadge;
  newGrade;
  today;

  items;
  constructor(private router: Router, private dataService: DataService, private auth: AuthService) {


    const now = new Date;
    this.today = now.toISOString();


    if (localStorage.getItem('fullNav')) {
      this.fullNav = Number(localStorage.getItem('fullNav'));
      // console.log(localStorage.getItem('fullNav'));
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let params = event.url.split(';', 3);
        if (params.length > 1) {
          this.courseId = params[1].split('=')[1];
          this.subBlockId = params[2].split('=')[1];
          this.studentId = this.auth.getUserId();
          this.getNotification();
          this.setNav(this.fullNav);
        }
        else if (event.url.split('?', 3).length > 1) {
          params = event.url.split('?', 3);
          params = params[1].split('&', 3)
          this.courseId = params[0].split('=')[1];
          this.subBlockId = params[1].split('=')[1];
          this.studentId = this.auth.getUserId();
          this.getNotification();
          this.setNav(this.fullNav);
        }
      }
    });
  }

  getNotification() {
    this.getAssingment();
    this.getQuiz();
    this.getNewGrade();
  }


  getAssingment() {
    this.assingmentBadge = 0;
    this.dataService.getFilterData({
      to: 'assingments', filter: { courseId: this.courseId, blockId: this.subBlockId }, projection:
      {
        submission: { $elemMatch: { studentId: this.studentId } }, deadLine: 1
      }
    }).subscribe(data => {
      const allAssingment: any = data;
      allAssingment.forEach(element => {
        const deadLine = new Date(element.deadLine);
        const today = new Date(this.today);
        if (element.submission.length === 0 && deadLine >= today) {
          this.assingmentBadge += 1;
        }

      });
      if (this.assingmentBadge > 0) {
        this.setNav(this.fullNav);
      }
      // console.log(this.assingmentBadge);
    });
  }


  getQuiz() {
    this.quizBadge = 0;
    this.dataService.getFilterData({
      to: 'quiz', filter: { courseId: this.courseId, blockId: this.subBlockId }, projection:
      {
        submission: { $elemMatch: { studentId: this.studentId } }, deadLine: 1, activateTime: 1
      }
    }).subscribe(data => {
      const allAssingment: any = data;
      allAssingment.forEach(element => {
        const activetime = new Date(element.activateTime);
        const deadLine = new Date(element.deadLine);
        const today = new Date(this.today);
        if (element.submission.length === 0 && deadLine >= today && activetime < today) {
          this.quizBadge += 1;
        }
      });
      if (this.quizBadge > 0) {
        this.setNav(this.fullNav);
      }
      // console.log(this.quizBadge);
    });
  }

  getNewGrade() {
    this.dataService.getItem('student/' + this.studentId).subscribe(data => {
      // console.log(data);
      if (!data) { return }
      if (data['newGrade']?.indexOf(this.courseId) != -1) {
        this.newGrade = true;
        // console.log(this.newGrade);
      } else {
        this.newGrade = false;
      }
    });
  }


  setMenuItem() {

    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/st/home' },
      {
        label: 'Notes', icon: 'pi pi-fw pi-file',
        routerLink: '/st/course/notes',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Assingments', icon: 'pi pi-fw pi-list', routerLink: '/st/course/assingment',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Quiz', icon: 'pi pi-fw pi-check-square', routerLink: '/st/course/quiz',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId },
        badge: '1'
      },
      {
        label: 'Grade', icon: 'pi pi-fw pi-chart-line', routerLink: '/st/course/grade',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Discussion', icon: 'pi pi-fw pi-comments', routerLink: '/st/course/discussion-topic',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Polls', icon: 'pi pi-fw pi-chart-bar', routerLink: '/st/course/polls',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      }
    ];

  }

  setNav(full) {
    localStorage.setItem('fullNav', full);
    this.fullNav = full;
    if (this.fullNav == 0) {
      this.items = [
        { icon: 'pi pi-fw pi-home', routerLink: '/st/home' },
        {
          icon: 'pi pi-fw pi-file',
          routerLink: '/st/course/notes',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-list', routerLink: '/st/course/assingment',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId },
          badge: this.assingmentBadge
        },
        {
          icon: 'pi pi-fw pi-check-square', routerLink: '/st/course/quiz',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId },
          badge: "1"
        },
        {
          icon: 'pi pi-fw pi-chart-line', routerLink: '/st/course/grade',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-comments', routerLink: '/st/course/discussion-topic',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-chart-bar', routerLink: '/st/course/polls',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        }
      ];
    } else {
      this.setMenuItem();
    }
  }

}
