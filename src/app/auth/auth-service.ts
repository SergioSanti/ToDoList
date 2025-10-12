import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_API = 'http://localhost:3000/api/login';
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type":"application/json"
    })
  }
  private http = inject(HttpClient);

  login(username: String, senha: String): Observable<boolean> {
    const user = {
      usuario: username,
      senha: senha
    };
    return this.http.post<any>(this.BASE_API, user, this.httpOptions).pipe(
      tap((resp: any) => {
        if(resp && resp.token) {
          sessionStorage.setItem("token", resp.token);
          return true;
        }
        else {
          return false;
        }
      }),
      catchError(error => of(false))
    );
  }

  estaLogado(): boolean {
    const token = sessionStorage.getItem("token");
    return token!=undefined && token!=null;
  }

}
