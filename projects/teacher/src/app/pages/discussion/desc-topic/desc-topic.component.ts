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

  teacherId;
  newDiscussion = { time: Date.now(), text: '', title: '', teacherId: '', courseId: '' };
  subBlockId;
  courseId;
  allDiscussion;
  courseName: any;
  replyId;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.teacherId = this.auth.getUserId();
    this.newDiscussion.teacherId = this.teacherId;
    this.route.params.subscribe(params => {
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
        UIkit.modal('#newTopic').hide();
        this.reset();
      });
    }
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
    this.newDiscussion = { time: Date.now(), text: '', title: '', teacherId: this.teacherId, courseId: '' };
  }

  openReply(id) {
    this.replyId = id;
    // this.viewportScroller.scrollToAnchor(id);
  }
}
