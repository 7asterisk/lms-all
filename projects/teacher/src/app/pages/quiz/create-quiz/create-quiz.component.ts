import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'projects/student/src/app/data.service';
declare var UIkit;

@Component({
  selector: 'app-create-quiz',
  templateUrl: './create-quiz.component.html',
  styleUrls: ['./create-quiz.component.scss']
})
export class CreateQuizComponent implements OnInit {

  courseId;
  subBlockId;
  today;
  allQuiz: any;
  toUpdate;
  marksType = '1';
  newQuiz = {
    quizTitle: '', outOf: 0, activateTime: '', deadLine: '', qTime: '', noOfAttempt: '',
    courseId: '', blockId: '', questions: [], noOfQue: 0
  };
  marksTypeOP = [{ label: 'evenly', value: '1' },
  { label: 'maualy', value: '2' }];
  Ques = [];
  courseName: any;
  constructor(private route: ActivatedRoute, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    const now = new Date;
    this.today = now.toISOString();
    this.route.queryParams.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      if (params.quizId) {
        this.editQuiz(params.quizId);
      }
      this.newQuiz.courseId = this.courseId;
      this.newQuiz.blockId = this.subBlockId;
      this.getCourse();
    });
  }
  addQuiz() {
    this.newQuiz.questions = this.Ques;
    this.newQuiz.noOfQue = this.Ques.length;

    const assingedMarks = Number(this.newQuiz.outOf) / this.Ques.length;
    if (this.marksType === '1') {
      for (let index = 0; index < this.Ques.length; index++) {
        this.Ques[index].assingedMarks = assingedMarks;
      }
    } else {
      for (let index = 0; index < this.Ques.length; index++) {
        this.newQuiz.outOf = Number(this.newQuiz.outOf) + Number(this.Ques[index].assingedMarks);
      }
    }
    console.log(this.newQuiz);
    this.dataService.addItem('quiz', this.newQuiz).subscribe(data => {
    });
  }
  addQues() {
    this.Ques.push({ que: '', queType: 1, ops: [{ op: '' }, { op: '' }, { op: '' }, { op: '' }], anss: [], assingedMarks: 1 });
  }
  deleteQues(i) {
    this.Ques.splice(i, 1);
  }
  addAns(j, ans) {
    this.Ques[j].anss.push(ans.op);
  }

  removeAns(j, ans) {
    const i = this.Ques[j].anss.indexOf(ans.op);
    this.Ques[j].anss.splice(i, 1);
  }
  selectedType(qusType, j) {
    this.Ques[j].queType = qusType;
    if (qusType === '3') {
      this.Ques[j].ops = [];
    } else {
      this.Ques[j].ops = [{ op: '' }, { op: '' }, { op: '' }, { op: '' }];
    }
    console.log(this.Ques[j]);
  }


  editQuiz(id) {
    this.dataService.getItem('quiz/' + id).subscribe(data => {
      console.log(data);

      this.newQuiz.blockId = data['blockId'];
      this.newQuiz.courseId = data['courseId'];
      this.newQuiz.activateTime = this.formatDate(data['activateTime']);
      this.newQuiz.deadLine = this.formatDate(data['deadLine']);
      this.newQuiz.outOf = data['outOf'];
      this.newQuiz.quizTitle = data['quizTitle'];
      this.newQuiz.noOfQue = data['noOfQue'];
      this.newQuiz.qTime = data['qTime'];
      this.Ques = data['questions'];
      this.newQuiz.noOfAttempt = data['noOfAttempt'];
      console.log(this.Ques);
      this.toUpdate = data['_id'];
    });
  }


  updateQuiz() {
    this.newQuiz.questions = this.Ques;
    this.newQuiz.noOfQue = this.Ques.length;
    this.dataService.updateItem('quiz/' + this.toUpdate, this.newQuiz).subscribe(() => {
      this.reset();
      this.router.navigate(['/tr/course/quiz'], { queryParams: { courseId: this.courseId, subBlockId: this.subBlockId } });
    });
  }

  reset() {
    this.toUpdate = '';
    this.newQuiz = {
      quizTitle: '', outOf: 0, activateTime: '', noOfAttempt: '', deadLine: '', courseId: '', blockId: '', qTime: '',
      questions: [{ op: '' }], noOfQue: 0
    };
    this.Ques = [];
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
    console.log(date);
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let year = d.getFullYear();

    let hours = String(d.getHours());
    let min = String(d.getMinutes());

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (hours.length < 2) {
      hours = '0' + hours;
    }
    if (min.length < 2) {
      min = '0' + min;
    }

    return [year, month, day].join('-') + 'T' + [hours, min].join(':');
  }

}
