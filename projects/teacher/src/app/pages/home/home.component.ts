import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  relationDetails;
  courseDetails;
  blockDetails;
  allCourses;
  teacherId;
  newCourse = { courseId: '', courseName: '', department: '', batch: '' };
  constructor(private dataService: DataService, private authService: AuthService) {
    this.teacherId = this.authService.getUserId();
    this.getCourse();
  }

  getCourse() {

    this.dataService.getCourses({
      to: 'course', filter: { teacherId: this.teacherId },
      projection: {}, teacherPopulate: { path: 'teacherId', select: 'teacherName' },
      blockPopulate: { path: 'blockId', select: 'blockName year' }
    }).subscribe(data => {
      // console.log(data);
      this.allCourses = data;
    });
  }
  addCourse() {
    // console.log(this.newCourse);
    // this.dataService.addToCollection('')
  }
  ngOnInit(): void {
  }

}
