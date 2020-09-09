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
  constructor(private router: Router) {
    if (localStorage.getItem('fullNav')) {
      this.fullNav = Number(localStorage.getItem('fullNav'));
      // console.log(localStorage.getItem('fullNav'));
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const params = event.url.split(';', 3);
        if (params.length > 1) {
          this.courseId = params[1].split('=')[1];
          this.subBlockId = params[2].split('=')[1];
        }
      }
    });
  }

  setNav(full) {
    // console.log(full);

    localStorage.setItem('fullNav', full);
    this.fullNav = full;
    // console.log(localStorage.getItem('fullNav'));

  }

}
