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

  addEvent(eventData: any): Observable<any> {
    return this.http.post(API_EVENT, eventData.photo,
      {
        params:
          {
            name: eventData.name,
            description: eventData.description,
            date: eventData.date,
            status: eventData.status,
            city: eventData.city,
            address: eventData.address,
            is_private: eventData.isPrivate,
            is_reserved: eventData.isReserved,
            min_users: eventData.minUsers,
            max_users: eventData.maxUsers,
            suggested_age: eventData.suggestedAge,
          },
        headers: this.headers
      }
    );
  }

  getEvent(id: number): Observable<any> {
    return this.http.get(API_EVENT + id, {headers: this.headers})
  }

  getEventComments(id: number): Observable<any> {
    return this.http.get(API_EVENT_COMMENTS + id, {headers: this.headers})
  }

  saveEventComment(eventId: number, comment: string): Observable<any> {
    return this.http.post(API_EVENT_COMMENTS, {"text": comment, "event_id": eventId, "rating": 6}, {headers: this.headers});//todo ocena?
  }
}
