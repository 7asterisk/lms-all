import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit {
  teacherId;
  newDiscussion = { time: Date.now(), text: '', teacherId: '', courseId: '', descTopicId: '', imgUrl: '' };
  newReply = { time: Date.now(), text: '', teacherId: '', courseId: '' };
  subBlockId;
  courseId;
  allDiscussion;
  courseName: any;
  replyId;
  descTopicId: any;
  discTopic;
  fileName: string;
  imgToUpload = false;
  imgFile: any;
  loading = false;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.teacherId = this.auth.getUserId();
    this.newDiscussion.teacherId = this.teacherId;
    this.route.queryParams.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newDiscussion.courseId = this.courseId;
      this.newDiscussion.descTopicId = params.discId;
      this.newReply.courseId = this.courseId;
      this.newReply.teacherId = this.teacherId;
      this.descTopicId = params.discId;
      this.getDiscTopic();
      this.getDiscussion();
      this.getCourse();
    });
  }

  addDiscussion() {
    this.loading = true;
    if (this.newDiscussion.text.length > 2 || this.imgFile) {
      if (this.imgFile) {
        this.uploadFile();
      } else {
        this.newDiscussion.time = Date.now();
        this.dataService.addItem('discussion', this.newDiscussion).subscribe(() => {
          this.getDiscussion();
          this.reset();
          this.loading = false;
        });
      }
    }
  }

  deleteDiscussion(id, imgUrl) {
    if (imgUrl) {
      this.storage.storage.refFromURL(imgUrl).delete().then(() => {
        this.dataService.deleteItem('discussion/' + id).subscribe(() => {
          this.getDiscussion();
        });
      });
    } else {
      this.dataService.deleteItem('discussion/' + id).subscribe(() => {
        this.getDiscussion();
      });
    }
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

  deleteDiscTopic(id) {
    this.dataService.deleteItem('discussiontopic/' + id).subscribe(() => {
      this.getDiscussion();
      this.router.navigate(['/tr/course/discussion-topic'], { queryParams: { courseId: this.courseId, subBlockId: this.subBlockId } });
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

  selectFile(event) {
    this.imgFile = event.files[0];
  }

  uploadFile() {
    const file = this.imgFile;
    this.fileName = file.name;
    const filePath = `${this.subBlockId}/${this.courseId}/discussion/${Date.now() + this.fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.newDiscussion.imgUrl = url;
        this.newDiscussion.time = Date.now();
        this.dataService.addItem('discussion', this.newDiscussion).subscribe(() => {
          this.getDiscussion();
          this.reset();
          this.imgFile = null;
          this.imgToUpload = false;
          this.loading = false;
        });
      }))
    )
      .subscribe();
  }

  deleteRefrence(imgUrl) {
    this.storage.storage.refFromURL(imgUrl).delete().then(() => {
    });
  }

  upVoteDiscTopic() {
    const upvote = { teacherId: this.teacherId };

    const i = this.discTopic?.upvote?.findIndex(x => x.teacherId === this.teacherId);
    if (i > -1) {
      this.discTopic.upvote.splice(i, 1);
    } else {
      this.discTopic.upvote.push(upvote);
    }
    this.dataService.updateItem('discussiontopic/' + this.discTopic._id, this.discTopic).subscribe(data => {
      console.log(data);
    });
  }

  upVoteDisc(discId) {
    const upvote = { teacherId: this.teacherId };
    const discIndex = this.allDiscussion.findIndex(x => x._id === discId);
    const i = this.allDiscussion[discIndex]?.upvote?.findIndex(x => x.teacherId === this.teacherId);
    if (i > -1) {
      this.allDiscussion[discIndex].upvote.splice(i, 1);
    } else {
      this.allDiscussion[discIndex].upvote.push(upvote)
    }
    this.dataService.updateItem('discussion/' + discId, this.allDiscussion[discIndex]).subscribe(data => {
      console.log(data);
    });
  }


  upVoteReply(discId, replyId) {
    const upvote = { teacherId: this.teacherId };
    const discIndex = this.allDiscussion.findIndex(x => x._id === discId);
    const replyIndex = this.allDiscussion[discIndex].replies.findIndex(x => x._id === replyId);

    const i = this.allDiscussion[discIndex].replies[replyIndex]?.upvote?.findIndex(x => x.teacherId === this.teacherId);
    if (i > -1) {
      this.allDiscussion[discIndex].replies[replyIndex].upvote.splice(i, 1);
    } else {
      this.allDiscussion[discIndex].replies[replyIndex].upvote.push(upvote);
    }
    this.dataService.updateItem('discussion/' + discId, this.allDiscussion[discIndex]).subscribe(data => {
      console.log(data);
    });
  }



  hasUpVoted(disc) {
    // console.log('hii from has voted');
    const i = disc?.upvote?.findIndex(x => x.teacherId === this.teacherId);
    if (i > -1) {
      return true;
    }
    return false;
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
    this.replyId = '';
    this.newDiscussion = {
      time: Date.now(), text: '', teacherId: this.teacherId,
      courseId: this.courseId, descTopicId: this.descTopicId, imgUrl: ''
    };
  }

  openReply(id) {
    this.replyId = id;
    // this.viewportScroller.scrollToAnchor(id);
  }
}
