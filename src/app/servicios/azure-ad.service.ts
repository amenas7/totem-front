import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

const GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0/me";

@Injectable({ providedIn: 'root' })
export class AzureAdService {
  isLogged: Subject<boolean> = new Subject<boolean>();

  
  constructor(
    private httpCliente: HttpClient
  ) {}

  getUserProfile(){
    return this.httpCliente.get<any>(GRAPH_ENDPOINT);
  }
}
