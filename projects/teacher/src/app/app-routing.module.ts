import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotesComponent } from './pages/notes/notes.component';
import { AssingmentComponent } from './pages/assingment/assingment.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { AboutCourseComponent } from './pages/about-course/about-course.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CreateQuizComponent } from './pages/quiz/create-quiz/create-quiz.component';
import { QuizSubmissionComponent } from './pages/quiz/quiz-submission/quiz-submission.component';
import { AssingMarksComponent } from './pages/quiz/assing-marks/assing-marks.component';
import { AssingmentSubmissionsComponent } from './pages/assingment/assingment-submissions/assingment-submissions.component';
import { CreateAssingmentComponent } from './pages/assingment/create-assingment/create-assingment.component';
import { TrGuardGuard } from 'src/app/auth/tr-guard.guard';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { DescTopicComponent } from './pages/discussion/desc-topic/desc-topic.component';

const routes: Routes = [
  {
    path: 'tr/course', component: CoursesComponent, children: [
      { path: 'notes', component: NotesComponent },
      { path: 'assingment', component: AssingmentComponent },
      { path: 'create-assingment', component: CreateAssingmentComponent },
      { path: 'assingment-submission', component: AssingmentSubmissionsComponent },
      { path: 'quiz', component: QuizComponent },
      { path: 'create-quiz', component: CreateQuizComponent },
      { path: 'quiz-submission', component: QuizSubmissionComponent },
      { path: 'assing-quiz-marks', component: AssingMarksComponent },
      { path: 'discussion-topic', component: DescTopicComponent },
      { path: 'discussion', component: DiscussionComponent },
      { path: 'about-course', component: AboutCourseComponent },
      { path: 'announcement', component: AnnouncementComponent },
    ], canActivate: [TrGuardGuard]
  },
  { path: 'tr/home', component: HomeComponent, canActivate: [TrGuardGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
