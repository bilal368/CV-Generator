import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3006/api';

export interface CV {
  id?: number;
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: any[];
  education: any[];
  skills: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CvService {
  constructor(private http: HttpClient) {}

  getAllCVs(): Observable<CV[]> {
    return this.http.get<CV[]>(`${API_URL}/cvs`);
  }

  getCVById(id: number): Observable<CV> {
    return this.http.get<CV>(`${API_URL}/cv/${id}`);
  }

  createCV(cv: CV): Observable<any> {
    return this.http.post(`${API_URL}/cv`, cv);
  }

  updateCV(id: number, cv: CV): Observable<any> {
    return this.http.put(`${API_URL}/cv/${id}`, cv);
  }

  deleteCV(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/cv/${id}`);
  }

  generatePDF(id: number): void {
    window.open(`${API_URL}/cv/${id}/pdf`, '_blank');
  }
}
