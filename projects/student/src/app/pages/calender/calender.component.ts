import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { DataService } from '../../data.service';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    eventClick: this.handleEventClick.bind(this),
    events: []
  };
  studentId: string;
  blockId: any;
  allAssingment = [];
  allQuiz = []
  allEvent = [];
  selectedEvent = { courseName: '', courseId: '', title: '', deadLine: '', eventType: '' }
  displayModel = false;
  constructor(
    private dataService: DataService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.studentId = this.authService.getUserId();
    this.dataService.getItem('student/' + this.studentId).subscribe(data => {
      this.blockId = data['blockId'];
      // console.log(this.studentBlockId);
      this.getAssingment();
      this.getQuiz();
    });

  }


  getAssingment() {
    this.dataService.getFilterData({
      to: 'assingments', filter: { blockId: this.blockId },
      projection: { deadLine: 1, assingmentTitle: 1 },
      populate: { path: 'courseId', select: 'courseId courseName' }
    }
    ).subscribe(data => {
      console.log(data);
      let allAss: any = data;
      let j = allAss.length;
      allAss.forEach(element => {
        this.allAssingment.push({
          api: 'assingments/' + element._id,
          courseName: element.courseId.courseName,
          color: '#EA4335',
          title: element.courseId.courseId + '/ as' + j,
          date: this.formeatedDated(element.deadLine)
        })
        j -= 1;
      });
      this.allEvent = [...allAss, ...this.allQuiz];
      this.calendarOptions.events = [...allAss, ...this.allQuiz];
    });
  }

  getQuiz() {
    this.dataService.getFilterData({
      to: 'quiz', filter: { blockId: this.blockId },
      projection: { deadLine: 1, quizTitle: 1 },
      populate: { path: 'courseId', select: 'courseId courseName' }
    }
    ).subscribe(data => {
      // console.log(data);
      let allQz: any = data;
      let j = allQz.length;
      allQz.forEach(element => {
        this.allQuiz.push({
          api: 'quiz/' + element._id,
          courseName: element.courseId.courseName,
          title: element.courseId.courseId + '/ qz' + j,
          date: this.formeatedDated(element.deadLine)
        });
        j -= 1;
      });
      this.allEvent = [...this.allQuiz, ...this.allAssingment];
      this.calendarOptions.events = [...this.allQuiz, ...this.allAssingment];
    });
  }




  handleEventClick(arg) {
    // console.log(this.allEvent);
    this.displayModel = true;
    const index = this.allEvent.findIndex(x => x.title === arg.el.text);
    console.log(this.allEvent[index]);
    this.dataService.getItem(this.allEvent[index].api).subscribe(data => {
      // console.log(data);
      if (data['quizTitle']) {
        this.selectedEvent = {
          courseName: this.allEvent[index].courseName, courseId: data['courseId'],
          title: data['quizTitle'], deadLine: data['deadLine'], eventType: 'qz'
        };
      } else {
        this.selectedEvent = {
          courseName: this.allEvent[index].courseName, courseId: data['courseId'], title: data['assingmentTitle'],
          deadLine: data['deadLine'], eventType: 'as'
        };
      }
    })
  }

  // closeModel() {
  //   console.log("dddddddd");

  //   UIkit.modal('#event-detail').hide();
  // }



  formeatedDated(dateString) {
    let mm;
    let dd;
    dateString = new Date(dateString);
    if (dateString.getMonth() + 1 < 10) {
      mm = '0' + (dateString.getMonth() + 1)
    } else {
      mm = (dateString.getMonth() + 1);
    }
    if (dateString.getDate() < 10) {
      dd = '0' + dateString.getDate()
    } else {
      dd = dateString.getDate();
    }
    return dateString.getFullYear() + '-' + mm + '-' + dd;


  }
}
