import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

declare var UIkit;

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  fileName: any;
  fileType: any;
  uploadPercent: any;
  newAnnoModel = false;
  constructor(private route: ActivatedRoute, private dataService: DataService, private storage: AngularFireStorage) { }


  createNewFolder = false;
  newAnnouncement = {
    title: '', text: '', time: Date.now(), teacherId: '', courseId: '', blockId: '',
    attache: null
  };
  updateId = '';
  courseId;
  blockId;
  allAnnouncement;
  courseName;
  attache = { fileName: '', fileUrl: '' }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.courseId = params.courseId;
      this.blockId = params.subBlockId;
      this.newAnnouncement.courseId = params.courseId;
      this.newAnnouncement.blockId = this.blockId;
      this.newAnnouncement.teacherId = localStorage.getItem('userId');
      this.getAnnouncement();
      this.getCourse();
    });
  }




  addAnnouncement() {
    if (this.newAnnouncement.text.length > 0) {
      this.newAnnouncement.time = Date.now();
      this.dataService.addItem('announcement', this.newAnnouncement).subscribe(data => {
        console.log(data);
        this.newAnnoModel = false;
        this.getAnnouncement();
      });
    }
  }



  uploadFile(event) {
    // console.log(event);

    const file = event.files[0];

    this.fileName = file.name;
    console.log(this.fileName);

    this.attache.fileName = this.fileName;
    const filePath = `${this.blockId}/${this.courseId}/announcement/${this.fileName}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.attache.fileName = this.fileName;
        this.attache.fileUrl = url;
        this.newAnnouncement.attache = this.attache;
      }))
    )
      .subscribe();
  }

  deleteRefrence() {
    this.storage.storage.refFromURL(this.newAnnouncement.attache.fileUrl).delete().then(() => {
      this.newAnnouncement.attache.fileName = '';
      this.newAnnouncement.attache.fileUrl = '';
    });
  }

  editAnnouncement(announc) {
    this.newAnnoModel = true;
    this.newAnnouncement.text = announc.text;
    this.newAnnouncement.title = announc.title;
    this.newAnnouncement.attache = announc.attache;
    this.updateId = announc._id;
  }

  getAnnouncement() {
    this.dataService.getFilterData({
      to: 'announcement', filter: { courseId: this.courseId, teacherId: localStorage.getItem('userId') },
      populate: { path: 'teacherId', select: 'teacherName' }
    }
    ).subscribe(data => {
      console.log(data);
      this.allAnnouncement = data;
    });
  }


  deleteAnnouncement(id) {
    UIkit.modal.confirm('Delete Selected Announcement Permanently').then(() => {
      this.dataService.deleteItem('announcement/' + id).subscribe(() => {
        this.getAnnouncement();
      });

    });
  }

  updateAnnouncement() {
    this.dataService.updateItem('announcement/' + this.updateId, this.newAnnouncement).subscribe(() => {
      this.getAnnouncement();
      this.newAnnoModel = false;
      this.reset();
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
    this.updateId = '';
    this.newAnnouncement.title = '';
    this.newAnnouncement.text = '';
    this.newAnnouncement.attache.fileUrl = '';
    this.newAnnouncement.attache.fileUrl = '';
  }
}
