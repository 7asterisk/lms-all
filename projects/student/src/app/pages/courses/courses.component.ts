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
  constructor(private router: Router, private dataService: DataService, private auth: AuthService) {


    const now = new Date;
    this.today = now.toISOString();


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
          this.studentId = this.auth.getUserId();
          this.getNotification();
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


  setNav(full) {
    localStorage.setItem('fullNav', full);
    this.fullNav = full;
  }

}
