import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-create-assingment',
  templateUrl: './create-assingment.component.html',
  styleUrls: ['./create-assingment.component.scss']
})
export class CreateAssingmentComponent implements OnInit {

  courseId;
  blockId;
  allAssingment;
  courseName;
  today;
  fileName;
  fileType;
  idToUpdate;
  newAssingment = {
    assingmentTitle: '', assingmentDesc: '', assingmentUrl: '', outOf: '', deadLine: '', courseId: '', blockId: ''
  };
  constructor(private route: ActivatedRoute, private router: Router,
    private dataService: DataService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const now = new Date;
    this.today = now.toISOString();
    // console.log(this.today);

    this.route.queryParams.subscribe(params => {
      this.blockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newAssingment.courseId = this.courseId;
      this.newAssingment.blockId = this.blockId;
      this.getCourse();
      this.getAssingment();
    });
  }

  reset() {
    this.newAssingment = {
      assingmentTitle: '', assingmentDesc: '', assingmentUrl: '', outOf: '', deadLine: '', courseId: '', blockId: ''
    };
  }
  uploadFile(event) {
    const file = event.files[0];
    const name = file.name;
    this.fileName = file.name;
    const lastDot = name.lastIndexOf('.');
    this.fileType = name.substring(lastDot + 1);

    // console.log(this.fileType);

    const filePath = `${this.blockId}/${this.courseId}/assingment${this.allAssingment.length}.${this.fileType}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.newAssingment.assingmentUrl = url;
      }))
    )
      .subscribe();
  }

  deleteRefrence() {
    this.storage.storage.refFromURL(this.newAssingment.assingmentUrl).delete().then(() => {
      this.newAssingment.assingmentUrl = '';
      this.fileName = '';
    });
  }

  getAssingment() {
    this.dataService.getFilterData({ to: 'assingments', filter: { courseId: this.courseId, blockId: this.blockId }, projection: {} }
    ).subscribe(data => {
      console.log(data);
      this.allAssingment = data;
    });
  }

  addAssingment() {
    // console.log(this.newAssingment);
    this.dataService.addItem('assingments', this.newAssingment).subscribe(data => {
      this.reset();
      this.router.navigate(['/tr/course/assingment', { courseId: this.courseId, subBlockId: this.blockId }]);
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


}
