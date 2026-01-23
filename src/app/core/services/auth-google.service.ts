// google-auth.service.ts
import { Injectable, signal } from '@angular/core';

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {

  loginWithGoogle(callback: (token: string) => void) {
    google.accounts.id.initialize({
      client_id: '408390006930-hj4sfjg9m2lbkr3met53uesuop1q71vn.apps.googleusercontent.com',
      callback: (response: any) => {
        callback(response.credential); // ID TOKEN
      }
    });

    google.accounts.id.prompt();
  }
}
