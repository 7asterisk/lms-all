import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { DataService } from '../../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

declare var UIkit;

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent implements OnInit {
  quizId;
  index = 0;
  timeInterval;
  questions;
  que: any;
  anss = [];
  min = 1;
  sec = 59;
  submited = false;
  studentId;
  flags = [];
  attempted = 0;
  toUpdate = false;
  courseId: any;
  subBlockId: any;
  onlyObjective = true;
  originalQuestion: any;
  totalMarks = 0;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private locationStrategy: LocationStrategy) {
    this.studentId = this.auth.getUserId();
    this.route.params.subscribe(data => {
      // console.log(data);
      this.quizId = data.quiz;
      this.courseId = data.courseId;
      this.subBlockId = data.subBlockId;
    });
    this.timeInterval = setInterval(() => { this.decTime(); }, 1000);
    this.getQuiz();
  }

  decTime() {
    this.sec = this.sec - 1;
    if (this.sec === 0) {
      if (this.min === 0) {
        this.quizSubmission();
      } else {
        this.sec = 59;
        this.min -= 1;
      }
    }
  }

  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { _id: this.quizId },
      projection: {
        questions: 1, qTime: 1, noOfAttempt: 1, submission: { $elemMatch: { studentId: this.studentId } }
      }
    }
    ).subscribe(data => {
      if (data[0].submission.length > 0) {
        // console.log(data[0].submission[0]?.attempted);
        this.toUpdate = true;

        this.attempted = data[0].submission[0]?.attempted;
      }
      if (data[0].submission.length === 0 || data[0].submission[0]?.attempted < data[0].noOfAttempt) {
        this.min = data[0].qTime - 1;

        this.questions = data[0].questions;
        for (let i = 0; i < this.questions.length; i++) {
          if (this.questions[i].ops.length > 0) {
            this.questions[i].ops = this.shuffle(this.questions[i].ops);
          } else {
            this.onlyObjective = false;
          }
          this.anss.push({ qId: this.questions[i]._id, givenAns: [] });
        }
        // console.log(this.anss);
        this.originalQuestion = data[0].questions;
        console.log(data[0].questions);

        this.questions = this.shuffle(data[0].questions);

        this.que = this.questions[0];
        this.submited = false;
      } else {
        this.submited = true;
      }
    });
  }


  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  selectQus(i) {
    this.que = this.questions[i];
    this.index = i;
  }

  nextQue() {
    this.index = this.index + 1;
    this.que = this.questions[this.index];
  }

  previousQue() {
    this.index = this.index - 1;
    this.que = this.questions[this.index];
  }
  setFlag() {
    if (this.flags[this.index]) {
      this.flags[this.index] = 0;
    } else {

      this.flags[this.index] = 1;
    }
    // console.log(this.flags);

  }


  ansIndex(qid) {
    return this.anss.findIndex(x => x.qId === qid);
  }


  submitData() {
    console.log(this.anss);

    UIkit.modal.confirm('You are to submit your Quiz... <br> Once you press the Submit Quiz you cannot return to your quiz.').then(() => {
      this.quizSubmission();
    }, () => {
      console.log('Rejected.');
    });
  }

  quizSubmission() {
    clearInterval(this.timeInterval);
    if (this.onlyObjective) {
      this.assingMarks();
      // console.log(this.totalMarks);
    }
    if (this.toUpdate) {

      this.dataService.updateQuizSub(
        {
          to: this.quizId, studentId: this.studentId, submissionDate: Date.now(), anss: this.anss, marks: this.totalMarks,
          attempted: this.attempted += 1
        })
        .subscribe(data => {
          console.log(data);
          this.submited = true;
        });
    } else {

      this.dataService.addQuizSubmission(
        {
          to: this.quizId, submition:
          {
            studentId: this.studentId, submissionDate: Date.now(), anss: this.anss, marks: this.totalMarks,
            attempted: this.attempted += 1
          }
        }).subscribe(data => {
          console.log(data);
          this.submited = true;
        });
    }

  }


  assingMarks() {
    this.questions = this.originalQuestion;
    // console.log(this.originalQuestion);

    for (let i = 0; i < this.questions.length; i++) {
      const queIndex = this.questions.findIndex(x => x._id === this.anss[i].qId);
      if (this.questions[queIndex].queType === '1' && !this.anss[i].givenMarks) {

        if (this.questions[queIndex].anss[0] == this.anss[i].givenAns[0]) {
          this.anss[i].givenMarks = this.questions[queIndex].assingedMarks;
          this.totalMarks = this.totalMarks + this.questions[queIndex].assingedMarks;
          // console.log(this.totalMarks);

        } else {
          this.anss[i].givenMarks = 0;
        }
      } else
        if (this.questions[queIndex].queType === '2' && !this.anss[i].marks) {

          const found = this.anss[i].givenAns.every(r => this.questions[queIndex].anss.includes(r));

          if (found && this.anss[i].givenAns.length === this.questions[queIndex].anss.length) {
            this.anss[i].givenMarks = this.questions[queIndex].assingedMarks;
            this.totalMarks = this.totalMarks + this.questions[queIndex].assingedMarks;
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

  ngOnInit(): void {
    this.preventBackButton();
    window.addEventListener('keyup', disableF5);
    window.addEventListener('keydown', disableF5);

    function disableF5(e) {
      if ((e.which || e.keyCode) === 116) { e.preventDefault(); }
    }

    window.addEventListener('beforeunload', (e) => {
      const confirmationMessage = '\o/';
      console.log('cond');

      if (!this.submited) {
        e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
        return confirmationMessage;              // Gecko, WebKit, Chrome <34

      }
    });
  }

  activateQuizMode() {

  }



  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }


}
