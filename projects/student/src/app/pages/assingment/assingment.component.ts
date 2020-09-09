import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

declare var UIkit;

@Component({
  selector: 'app-assingment',
  templateUrl: './assingment.component.html',
  styleUrls: ['./assingment.component.scss']
})
export class AssingmentComponent implements OnInit {

  courseId;
  blockId;
  allAssingment;
  courseName;
  today;
  fileName;
  fileType;
  idToUpdate;
  studentId;
  toSubmit;
  conform;
  newSubmition = { submissionDate: Date.now(), studentId: '', submissionUrl: '' }
  activeAssingment = [];
  inActiveAssingment = [];
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService,
    private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const now = new Date;
    this.today = now.toISOString();
    this.studentId = this.auth.getUserId();
    this.newSubmition.studentId = this.studentId;
    this.route.params.subscribe(params => {
      this.blockId = params.subBlockId;
      this.courseId = params.courseId;
      this.getAssingment();
      this.getCourse();
    });
  }


  uploadFile(event, assingmentId) {
    const file = event.target.files[0];
    const name = file.name;
    this.fileName = file.name;
    const lastDot = name.lastIndexOf('.');
    this.fileType = name.substring(lastDot + 1);

    console.log(this.fileType);

    const filePath = `${this.blockId}/${this.courseId}/assingment/${assingmentId}/${this.studentId}.${this.fileType}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.newSubmition.submissionUrl = url;
        this.newSubmition.submissionDate = Date.now();
      }))
    )
      .subscribe();
  }


  deleteSubmission(id, url) {

    this.storage.storage.refFromURL(url).delete().then(() => {
      this.dataService.deleteSubmission({
        to: id,
        studentId: this.studentId
      }).subscribe((data) => {
        // console.log(data);
        this.newSubmition.submissionUrl = '';
        this.fileName = '';
        this.getAssingment();
      });
    });

  }

  conformClicked(event) {
    this.conform = event.target.checked;
  }

  submissionForm(assingment) {
    this.toSubmit = assingment;
    if (this.toSubmit.submission.length > 0) {
      this.newSubmition.studentId = this.toSubmit.submission[0].studentId;
      this.newSubmition.submissionDate = Date.now();
      this.newSubmition.submissionUrl = this.toSubmit.submission[0].submissionUrl;
    } else {
      this.newSubmition.studentId = this.studentId;
    }

  }

  addSubmission(assingmentId) {
    this.dataService.addSubmission({ to: assingmentId, submition: this.newSubmition }).subscribe(data => {
      // console.log(data);
      UIkit.modal('#submit-form').hide();
      UIkit.notification({
        message: 'Submited Sucessfully',
        status: 'success',
        pos: 'top-right',
        timeout: 5000
      });

      this.getAssingment();
    });
  }


  getAssingment() {
    console.log(this.studentId);

    this.dataService.getFilterData({
      to: 'assingments', filter: { courseId: this.courseId, blockId: this.blockId }, projection:
      {
        assingmentDesc: 1, assingmentTitle: 1, assingmentUrl: 1, blockId: 1, courseId: 1, deadLine: 1, outOf: 1,
        submission: { $elemMatch: { studentId: this.studentId } }
      }
    }).subscribe(data => {
      console.log(data);
      this.activeAssingment = [];
      this.inActiveAssingment = [];
      this.allAssingment = data;

      const today = new Date(this.today);
      this.allAssingment.forEach(element => {
        const deadLine = new Date(element.deadLine);
        if (deadLine >= today) {
          this.activeAssingment.push(element);
        } else {
          this.inActiveAssingment.push(element);
        }
      });

    });
  }


  getCourse() {
    this.dataService.getFilterData({
      to: 'course', filter: { _id: this.courseId },
      projection: { courseName: 1 }
    }).subscribe(data => {
      // console.log(data);

      this.courseName = data[0].courseName;
    });
  }


}
