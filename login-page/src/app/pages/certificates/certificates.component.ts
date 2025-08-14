import { Component, OnInit } from '@angular/core';
import { CertificateDTO, CertificatesService } from '../../services/certificate.services';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit {
  rows: CertificateDTO[] = [];
  loading = true;
  error: string | null = null;

  constructor(private api: CertificatesService) {}

  ngOnInit(): void {
    this.api.list().subscribe({
      next: (data) => { this.rows = data; this.loading = false; },
      error: (err) => { this.error = err?.error?.message || 'Failed to load.'; this.loading = false; }
    });
  }

  trackById = (_: number, r: CertificateDTO) => r.id;



  openOrDownload(r: CertificateDTO) {
  this.api.getFile(r.id).subscribe({
    next: (dto) => {
      if (!dto?.base64Content) {
        this.error = 'File not found or no content available.';
        return;
      }
      const blob = this.base64ToBlob(dto.base64Content, dto.contentType || 'application/octet-stream');
      const url = URL.createObjectURL(blob);

      // If it's a PDF or image, open in a new tab
      if ((dto.contentType || '').startsWith('application/pdf') || (dto.contentType || '').startsWith('image/')) {
        // Open the new tab only after the blob is ready to avoid blank tab issues
        window.open(url, '_blank');
      } else {
        // Force download
        const a = document.createElement('a');
        a.href = url;
        a.download = dto.fileName || `arquivo_${dto.id}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }

      // liberar URL após alguns segundos (tempo para o navegador ler)
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    },
    error: () => this.error = 'Não foi possível abrir o arquivo.'
  });
}

  // util — converte Base64 -> Blob sem estourar a aba com data URL gigante
  private base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays: Uint8Array[] = [];
    const chunkSize = 1024 * 64; // 64 KB

    for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
      const slice = byteCharacters.slice(offset, offset + chunkSize);
      const bytes = new Uint8Array(slice.length);
      for (let i = 0; i < slice.length; i++) bytes[i] = slice.charCodeAt(i);
      byteArrays.push(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

 


  
}