import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-grade',
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit {
  studentId: any;
  blockId: any;
  courseId: any;
  allAssingment: any;
  assingments = [];
  courseName: any;
  allQuiz;
  quizs: any;
  today: string;

  constructor(private auth: AuthService, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit(): void {


    const now = new Date;
    this.today = now.toISOString();

    this.studentId = this.auth.getUserId();
    this.route.params.subscribe(params => {
      this.blockId = params.subBlockId;
      this.courseId = params.courseId;
      this.getAssingment();
      this.getCourse();
      this.updateNewGrade();
      this.getQuiz();
    });
  }


  getAssingment() {
    console.log(this.studentId);
    this.dataService.getFilterData({
      to: 'assingments', filter: { courseId: this.courseId, blockId: this.blockId }, projection:
      {
        assingmentDesc: 1, assingmentTitle: 1, assingmentUrl: 1, blockId: 1, courseId: 1, deadLine: 1, outOf: 1,
        submission: { $elemMatch: { studentId: this.studentId } }
      }
    }).subscribe(data => {
      console.log(data);
      this.assingments = [];
      this.allAssingment = data;
      this.allAssingment.forEach(element => {
        if (element.submission[0].marks) {
          this.assingments.push(element);
        }
      });

    });
  }



  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { courseId: this.courseId, blockId: this.blockId },
      projection: {
        quizTitle: 1, outOf: 1, deadLine: 1, courseId: 1, blockId: 1, noOfQue: 1, noOfAttempt: 1, activateTime: 1, qTime: 1,
        submission: { $elemMatch: { studentId: this.studentId } }
      }
    }
    ).subscribe(data => {
      console.log(data);
      this.allQuiz = data;
      this.quizs = [];

      this.allQuiz.forEach(element => {
        if (element.submission.length > 0) {
          const deadLine = new Date(element.deadLine);
          const today = new Date(this.today);
          console.log(deadLine, today);

          if (element.submission[0].marks && deadLine < today) {
            this.quizs.push(element);
          }
        }
      });
    });
  }


  updateNewGrade() {
    this.dataService.getItem('student/' + this.studentId).subscribe(data => {
      const courseIndex = data['newGrade'].indexOf(this.courseId);

      if (courseIndex != -1) {
        data['newGrade'].splice(0, 1);
        this.dataService.updateItem('student/' + this.studentId, data).subscribe(data1 => {
          console.log(data1);

        });
      }
    })
  }

  getCourse() {
    this.dataService.getFilterData({
      to: 'course', filter: { _id: this.courseId },
      projection: { courseName: 1 }
    }).subscribe(data => {
      // console.log(data);

      this.courseName = data[0].courseName;
    });
  }


}
