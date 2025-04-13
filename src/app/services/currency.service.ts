import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { CurrencyDTO } from '../core/models/currency.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService extends BaseService {
  private readonly baseUrl = `${environment.apiUrl}/currency`;

  constructor(http: HttpClient, router: Router,toastr: ToastrService) { 
    super(http, router,toastr)
  }

  findAllCurrencies(): Observable<CurrencyDTO[]> {
    return this.get<CurrencyDTO[]>(this.baseUrl);
  }
}
