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
    //todo na front z be chcemy raczej przesłać zdjęcie a nie odnośnik do png
    // todo coordsy
  }

  getProfileComments(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'X-Token': this.tokenStorageService.getToken(),
    });
    return this.http.get(API + 'profile_comments/' + id, {headers}) //todo? nick usera w requeście / ew. można z get user, ale gorsza wydajność
  }

  saveProfileComments(userId: number, comment: string): Observable<any> {
    const headers = new HttpHeaders({
      'X-Token': this.tokenStorageService.getToken(),
    });
    return this.http.post(API + 'profile_comments/', {"text": comment, "user_id": userId}, {headers});//todo? dodać nick usera w requeście
  }

}
