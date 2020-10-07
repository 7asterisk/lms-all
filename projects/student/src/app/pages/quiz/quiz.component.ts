import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  courseId;
  subBlockId;
  today;
  allQuiz: any;
  inActiveQuiz = [];
  activeQuiz = [];
  courseName: any;
  studentId;
  quizId: any;
  quizTitle: any;
  beforStartPanal = false;

  constructor(private route: ActivatedRoute, private dataService: DataService, private auth: AuthService) { }

  ngOnInit(): void {
    const now = new Date;
    this.studentId = this.auth.getUserId();
    this.today = now.toISOString();
    this.route.queryParams.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      console.log(this.courseId);

      this.getCourse();
      this.getQuiz();
    });
  }
  startQuiz(id, title) {
    this.quizId = id;
    this.quizTitle = title;
    this.beforStartPanal = true;
  }
  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { courseId: this.courseId, blockId: this.subBlockId },
      projection: {
        quizTitle: 1, outOf: 1, deadLine: 1, courseId: 1, blockId: 1, noOfQue: 1, noOfAttempt: 1, activateTime: 1, qTime: 1,
        submission: { $elemMatch: { studentId: this.studentId } }
      }
    }
    ).subscribe(data => {
      console.log(data);
      this.allQuiz = data;
      console.log(this.today);
      const today = new Date(this.today);
      this.allQuiz.forEach(element => {
        const activetime = new Date(element.activateTime);
        const deadLine = new Date(element.deadLine);
        if (activetime <= today && deadLine >= today) {
          this.activeQuiz.push(element);
        } else {
          this.inActiveQuiz.push(element);
        }
      });
      // console.log(this.activeQuiz);
      // console.log(this.inActiveQuiz);

    });
  }


  canStart(quiz) {
    if (quiz.submission.length === 0) {
      return true;
    } else if (!(quiz.submission[0].attempted < quiz.noOfAttempt)) {
      return false;
    }
    return (quiz.deadLine >= this.today) && (quiz.activateTime <= this.today);
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
