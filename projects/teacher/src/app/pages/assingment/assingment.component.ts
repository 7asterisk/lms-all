import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataService } from '../../data.service';

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
  newAssingment = {
    assingmentTitle: '', assingmentDesc: '', assingmentUrl: '', outOf: '', deadLine: '', courseId: '', blockId: ''
  };
  constructor(private route: ActivatedRoute, private dataService: DataService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    const now = new Date;
    this.today = now.toISOString();
    // console.log(this.today);

    this.route.params.subscribe(params => {
      this.blockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newAssingment.courseId = this.courseId;
      this.newAssingment.blockId = this.blockId;
      this.getAssingment();
      this.getCourse();
    });
  }

  reset() {
    this.newAssingment = {
      assingmentTitle: '', assingmentDesc: '', assingmentUrl: '', outOf: '', deadLine: '', courseId: '', blockId: ''
    };
  }
  uploadFile(event) {
    const file = event.target.files[0];
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

  deleteAssingment(id, url) {
    UIkit.modal.confirm('Delete Selected Assingment Permanently').then(() => {
      this.storage.storage.refFromURL(url).delete().then(() => {
        this.dataService.deleteItem('assingments/' + id).subscribe(() => {
          this.getAssingment();
        });
      });
    });
  }


  editAssingment(assingment) {
    this.newAssingment = {
      assingmentTitle: assingment.assingmentTitle,
      assingmentDesc: assingment.assingmentDesc,
      assingmentUrl: assingment.assingmentUrl,
      outOf: assingment.outOf,
      deadLine: this.formatDate(assingment.deadLine),
      courseId: assingment.courseId,
      blockId: assingment.blockId
    };
    this.idToUpdate = assingment._id;
  }
  updateAssingment() {
    this.dataService.updateItem('assingments/' + this.idToUpdate, this.newAssingment).subscribe(() => {
      UIkit.notification({
        message: 'Updateed Successfully',
        status: 'primary',
        pos: 'top-right',
        timeout: 1000
      });
      UIkit.modal('#edit-assingment').hide();
      this.getAssingment();
      this.reset();
    });
  }
  addAssingment() {
    // console.log(this.newAssingment);
    this.dataService.addItem('assingments', this.newAssingment).subscribe(data => {
      if (this.allAssingment) {
        this.allAssingment.push(data);
      } else {
        this.getAssingment();
      }
      UIkit.notification({
        message: 'Added Successfully',
        status: 'primary',
        pos: 'top-right',
        timeout: 5000
      });
      this.reset();
    });

  }
  getAssingment() {
    this.dataService.getFilterData({ to: 'assingments', filter: { courseId: this.courseId, blockId: this.blockId }, projection: {} }
    ).subscribe(data => {
      console.log(data);
      this.allAssingment = data;
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

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }
}
