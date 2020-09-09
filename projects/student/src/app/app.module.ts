import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopnavComponent } from './nav/topnav/topnav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';


import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin

import { CoursesComponent } from './pages/courses/courses.component';
import { HomeComponent } from './pages/home/home.component';
import { NotesComponent } from './pages/notes/notes.component';
import { AssingmentComponent } from './pages/assingment/assingment.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { DiscussionComponent } from './pages/discussion/discussion.component';
import { AboutCourseComponent } from './pages/about-course/about-course.component';
import { QuizDetailComponent } from './pages/quiz/quiz-detail/quiz-detail.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { QuizSubmissionComponent } from './pages/quiz/quiz-submission/quiz-submission.component';
import { GradeComponent } from './pages/grade/grade.component';
import { DescTopicComponent } from './pages/discussion/desc-topic/desc-topic.component';
import { AnnouncementComponent } from './pages/announcement/announcement.component';
import { CalenderComponent } from './pages/calender/calender.component';





FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);


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
    QuizDetailComponent,
    QuizSubmissionComponent,
    GradeComponent,
    DescTopicComponent,
    AnnouncementComponent,
    CalenderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatRadioModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

@NgModule({})
export class StudentModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: [],
    };
  }
}
