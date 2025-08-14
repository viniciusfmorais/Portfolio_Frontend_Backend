import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, Observable} from 'rxjs';


export interface CertificateDTO {
  id: number;
  fileName: string;
  contentType: string;
  description: string;
  uploadDate: string;
  ownerUsername?: string;        // ISO (LocalDateTime do Jackson)
  base64Content?: string;    //  /files/{id}
  
}

@Injectable({ providedIn: 'root' })
export class CertificatesService {
  
  private baseUrl = 'http://localhost:8080/api/certificates';

  constructor(private http: HttpClient) {}

  list(): Observable<CertificateDTO[]> {
    return this.http.get<CertificateDTO[]>(this.baseUrl).pipe(
      map(list => list ?? []) 
      
    );
  }

  getFile(id: number): Observable<CertificateDTO> {
    return this.http.get<CertificateDTO>(`${this.baseUrl}/files/${id}`);
  }

  /** Uploads a single file using form-data with the key "file". */
  upload(file: File, description: string): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file); // backend expects "file"
    form.append('description', description); // Append description if needed, otherwise remove this line
    // If you later add description on server, also append it here

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, form, {
      reportProgress: true, // enables upload progress events
    });
    return this.http.request(req);
  }

  delete(id: number) {
  // Returns 204 No Content on success
  return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
}

}