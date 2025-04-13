import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Timbre } from '../core/models/timbre.model';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { PaginatedResponseDTO } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class TimbreService extends BaseService {
  private readonly baseUrl = `${environment.apiUrl}/timbres`;
  private readonly timbreCreatedSource = new BehaviorSubject<Timbre | null>(null);
  private readonly timbreUpdatedSource = new BehaviorSubject<Timbre | null>(null);
  private readonly timbreDeletedSource = new BehaviorSubject<number | null>(null);

  timbreCreated$ = this.timbreCreatedSource.asObservable();
  timbreUpdated$ = this.timbreUpdatedSource.asObservable();
  timbreDeleted$ = this.timbreDeletedSource.asObservable();

  constructor(http: HttpClient, router: Router, toastr: ToastrService) {
    super(http, router, toastr);
  }

  notifyTimbreCreated(timbre: Timbre) {
    this.timbreCreatedSource.next(timbre);
  }

  notifyTimbreUpdated(timbre: Timbre) {
    this.timbreUpdatedSource.next(timbre);
  }

  notifyTimbreDeleted(timbreId: number | null) {
    this.timbreDeletedSource.next(timbreId);
  }

  findAllTimbres(): Observable<Timbre[]> {
    return this.get<Timbre[]>(this.baseUrl);
  }

  findAllTimbresWithPagination(page: number, limit: number): Observable<PaginatedResponseDTO<Timbre>> {
    return this.get<PaginatedResponseDTO<Timbre>>(`${this.baseUrl}/pageable?page=${page}&limit=${limit}`);
  }

  findTimbreById(id: number): Observable<Timbre> {
    return this.get<Timbre>(`${this.baseUrl}/${id}`);
  }

  createTimbre(timbre: Timbre): Observable<Timbre> {
    return this.post<Timbre>(this.baseUrl, timbre).pipe(tap((result: Timbre) => this.notifyTimbreCreated(result)));
  }

  updateTimbre(id: number, timbre: Timbre): Observable<Timbre> {
    return this.put<Timbre>(`${this.baseUrl}/${id}`, timbre).pipe(
      tap((result: Timbre) => this.notifyTimbreUpdated(result)),
    );
  }

  deleteTimbre(id: number): Observable<void> {
    return this.delete<void>(`${this.baseUrl}/${id}`).pipe(tap(() => this.notifyTimbreDeleted(id)));
  }
}
