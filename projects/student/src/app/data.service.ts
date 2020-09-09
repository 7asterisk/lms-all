import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

  constructor(private http: HttpClient) {

  }


  apiUrl = 'http://localhost:5000';
  // apiUrl = 'https://coursebackend.herokuapp.com';

  addItem(to, data) {
    return this.http.post(`${this.apiUrl}/${to}`, data, { headers: this.headers });
  }
  updateItem(to, data) {
    return this.http.put(`${this.apiUrl}/${to}`, data, { headers: this.headers });
  }
  deleteItem(to) {
    return this.http.delete(`${this.apiUrl}/${to}`);
  }

  getFilterData(data) {
    return this.http.post(this.apiUrl + '/getFilterData', data);
  }


  getItem(to) {
    return this.http.get(`${this.apiUrl}/${to}`);
  }

  getCourses(data) {
    return this.http.post(this.apiUrl + '/getCourse', data);
  }
  getDiscussion(data) {
    return this.http.post(this.apiUrl + '/getDiscussion', data);
  }
  getDiscussionTopic(data) {
    return this.http.post(this.apiUrl + '/getdiscussiontopic', data);
  }


  addSubmission(data) {
    return this.http.post(this.apiUrl + '/assingmentSubmition', data);
  }
  addQuizSubmission(data) {
    return this.http.post(this.apiUrl + '/quizSubmition', data);
  }

  updateQuizSub(data) {
    return this.http.put(this.apiUrl + '/quizSubmition', data);
  }

  deleteSubmission(data) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete(this.apiUrl + '/assingmentSubmition', options);
  }
  resetPassword(data) {
    return this.http.post(this.apiUrl + '/resetpassword', data);
  }


}
