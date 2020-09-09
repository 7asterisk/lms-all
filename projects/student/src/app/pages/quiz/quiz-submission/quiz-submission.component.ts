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
  studentId;
  quizId;
  questions;
  anss;
  quizTitle;
  courseId;
  courseName;
  constructor(private dataService: DataService, private authService: AuthService, private route: ActivatedRoute) {
    this.studentId = this.authService.getUserId();
  }
  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { _id: this.quizId },
      projection: {
        questions: 1, outOf: 1, quizTitle: 1, submission: { $elemMatch: { studentId: this.studentId } }
      }
    }
    ).subscribe(data => {
      console.log(data);
      this.questions = data[0].questions;
      this.anss = data[0].submission[0].anss;
      this.quizTitle = data[0].quizTitle;
    });
  }
  ngOnInit(): void {
    this.route.params.subscribe(parms => {
      this.quizId = parms.quiz;
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
