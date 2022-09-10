import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {TokenStorageService} from '../_services/token-storage.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
    }
    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse) {
          console.log(err.status);
          console.log(err.statusText);
          if (err.status === 401) {
            this.token.signOut();
            window.location.href = "/login";
          }
          else if(err.status===404){
            window.location.href = "/notfound";
          }
        }
        return throwError(err);
      }) as any);
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
