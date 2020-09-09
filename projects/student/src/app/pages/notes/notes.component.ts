import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  courseId;
  blockId;
  allFolder;
  courseName;
  fileName;
  fileType;
  uploadPercent;
  idToUpdate;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params.courseId;
      this.blockId = params.subBlockId;
      this.getNotes();
      this.getCourse();
    });
  }

  getCourse() {
    this.dataService.getFilterData({
      to: 'course', filter: { _id: this.courseId },
      projection: { courseName: 1 }
    }).subscribe(data => {

      this.courseName = data[0].courseName;
    });
  }

  getNotes() {
    this.dataService.getFilterData({ to: 'notes', filter: { courseId: this.courseId, blockId: this.blockId }, projection: {} }
    ).subscribe(data => {
      // console.log(data);
      this.allFolder = data;
    });
  }
}
