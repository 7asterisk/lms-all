import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-assing-marks',
  templateUrl: './assing-marks.component.html',
  styleUrls: ['./assing-marks.component.scss']
})
export class AssingMarksComponent implements OnInit {

  studentId;
  quizId;
  questions;
  anss;
  quizTitle;
  attempted: any;
  submissionDate: any;
  courseId: any;
  courseName: any;
  studentName: any;
  student;
  constructor(private dataService: DataService, private authService: AuthService, private route: ActivatedRoute) {
  }
  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { _id: this.quizId },
      projection: {
        questions: 1, outOf: 1, quizTitle: 1, submission: { $elemMatch: { studentId: this.studentId } },
      }
    }
    ).subscribe(data => {
      console.log(data);
      this.questions = data[0].questions;
      this.anss = data[0].submission[0].anss;
      this.quizTitle = data[0].quizTitle;
      this.attempted = data[0].submission[0].attempted;
      this.submissionDate = data[0].submission[0].submissionDate;

      this.assingMarks();
    });
  }


  assingMarks() {
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].queType === '1' && !this.anss[i].givenMarks) {
        if (this.questions[i].anss[0] == this.anss[i].givenAns[0]) {
          this.anss[i].givenMarks = this.questions[i].assingedMarks;
        } else {
          this.anss[i].givenMarks = 0;
        }
      } else
        if (this.questions[i].queType === '2' && !this.anss[i].marks) {

          const found = this.anss[i].givenAns.every(r => this.questions[i].anss.includes(r));

          if (found && this.anss[i].givenAns.length === this.questions[i].anss.length) {
            this.anss[i].givenMarks = this.questions[i].assingedMarks;
          } else {
            this.anss[i].givenMarks = 0;
          }
        } else if (!this.anss[i].givenMarks) {
          this.anss[i].givenMarks = 0;
          console.log("I am in.....");

        }
    }
    // console.log(this.anss);

  }

  updateMarks() {
    console.log(this.anss);
    var totalMarks = 0;
    this.anss.forEach(element => {
      totalMarks = totalMarks + element.givenMarks;
    });
    this.dataService.updateQuizSub(
      {
        to: this.quizId,
        studentId: this.studentId,
        marks: totalMarks,
        anss: this.anss,
        attempted: this.attempted,
        submissionDate: this.submissionDate

      }).subscribe(data => {
        console.log(data);
      });
    if (this.student.newGrade.indexOf(this.courseId) < 0) {
      this.student.newGrade.push(this.courseId);
      this.dataService.updateItem('student/' + this.studentId, this.student).subscribe((data) => {
        console.log(data);
      });
    }

  }


  ngOnInit(): void {
    this.route.params.subscribe(parms => {
      this.quizId = parms.quizId;
      this.studentId = parms.studentId;
      this.courseId = parms.courseId;
      this.getQuiz();
      this.getStudent();
      this.getCourse();
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

  getStudent() {
    this.dataService.getFilterData({
      to: 'student', filter: { _id: this.studentId }
    }).subscribe(data => {
      this.student = data[0];
      console.log(this.student.newGrade.indexOf(this.courseId));

      this.studentName = data[0].studentName;
    });
  }


}

