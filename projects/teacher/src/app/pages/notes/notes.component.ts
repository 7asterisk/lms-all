import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var UIkit: any;
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  constructor(private route: ActivatedRoute, private dataService: DataService, private storage: AngularFireStorage) { }


  createNewFolder = false;
  newNote = { noteName: '', noteDesc: '', noteUrl: '' }
  newFolder = { folderName: '', courseId: '', blockId: '', teacherId: '', notes: [] };
  allFolder;
  renameId = '';
  openFolder = 0;

  courseId;
  blockId;
  allNotes;
  courseName;
  fileName;
  fileType;
  uploadPercent;
  idToUpdate;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params.courseId;
      this.blockId = params.subBlockId;
      this.newFolder.courseId = params.courseId;
      this.newFolder.blockId = params.subBlockId;
      this.newFolder.teacherId = localStorage.getItem('userId');
      this.getNotes();
      this.getCourse();
    });
  }



  uploadFile(event, folder) {
    // console.log(event);

    const file = event.target.files[0];

    const name = file.name;
    this.fileName = file.name;
    this.newNote.noteName = file.name;
    const lastDot = name.lastIndexOf('.');
    this.fileType = name.substring(lastDot + 1);

    // console.log(this.fileType);

    const filePath = `${this.blockId}/${this.courseId}/notes/${folder.notes.length}.${this.fileType}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => fileRef.getDownloadURL().subscribe(url => {
        this.newNote.noteUrl = url;
        folder.notes.push(this.newNote);
        this.updateNote(folder);
      }))
    )
      .subscribe();
  }

  deleteNote(folder, noteIndex) {
    UIkit.modal.confirm('Delete Selected File Permanently').then(() => {

      this.storage.storage.refFromURL(folder.notes[noteIndex].noteUrl).delete().then(() => {
        folder.notes.splice(noteIndex, 1);
        this.updateNote(folder);
      });
    });
  }


  addFolder(folderName) {
    if (folderName.length > 0) {
      this.newFolder.folderName = folderName;
      this.dataService.addItem('notes', this.newFolder).subscribe(data => {
        this.createNewFolder = false;
        this.newFolder.folderName = '';
        this.newFolder.notes = [];
        if (this.allFolder) {
          this.allFolder.push(data);
        } else {
          this.getNotes();
        }
      });
    }
  }

  editNote(note) {

    // this.newNote.blockId = note.blockId;
    // this.newNote.courseId = note.courseId;
    // this.newNote.noteDesc = note.noteDesc;
    // this.newNote.noteUrl = note.noteUrl;
    // this.newNote.noteTitle = note.noteTitle;
    // this.idToUpdate = note._id;
    // console.log(note);

  }

  getNotes() {
    this.dataService.getFilterData({ to: 'notes', filter: { courseId: this.courseId, blockId: this.blockId }, projection: {} }
    ).subscribe(data => {
      console.log(data);
      this.allFolder = data;
    });
  }

  isHidden(i) {
    console.log(i);

    return i === this.openFolder;
  }

  deleteFolder(id, folder) {
    UIkit.modal.confirm('Delete Selected Folder Permanently').then(() => {
      folder.notes.forEach(element => {
        this.storage.storage.refFromURL(element.noteUrl).delete().then(() => {
        });
      });
      this.dataService.deleteItem('notes/' + id).subscribe(() => {
        this.getNotes();
      });

    });
  }

  updateNote(folder) {
    this.dataService.updateItem('notes/' + folder._id, folder).subscribe(() => {
      this.getNotes();
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
  setRenameId(id) {
    this.renameId = id;
    console.log(this.renameId);

  }
  reset() {
    this.renameId = '';
    this.newNote = { noteName: '', noteUrl: '', noteDesc: '' };
  }
}
