import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthService } from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private _auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let tokenizeReq;
    if (localStorage.getItem('token') != null) {
      tokenizeReq = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      });
    } else { tokenizeReq = request.clone({}); }

    return next.handle(tokenizeReq)
      .catch(err => {
        console.log('Caught error', err);
        if (err.status === 401) {
          const s = this._auth.refreshToken();
          if (s) {
            return next.handle(tokenizeReq);
          }
        }
        return Observable.throw(err);
      });
  }

}
