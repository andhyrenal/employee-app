import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addUser(newUser: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newUser);
  }

  updateUsers(id: number | null, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }

  deleteUser(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
