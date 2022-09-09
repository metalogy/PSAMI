import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorageService} from "./token-storage.service";

const API_EVENT = 'http://127.0.0.1:8000/event/';
const API_EVENT_COMMENTS = 'http://127.0.0.1:8000/event_comments/';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Token': this.tokenStorageService.getToken(),
  });

  addEvent(eventData: any) {
    const file = new FormData();
    if (eventData.photo != null) {
      file.append('file', eventData.photo, eventData.photo.name);
    }

    let pathParams =
      '?name=' + eventData.eventName +
      '&description=' + eventData.description +
      '&date=' + eventData.date +
      '&status=' + eventData.status +
      '&city=' + eventData.city +
      '&address=' + eventData.address +
      '&is_private=' + eventData.isPrivate +
      '&is_reserved=' + eventData.isReserved +
      '&min_users=' + eventData.minUsers +
      '&max_users=' + eventData.maxUsers +
      '&suggested_age=' + eventData.suggestedAge;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', API_EVENT + pathParams, false);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.tokenStorageService.getToken());
    xhr.send(file);
    return xhr.responseText;
  }

  editEvent(eventId: number, eventData: any): Observable<any> {
    return this.http.put(API_EVENT + eventId,
      {
        name: eventData.eventName,
        description: eventData.description,
        date: eventData.date,
        status: 'status',
        city: eventData.city,
        address: eventData.address,
        is_private: eventData.isPrivate,
        is_reserved: eventData.isReserved,
        min_users: eventData.minUsers,
        max_users: eventData.maxUsers,
        suggested_age: eventData.suggestedAge,
      },
      {headers: this.headers}
    );
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(API_EVENT + id, {headers: this.headers})
  }

  getEvents(): Observable<any> {
    return this.http.get(API_EVENT, {headers: this.headers})
  }

  searchEvents(eventName: string, eventDate: string): Observable<any> {
    if (eventName != '' && eventDate != null) {
      return this.http.get(API_EVENT + '?name=' + eventName + '?date=' + eventDate, {headers: this.headers}) //todo? wysukiwanie działa dziwnie
    } else if (eventName != '') {
      return this.http.get(API_EVENT + '?name=' + eventName, {headers: this.headers}) //todo? wysukiwanie działa dziwnie
    } else if (eventDate != null) {
      return this.http.get(API_EVENT + '?date=' + eventDate, {headers: this.headers}) //todo? wysukiwanie działa dziwnie
    } else {
      return this.http.get(API_EVENT, {headers: this.headers}) //todo? wysukiwanie działa dziwnie
    }
  }

  getEventComments(id: number): Observable<any> {
    return this.http.get(API_EVENT_COMMENTS + id, {headers: this.headers})
  }

  saveEventComment(eventId: number, comment: string): Observable<any> {
    return this.http.post(API_EVENT_COMMENTS, {
      "text": comment,
      "event_id": eventId,
      "rating": 6
    }, {headers: this.headers});//todo ocena?
  }

  deleteEventComment(commentId: number) {
    debugger;
    return this.http.delete(API_EVENT_COMMENTS + '?comment_id=' + commentId);
  }

  getParticipants(eventId: number): Observable<any> {
    return this.http.get(API_EVENT + 'participants/?event_id=' + eventId, {headers: this.headers});
  }

  joinEvent(eventId: number): Observable<any> {
    return this.http.post(API_EVENT + 'participate/?event_id=' + eventId, {headers: this.headers});
  }

  leaveEvent(eventId: number): Observable<any> {
    return this.http.delete(API_EVENT + 'not_participate/?event_id=' + eventId, {headers: this.headers});
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(API_EVENT + '?event_id=' + eventId, {headers: this.headers});
  }

  updateEventPhoto(eventId: number, photo: any) {
    const file = new FormData();
    if (photo != null) {
      file.append('file', photo, photo.name);
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', API_EVENT + 'uploadfile/?event_id=' + eventId, false);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.tokenStorageService.getToken());
    xhr.send(file);
    return xhr.responseText;
  }
}
