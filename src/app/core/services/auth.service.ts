import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegisterRequest, RegisterResponse, RegisterWithGoogleRequest } from '../../features/auth/register';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }
  
  registerLocalUser(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.url}/register`, registerRequest);
  }

  registerGoogleUser(tokenId: RegisterWithGoogleRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.url}/google-register`,  tokenId );
  }

}
