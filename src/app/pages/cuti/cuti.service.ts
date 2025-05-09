import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CutiService {
  private apiUrl = 'http://localhost:3000/cuti';

  constructor(
    private http: HttpClient
  ) { }

  getCuti(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCuti(newCuti: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, newCuti);
  }

  updateCuti(id: string | null, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }

  deleteCuti(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
