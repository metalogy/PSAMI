import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenStorageService} from "./token-storage.service";

const API = 'http://127.0.0.1:8000/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
  }

  getProfile(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Token': this.tokenStorageService.getToken(),
    });

    return this.http.get(API + 'user/' + id, {headers}) //todo? wysyłanie hasła z powrotem na front;
  }

  getProfileComments(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Token': this.tokenStorageService.getToken(),
    });
    return this.http.get(API + 'profile_comments/' + id, {headers})
  }

  saveProfileComments(userId: number, comment: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Token': this.tokenStorageService.getToken(),
    });
    return this.http.post(API + 'profile_comments/', {"text": comment, "user_id": userId}, {headers});
  }

  updateProfile(id: number, userData: any): Observable<any> {
    return this.http.put(API + 'user/' + id, userData);
  }

  updateProfilePhoto(photo: any): string {
    const file = new FormData();
    if (photo != null) {
      file.append('file', photo, photo.name);
    }

    let xhr = new XMLHttpRequest();
    xhr.open('PUT', API + 'user/uploadfile/', false);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.tokenStorageService.getToken());
    xhr.send(file);
    return xhr.responseText;
  }
}
