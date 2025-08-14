import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface CertificateDTO {
  id: number;
  fileName: string;
  contentType: string;
  description: string;
  uploadDate: string;        // ISO (LocalDateTime do Jackson)
  base64Content?: string;    //  /files/{id}
}

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  private apiUrl = 'http://localhost:8080';
  private baseUrl = '/api/certificates';

  constructor(private http: HttpClient) {}

  list(): Observable<CertificateDTO[]> {
    return this.http.get<CertificateDTO[]>(this.apiUrl + this.baseUrl).pipe(
      map(list => list ?? [])
    );
  }

  getFile(id: number): Observable<CertificateDTO> {
    return this.http.get<CertificateDTO>(`${this.apiUrl + this.baseUrl}/files/${id}`);
  }
}