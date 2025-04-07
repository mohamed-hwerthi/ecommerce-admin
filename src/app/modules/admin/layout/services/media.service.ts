import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Media } from 'src/app/core/models/media.model';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MediaService    extends BaseService {
  private readonly baseUrl = `${environment.apiUrl}/media`;
  constructor(http: HttpClient, router: Router, toastr: ToastrService) {
    super(http, router, toastr);
  }

  /**
   * Create a new media item
   */
  createMedia(media: Media): Observable<Media> {
    return this.post<Media>(this.baseUrl, media);
  }

  /**
   * Get a media item by ID
   */
  getMediaById(id: number): Observable<Media> {
    return this.get<Media>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get all media items
   */
  getAllMedia(): Observable<Media[]> {
    return this.get<Media[]>(this.baseUrl);
  }

  /**
   * Delete a media item by ID
   */
  deleteMedia(id: number): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Upload a media file
   */
  uploadFile(file: File): Observable<Media> {
    const formData = new FormData();
    formData.append('file', file);
    return this.post<Media>(`${this.baseUrl}/upload`, formData);
  }
}
