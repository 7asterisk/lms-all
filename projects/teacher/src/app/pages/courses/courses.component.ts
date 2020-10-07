import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

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

  items;
  constructor(private router: Router) {


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
          this.setNav(this.fullNav);
        }
        else if (event.url.split('?', 3).length > 1) {
          params = event.url.split('?', 3);
          params = params[1].split('&', 3);
          this.courseId = params[0].split('=')[1];
          this.subBlockId = params[1].split('=')[1];
          this.setNav(this.fullNav);
        }
      }
    });
  }


  setMenuItem() {

    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/tr/home' },
      {
        label: 'Notes', icon: 'pi pi-fw pi-file',
        routerLink: '/tr/course/notes',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Assingments', icon: 'pi pi-fw pi-list', routerLink: '/tr/course/assingment',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Quiz', icon: 'pi pi-fw pi-check-square', routerLink: '/tr/course/quiz',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId },
        badge: '1'
      },
      {
        label: 'Announcement', icon: 'pi pi-fw pi-comment', routerLink: '/tr/course/announcement',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Discussion', icon: 'pi pi-fw pi-comments', routerLink: '/tr/course/discussion-topic',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      },
      {
        label: 'Polls', icon: 'pi pi-fw pi-chart-bar', routerLink: '/tr/course/polls',
        queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
      }
    ];

  }

  setNav(full) {
    localStorage.setItem('fullNav', full);
    this.fullNav = full;
    if (this.fullNav == 0) {
      this.items = [
        { icon: 'pi pi-fw pi-home', routerLink: '/tr/home' },
        {
          icon: 'pi pi-fw pi-file',
          routerLink: '/tr/course/notes',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-list', routerLink: '/tr/course/assingment',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-check-square', routerLink: '/tr/course/quiz',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-comment', routerLink: '/tr/course/announcement',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-comments', routerLink: '/tr/course/discussion-topic',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        },
        {
          icon: 'pi pi-fw pi-chart-bar', routerLink: '/tr/course/polls',
          queryParams: { courseId: this.courseId, subBlockId: this.subBlockId }
        }
      ];
    } else {
      this.setMenuItem();
    }
  }
}