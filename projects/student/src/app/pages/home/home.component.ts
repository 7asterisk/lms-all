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
  studentBlockId;
  allCourses;
  studentId;
  newCourse = { courseId: '', courseName: '', department: '', batch: '' };
  constructor(private dataService: DataService, private authService: AuthService) {
    this.studentId = this.authService.getUserId();
    this.dataService.getItem('student/' + this.studentId).subscribe(data => {
      this.studentBlockId = data['blockId'];
      // console.log(this.studentBlockId);
      this.getCourse();
    });
  }

  getCourse() {
    this.dataService.getCourses({
      to: 'course', filter: { blockId: this.studentBlockId },
      projection: {}, teacherPopulate: { path: 'teacherId', select: 'teacherName' },
      blockPopulate: { path: 'blockId', select: 'blockName year' }
    }).subscribe(data => {
      // console.log(data);
      this.allCourses = data;
    });
  }
  ngOnInit(): void {
  }

}
