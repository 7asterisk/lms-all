import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
declare var UIkit;

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
  toUpdate;
  newQuiz = { quizTitle: '', outOf: '', deadLine: '', courseId: '', blockId: '', questions: [], noOfQue: 0 };
  Ques = [{ que: '', op1: '', op2: '', op3: '', op4: '', ans: '' }];
  courseName: any;
  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {
    const now = new Date;
    this.today = now.toISOString();
    this.route.queryParams.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newQuiz.courseId = this.courseId;
      this.newQuiz.blockId = this.subBlockId;
      this.getCourse();
      this.getQuiz();
    });
  }

  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { courseId: this.courseId, blockId: this.subBlockId },
      projection: { quizTitle: 1, outOf: 1, deadLine: 1, courseId: 1, noOfAttempt: 1, blockId: 1, noOfQue: 1, 'submission.studentId': 1 }
    }
    ).subscribe(data => {
      console.log(data);
      this.allQuiz = data;
    });
  }

  deleteQuiz(id) {
    UIkit.modal.confirm('Delete Selected Quiz Permanently').then(() => {
      this.dataService.deleteItem('quiz/' + id).subscribe(() => {
        this.getQuiz();
      });
    });
  }



  reset() {
    this.toUpdate = '';
    this.newQuiz = { quizTitle: '', outOf: '', deadLine: '', courseId: '', blockId: '', questions: [], noOfQue: 0 };
    this.Ques = [{ que: '', op1: '', op2: '', op3: '', op4: '', ans: '' }];
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
