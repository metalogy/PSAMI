import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorageService} from "./token-storage.service";

const API = 'http://127.0.0.1:8000/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  addEvent(eventData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Token': this.tokenStorageService.getToken(),
    });
    debugger;
    return this.http.post(API, eventData.photo,
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
        headers: headers
      }
    );
  }
}
