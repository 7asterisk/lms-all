import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DataService } from '../../data.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-poles',
  templateUrl: './poles.component.html',
  styleUrls: ['./poles.component.scss'],
  providers: [ConfirmationService]
})
export class PolesComponent implements OnInit {

  newPole = { text: '', time: Date.now(), choices: [], teacherId: '', courseId: '' };
  newChoices = [{ text: '' }, { text: '' }];
  teacherId: string;
  subBlockId: any;
  courseId: any;

  courseName: any;
  allPole;
  newPoleModel = false;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private auth: AuthService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.teacherId = this.auth.getUserId();
    this.newPole.teacherId = this.teacherId;
    this.route.queryParams.subscribe(params => {
      this.subBlockId = params.subBlockId;
      this.courseId = params.courseId;
      this.newPole.courseId = params.courseId;
      this.getCourse();
      this.getPole();
    });
  }

  getPole() {
    this.dataService.getFilterData({
      to: 'pole', filter: { courseId: this.courseId },
      projection: {}
    }
    ).subscribe(data => {
      console.log(data);
      this.allPole = data;
    });
  }
  deletePole(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this poll?',
      accept: () => {
        this.dataService.deleteItem('pole/' + id).subscribe(() => {
          this.getPole();
        });
      }
    });
  }
  hasVoted(pole) {
    const i = pole.voted.findIndex(x => x.teacherId === this.teacherId);
    if (i > -1) {
      return true;
    }
    return false;
  }
  selectChoice(poleId, chId) {
    const poleIndex = this.allPole.findIndex(x => x._id === poleId);
    const chIndex = this.allPole[poleIndex].choices.findIndex(x => x._id === chId);
    this.allPole[poleIndex].voted.push({ teacherId: this.teacherId });
    const totalVoted = this.allPole[poleIndex].voted.length;
    for (let i = 0; i < this.allPole[poleIndex].choices.length; i++) {
      if (i === chIndex) {
        if (this.allPole[poleIndex].choices[chIndex]?.totalSelections) {
          const chVotedNo = this.allPole[poleIndex].choices[chIndex].totalSelections * (totalVoted - 1) / 100;
          this.allPole[poleIndex].choices[chIndex].totalSelections = Math.round(((chVotedNo + 1) * 100) / totalVoted);
        } else {
          this.allPole[poleIndex].choices[chIndex].totalSelections = Math.round((1 * 100) / totalVoted);
        }
      } else {
        if (this.allPole[poleIndex].choices[i]?.totalSelections) {
          const chVotedNo = this.allPole[poleIndex].choices[i].totalSelections * (totalVoted - 1) / 100;
          this.allPole[poleIndex].choices[i].totalSelections = Math.round((chVotedNo * 100) / totalVoted);
        } else {
          this.allPole[poleIndex].choices[i].totalSelections = Math.round((0 * 100) / totalVoted);
        }
      }
    }
    this.dataService.updateItem('pole/' + this.allPole[poleIndex]._id, this.allPole[poleIndex]).subscribe(() => {

    })
  }

  getCourse() {
    this.dataService.getFilterData({
      to: 'course', filter: { _id: this.courseId },
      projection: { courseName: 1 }
    }).subscribe(data => {
      this.courseName = data[0].courseName;
    });
  }


  addPole() {
    console.log(this.newChoices);
    console.log(this.newPole);
    if (this.newPole.text.length > 2) {
      this.newPole.choices = this.newChoices;
      this.newPole.time = Date.now();
      this.dataService.addItem('pole', this.newPole).subscribe((data) => {
        console.log(data);
        this.newPoleModel = false;
        this.getPole();
      });
    }
  }

}
