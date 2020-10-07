import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotesComponent } from './pages/notes/notes.component';
import { AssingmentComponent } from './pages/assingment/assingment.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { AboutCourseComponent } from './pages/about-course/about-course.component';
import { QuizDetailComponent } from './pages/quiz/quiz-detail/quiz-detail.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { QuizSubmissionComponent } from './pages/quiz/quiz-submission/quiz-submission.component';
import { GradeComponent } from './pages/grade/grade.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { DescTopicComponent } from './pages/discussion/desc-topic/desc-topic.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { PolesComponent } from './pages/poles/poles.component';


const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'login', component: LoginComponent },
  {
    path: 'st/course', component: CoursesComponent, children: [
      { path: 'notes', component: NotesComponent },
      { path: 'assingment', component: AssingmentComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'discussion', component: DiscussionComponent },
      { path: 'discussion-topic', component: DescTopicComponent },
      { path: 'about-course', component: AboutCourseComponent },
      { path: 'quiz-submmision', component: QuizSubmissionComponent },
      { path: 'grade', component: GradeComponent },
      { path: 'polls', component: PolesComponent, }
    ], canActivate: [AuthGuard]
  },
  { path: 'st/announcement', component: AnnouncementComponent, canActivate: [AuthGuard] },
  { path: 'st/calender', component: CalenderComponent, canActivate: [AuthGuard] },
  { path: 'st/home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'st/quiz-detail', component: QuizDetailComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
