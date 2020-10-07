import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgProgressComponent } from 'ngx-progressbar';
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


  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;

  ngAfterViewInit() {
    this.progressBar.start();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
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
      this.progressBar.complete();
    });
  }
}
