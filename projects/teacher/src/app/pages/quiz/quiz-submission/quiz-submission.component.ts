import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-quiz-submission',
  templateUrl: './quiz-submission.component.html',
  styleUrls: ['./quiz-submission.component.scss']
})
export class QuizSubmissionComponent implements OnInit {
  teacherId;
  quizId;
  quizTitle;
  allSubmission;
  blockId;
  allStudent;
  outOf;
  notSubmited = [];
  courseId: any;
  courseName: any;
  constructor(private dataService: DataService, private authService: AuthService, private route: ActivatedRoute) {
    this.teacherId = this.authService.getUserId();
  }
  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { _id: this.quizId },
      projection: { quizTitle: 1, 'submission.submissionDate': 1, 'submission.marks': 1, outOf: 1 },
      populate: {
        path: 'submission.studentId'
      }
    }
    ).subscribe(data => {
      console.log(data);
      this.allSubmission = data[0].submission;
      this.quizTitle = data[0].quizTitle;
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

  ngOnInit(): void {
    this.route.queryParams.subscribe(parms => {
      this.quizId = parms.quizId;
      this.blockId = parms.subBlockId;
      this.courseId = parms.courseId;
      this.getQuiz();
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


}
