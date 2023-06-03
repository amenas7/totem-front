import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

import { Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyRestService {

  private access_token: Subscription | undefined;

  constructor(
    private http: HttpClient
  ) { }

  ObtenerAccessToken(): Observable<any> {
    const body = new URLSearchParams();
    body.set("scope", "https://losportalesbtc.onmicrosoft.com/1d46e932-24d2-4aea-9f99-a44dd2beccf0/.default");
    body.set("grant_type", "client_credentials");
    body.set("client_id", "1d46e932-24d2-4aea-9f99-a44dd2beccf0");
    body.set("client_secret", "sgJ8Q~b7agH57u_rb1fWTQonlgR.-EMKhJh_vaSq");

    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Ocp-Apim-Subscription-Key': 'c821a325cb084e54ae703944a8fde361;product=middleware-hu'
      })
    };   
    return this.http.post(environment.urlApiBackend_Token, body, httpOptions);
  }


  ObtenerCasetaUsuario(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Ocp-Apim-Subscription-Key': 'c821a325cb084e54ae703944a8fde361;product=middleware-hu',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };

    return this.http.get<any>(environment.urlBack + "/api/Caseta/CasetaPermisoUsuario?codigoUsuario=Peru", httpOptions);
  }

  ObtenerVerificaDNI(data: any): Observable<any> {

    let dni_temp = "78129643";

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Ocp-Apim-Subscription-Key': 'c821a325cb084e54ae703944a8fde361;product=middleware-hu',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };

    return this.http.get<any>(environment.urlBack + `/api/Cliente/VerificaDNI?tipoDocumento=01&numeroDocumento=${dni_temp}`, httpOptions);
  }

  // ObtenerAccessToken(data: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json',
  //       'Authorization': 'Bearer ' + localStorage.getItem('token')
  //     })
  //   };   
  //   return this.http.post(environment.urlApiBackend_Token + "/api/Usuario/ActualizaUsuarioContrasena", data, httpOptions);
  // }


}
