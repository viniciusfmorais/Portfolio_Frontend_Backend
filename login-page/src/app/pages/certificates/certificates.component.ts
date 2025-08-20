import { Component, OnInit } from '@angular/core';
import { CertificateDTO, CertificatesService } from '../../services/certificate.services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpEventType } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { deleteCookie, getCookie } from '../../core/cookie.util';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit {
  rows: CertificateDTO[] = [];
  loading = true;
  error: string | null = null;

  // Upload state
  selectedFile: File | null = null;
  selectedDescription = '';  // user input
  uploading = false;
  uploadProgress = 0;

  constructor(private api: CertificatesService, private router: Router) {}

  ngOnInit(): void {
    this.setUserFromToken();
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.error = null;
    this.api.list().subscribe({
      next: (data) => { this.rows = data ?? []; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load certificates.'; this.loading = false; }
    });
  }

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.selectedFile = input.files && input.files[0] ? input.files[0] : null;
    // Optional: auto-suggest from filename if description is empty
    if (this.selectedFile && !this.selectedDescription) {
      this.selectedDescription = this.selectedFile.name.replace(/\.[^/.]+$/, '');
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;
    const desc = (this.selectedDescription || '').trim();
    if (!desc) { this.error = 'Please enter a description.'; return; } // simple required rule
    if (desc.length > 200) { this.error = 'Description too long (max 200 chars).'; return; }

    this.uploading = true;
    this.uploadProgress = 0;

    this.api.upload(this.selectedFile, desc).subscribe({
      next: evt => {
        if (evt.type === HttpEventType.UploadProgress && evt.total) {
          this.uploadProgress = Math.round((evt.loaded / evt.total) * 100);
        } else if (evt.type === HttpEventType.Response) {
          // Reset UI and refresh list
          this.uploading = false;
          this.selectedFile = null;
          this.selectedDescription = '';
          this.uploadProgress = 0;
          this.fetch();
        }
      },
      error: err => {
        this.uploading = false;
        this.error = err?.error?.error || err?.error?.message || 'Upload failed.';
      }
    });
  }

  // ====== Open/Download using Base64 -> Blob ======
  openOrDownload(r: CertificateDTO) {
    this.api.getFile(r.id).subscribe({
      next: (dto) => {
        if (!dto?.base64Content) { this.error = 'File content not available.'; return; }
        const blob = this.base64ToBlob(dto.base64Content, dto.contentType || 'application/octet-stream');
        const url = URL.createObjectURL(blob);

        if ((dto.contentType || '').startsWith('application/pdf') || (dto.contentType || '').startsWith('image/')) {
          window.open(url, '_blank');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = dto.fileName || `file_${dto.id}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      },
      error: () => this.error = 'Could not open the file.'
    });
  }

  private base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteArrays: Uint8Array[] = [];
  const chunkSize = 1024 * 64;

  for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
    const slice = byteCharacters.slice(offset, offset + chunkSize);
    const bytes = new Uint8Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      bytes[i] = slice.charCodeAt(i);
    }
    byteArrays.push(bytes);
  }

  // Cast to BlobPart[] so TypeScript accepts it
  return new Blob(byteArrays as BlobPart[], { type: contentType });
  }

  formatBytes(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  let s = size;
  while (s >= 1024 && i < units.length - 1) { s /= 1024; i++; }
  const decimals = s < 10 && i > 0 ? 1 : 0;
  return `${s.toFixed(decimals)} ${units[i]}`;
}

// Clear selected file and description if you want
clearFile(): void {
  this.selectedFile = null;
  // optionally keep or clear the description
  // this.selectedDescription = '';
}

  trackById = (_: number, r: CertificateDTO) => r.id;

  confirmAndDelete(r: CertificateDTO) {
  // Simple browser confirm; swap for a modal if you prefer
  const ok = window.confirm(`Do you really want to delete " ${r.fileName} " ? This action cannot be undone.`);
  if (!ok) return;

  this.api.delete(r.id).subscribe({
    next: () => {
      // Remove from the current list without refetching
      this.rows = this.rows.filter(x => x.id !== r.id);
    },
    error: (err) => {
      this.error = err?.error?.error || err?.error?.message || 'Failed to delete certificate.';
    }
  });
}


//LOGOUT

  userName: string | null = null;
  userEmail: string | null = null;

 
  /** Reads JWT from storage, decodes payload, and extracts username/email */
  private setUserFromToken(): void {
    const raw = getCookie('auth-token');
    if (!raw) return;
    const token = raw.replace(/^"(.+)"$/, '$1').replace(/^Bearer\s+/i, '');

    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return;
      // base64url -> base64
      const b64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(payloadPart.length / 4) * 4, '=');
      const payload = JSON.parse(atob(b64));

      // Common claim names — adjust if your token uses different keys
      this.userName =
        payload.username ||
        payload.preferred_username ||
        payload.name ||
        payload.sub || null;

      this.userEmail =
        payload.email ||
        getCookie('email')
        null;
    } catch {
      // ignore bad/expired token — interceptor/guard will handle redirect
    }
  }

  /** Clears credentials and goes back to login page */
  logout(): void {
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('email');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('email');
    deleteCookie('auth-token');
    deleteCookie('email');
    this.router.navigate(['/login']);
  }





}