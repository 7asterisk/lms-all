import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  studentId;
  newDiscussion = { time: Date.now(), text: '', studentId: '', courseId: '', descTopicId: '' };
  newReply = { time: Date.now(), text: '', studentId: '', courseId: '' };
  subBlockId;
  courseId;
  allDiscussion;
  courseName: any;
  replyId;
  descTopicId: any;
  discTopic;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.studentId = this.auth.getUserId();
    this.newDiscussion.studentId = this.studentId;
    this.route.params.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newDiscussion.courseId = this.courseId;
      this.newDiscussion.descTopicId = params.discId;
      this.descTopicId = params.discId;
      this.newReply.courseId = this.courseId;
      this.newReply.studentId = this.studentId;
      this.getDiscTopic();
      this.getDiscussion();
      this.getCourse();
    });
  }



  addDiscussion() {
    if (this.newDiscussion.text.length > 2) {
      this.newDiscussion.time = Date.now();
      this.dataService.addItem('discussion', this.newDiscussion).subscribe(() => {
        this.getDiscussion();
        this.reset();
      });
    }
  }

  deleteDiscussion(id) {
    this.dataService.deleteItem('discussion/' + id).subscribe(() => {
      this.getDiscussion();
    });
  }

  deleteDiscTopic(id) {
    this.dataService.deleteItem('discussiontopic/' + id).subscribe(() => {
      this.getDiscussion();
      this.router.navigate(['/st/course/discussion-topic', { courseId: this.courseId, subBlockId: this.subBlockId }]);
    });
  }
  addReply(disc) {
    if (this.newReply.text.length > 2) {
      if (!disc.replies) {
        disc.replies = [];
        disc.replies.push(this.newReply);
      } else {
        disc.replies.push(this.newReply);
      }
      this.newReply.time = Date.now();
      this.dataService.updateItem('discussion/' + disc._id, disc).subscribe(() => {
        this.getDiscussion();
        this.reset();
        this.replyId = '';
      });
    }
  }

  deleteReply(disc, replyId) {
    const replyIndex = disc.replies.findIndex(x => x._id === replyId);
    // console.log(replyIndex);
    disc.replies.splice(replyIndex, 1);
    console.log(disc.replies);

    this.dataService.updateItem('discussion/' + disc._id, disc).subscribe(() => {
      this.getDiscussion();
      this.reset();
      this.replyId = '';
    });
  }

  getDiscussion() {
    this.dataService.getDiscussion({
      to: 'discussion', filter: { courseId: this.courseId, descTopicId: this.descTopicId },
      projection: {}
    }
    ).subscribe(data => {
      console.log(data);
      this.allDiscussion = data;
    });
  }


  getDiscTopic() {
    this.dataService.getDiscussionTopic({
      to: 'discussiontopic', filter: { courseId: this.courseId, _id: this.descTopicId },
      projection: {}
    }
    ).subscribe(data => {
      console.log(data);
      this.discTopic = data[0];
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
    this.newDiscussion = { time: Date.now(), text: '', studentId: this.studentId, courseId: '', descTopicId: '' };
  }

  openReply(id) {
    this.replyId = id;
    // this.viewportScroller.scrollToAnchor(id);
  }
}
