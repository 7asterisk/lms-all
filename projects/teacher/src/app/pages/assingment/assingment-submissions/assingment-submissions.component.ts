import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

declare var UIkit;

@Component({
  selector: 'app-assingment-submissions',
  templateUrl: './assingment-submissions.component.html',
  styleUrls: ['./assingment-submissions.component.scss']
})
export class AssingmentSubmissionsComponent implements OnInit {

  teacherId;
  assingmentId;
  assingmentTitle;
  allSubmission;
  blockId;
  allStudent;
  outOf;
  courseName;
  courseId;
  notSubmited = [];
  toAssist;
  showDilog = false;
  assingMarks = { to: '', marks: '', feedback: '', studentId: '' };
  constructor(private dataService: DataService, private authService: AuthService, private route: ActivatedRoute) {
    this.teacherId = this.authService.getUserId();
  }


  addMarks(sub) {
    this.showDilog = true;
    this.toAssist = sub;
    console.log(this.toAssist);
    this.assingMarks.marks = sub.marks;
    this.assingMarks.feedback = sub.feedback;
    this.assingMarks.studentId = sub.studentId._id;
  }

  updateSubMarks() {
    console.log(this.assingMarks);
    this.dataService.updateAssingmentSub(this.assingMarks).subscribe(data => {
      console.log(data);
      this.toAssist = null;
      this.showDilog = false;
      this.updateNewGrade(this.assingMarks.studentId);
    });
  }

  updateNewGrade(studentId) {
    this.dataService.getItem('student/' + studentId).subscribe(data => {
      const courseIndex = data['newGrade'].indexOf(this.courseId);
      if (courseIndex === -1) {
        data['newGrade'].push(this.courseId);
        this.dataService.updateItem('student/' + studentId, data).subscribe(data1 => {
          console.log(data1);
        });
      }
    })
  }
  getQuiz() {
    this.dataService.getFilterData({
      to: 'assingments', filter: { _id: this.assingmentId },
      projection: {
        assingmentTitle: 1, 'submission.submissionDate': 1,
        'submission.submissionUrl': 1, 'submission.feedback': 1,
        'submission.marks': 1, outOf: 1
      },
      populate: {
        path: 'submission.studentId',
        select: 'studentName'
      }
    }
    ).subscribe(data => {
      console.log(data);
      this.allSubmission = data[0].submission;
      this.assingmentTitle = data[0].assingmentTitle;
      this.outOf = data[0].outOf;
      this.getStudent();
    });
  }


  getStudent() {
    this.dataService.getFilterData({
      to: 'student', filter: { blockId: this.blockId },
      projection: { studentName: 1 }
    }
    ).subscribe(data => {
      console.log(data);
      this.allStudent = data;
      this.allStudent.forEach(element => {
        const pos = this.allSubmission.map(function (e) { return e.studentId._id; }).indexOf(element._id);
        if (pos === -1) {
          this.notSubmited.push(element);
        }
      });
      console.log(this.notSubmited);
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(parms => {
      this.assingmentId = parms.assingment;
      this.assingMarks.to = this.assingmentId;
      this.courseId = parms.courseId;
      this.blockId = parms.subBlockId;
      this.getQuiz();
      this.getCourse();
    });
  }

}
