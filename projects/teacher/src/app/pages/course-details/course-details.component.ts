import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

  fullNav = true;

  departments;
  newCourse = { courseId: '', courseName: '', department: '', batch: '' };
  constructor(private dataService: DataService) {
    this.dataService.getItem({
      hasFilter: false,
      to: 'D'
    }).subscribe(data => this.departments = data);

  }

  addCourse() {
    console.log(this.newCourse);
    // this.dataService.addToCollection('')
  }
  ngOnInit(): void {
  }

}
