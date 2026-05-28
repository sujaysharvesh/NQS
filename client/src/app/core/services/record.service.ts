import { Injectable }       from '@angular/core';
import { HttpClient, HttpHeaders }       from '@angular/common/http';
import { Observable }       from 'rxjs';
import { RecordsResponse, CreateRecordRequest}  from '../models/record.model';
import { environment } from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class RecordService {

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getRecords(): Observable<RecordsResponse> {

    const token = localStorage.getItem('auth_token');

    const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

    return this.http.get<RecordsResponse>(`${environment.apiUrl}/records`, { headers: this.getHeaders() });
  }

  getAllRecords(): Observable<RecordsResponse> {

    return this.http.get<RecordsResponse>(`${environment.apiUrl}/records/all`, { headers: this.getHeaders() }); 
  }

  createRecord(payload: CreateRecordRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/records`, payload, { headers: this.getHeaders() });
  }

  deleteRecord(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/records/${id}`, { headers: this.getHeaders() });
  }

}