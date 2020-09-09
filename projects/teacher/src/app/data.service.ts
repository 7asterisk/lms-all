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
  getItem(to) {
    return this.http.get(`${this.apiUrl}/${to}`);
  }
  deleteItem(to) {
    return this.http.delete(`${this.apiUrl}/${to}`);
  }

  getFilterData(data) {
    return this.http.post(this.apiUrl + '/getFilterData', data);
  }

  getCourses(data) {
    return this.http.post(this.apiUrl + '/getCourse', data, { headers: this.headers });
  }

  getDiscussionTopic(data) {
    return this.http.post(this.apiUrl + '/getdiscussiontopic', data);
  }
  getDiscussion(data) {
    return this.http.post(this.apiUrl + '/getDiscussion', data, { headers: this.headers });
  }
  updateQuizSub(data) {
    return this.http.put(this.apiUrl + '/quizSubmition', data);
  }

  updateAssingmentSub(data) {
    return this.http.put(this.apiUrl + '/assingmentSubmition', data);
  }

  resetPassword(data) {
    return this.http.post(this.apiUrl + '/resetpassword', data);
  }

  forgotPassword(data) {
    return this.http.post(this.apiUrl + '/forgotpassword', data);
  }
}
