import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuti } from '../../model/cuti';

@Injectable({
  providedIn: 'root'
})
export class CutiService {
  private apiUrl = 'http://localhost:3000/cuti';

  constructor(
    private http: HttpClient
  ) { }

  getCuti(): Observable<Cuti[]> {
    return this.http.get<Cuti[]>(this.apiUrl);
  }

  addCuti(newCuti: Cuti): Observable<any> {
    return this.http.post(this.apiUrl, newCuti);
  }

  updateCuti(id: string | null, updatedData: Cuti): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }

  deleteCuti(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
