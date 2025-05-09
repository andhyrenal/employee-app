import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/assets/mock-api-users.json';
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => {
        const user = data.users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          return user;
        } else {
          throw new Error('Email atau password salah');
        }
      }),
      catchError(err => {
        throw err;
      })
    );
  }
}
