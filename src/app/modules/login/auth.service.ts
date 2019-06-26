import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { BackendService } from 'src/app/services/backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: string;
  isLoggedIn = false;

  constructor(private backend: BackendService) {}

  // store the URL so we can redirect after logging in
  redirectUrl: string;

  login(user: string, pwd: string): Observable<boolean> {
    return this.backend.authenticate(user, pwd).pipe(
      tap((resp) => {
        if (resp) {
          this.isLoggedIn = true;
          this.user = user;
          localStorage.setItem('access_token', resp);
        }
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('access_token');
  }
}
