import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { AuthService } from 'src/app/auth/auth.service';
declare var UIkit;
@Component({
  selector: 'app-desc-topic',
  templateUrl: './desc-topic.component.html',
  styleUrls: ['./desc-topic.component.scss']
})
export class DescTopicComponent implements OnInit {

  studentId;
  newDiscussion = { time: Date.now(), text: '', title: '', studentId: '', courseId: '' };
  subBlockId;
  courseId;
  allDiscussion;
  courseName: any;
  replyId;
  newTopicModel = false;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.studentId = this.auth.getUserId();
    this.newDiscussion.studentId = this.studentId;
    this.route.queryParams.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newDiscussion.courseId = this.courseId;
      this.getDiscussion();
      this.getCourse();
    });
  }



  addDiscussion() {
    if (this.newDiscussion.text.length > 2) {
      this.newDiscussion.time = Date.now();
      this.dataService.addItem('discussiontopic', this.newDiscussion).subscribe(() => {
        this.getDiscussion();
        this.newTopicModel = false;
        this.reset();
      });
    }
  }

  deleteDiscussion(id) {
    this.dataService.deleteItem('discussiontopic/' + id).subscribe(() => {
      this.getDiscussion();
    });
  }


  getDiscussion() {
    this.dataService.getDiscussionTopic({
      to: 'discussiontopic', filter: { courseId: this.courseId },
      projection: {}
    }
    ).subscribe(data => {
      console.log(data);
      this.allDiscussion = data;
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

  reset() {
    this.newDiscussion = { time: Date.now(), text: '', title: '', studentId: this.studentId, courseId: '' };
  }

  openReply(id) {
    this.replyId = id;
    // this.viewportScroller.scrollToAnchor(id);
  }
}
