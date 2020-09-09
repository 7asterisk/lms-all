import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './nav/topnav/topnav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';


import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';


import { CoursesComponent } from './pages/courses/courses.component';
import { HomeComponent } from './pages/home/home.component';
import { NotesComponent } from './pages/notes/notes.component';
import { AssingmentComponent } from './pages/assingment/assingment.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { AboutCourseComponent } from './pages/about-course/about-course.component';
import { FormsModule } from '@angular/forms';
import { CreateQuizComponent } from './pages/quiz/create-quiz/create-quiz.component';
import { QuizSubmissionComponent } from './pages/quiz/quiz-submission/quiz-submission.component';
import { AssingMarksComponent } from './pages/quiz/assing-marks/assing-marks.component';
import { AssingmentSubmissionsComponent } from './pages/assingment/assingment-submissions/assingment-submissions.component';
import { CreateAssingmentComponent } from './pages/assingment/create-assingment/create-assingment.component';
import { HttpClientModule } from '@angular/common/http';
import { DescTopicComponent } from './pages/discussion/desc-topic/desc-topic.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';


@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    CoursesComponent,
    HomeComponent,
    NotesComponent,
    AssingmentComponent,
    QuizComponent,
    DiscussionComponent,
    AboutCourseComponent,
    CreateQuizComponent,
    QuizSubmissionComponent,
    AssingMarksComponent,
    AssingmentSubmissionsComponent,
    CreateAssingmentComponent,
    DescTopicComponent,
    AnnouncementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatSidenavModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


@NgModule({})
export class TeacherModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: [],
    };
  }
}
