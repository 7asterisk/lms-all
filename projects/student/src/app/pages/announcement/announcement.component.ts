import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService
  ) { }


  courseId;
  blockId;
  allAnnouncement;
  studentId;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.studentId = this.authService.getUserId();
      this.dataService.getItem('student/' + this.studentId).subscribe(data => {
        this.blockId = data['blockId'];
        // console.log(this.studentBlockId);
        this.getAnnouncement();
      });
    });
  }


  getAnnouncement() {
    this.dataService.getFilterData({
      to: 'announcement', filter: { blockId: this.blockId },
      populate: { path: 'teacherId', select: 'teacherName' }
    }
    ).subscribe(data => {
      console.log(data);
      this.allAnnouncement = data;
    });
  }


}
