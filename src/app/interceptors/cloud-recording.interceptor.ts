import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";

@Injectable()
export class AgoraAuthInterceptor implements HttpInterceptor {
  username = "a1689f84c632407f8c34cb55f8731146";
  password = "ad10cde2e0d5472c9c5e74e16186069d";
  intercept(request: HttpRequest<any>, next: HttpHandler) {
    if (request.url.startsWith("https://api.agora.io/v1/apps")) {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error.message);
        return new Observable<any>();
      })
    );
  }
}
