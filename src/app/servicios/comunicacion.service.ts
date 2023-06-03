import { Injectable, EventEmitter, Output } from '@angular/core';
import { ReplaySubject, Subject, BehaviorSubject, Observable  } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  //
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject({} as any);
  public readonly currentUser: Observable<any> = this.currentUserSubject.asObservable();

  setCurrentUser(currentUser: any): void {
    this.currentUserSubject.next(currentUser);
  }


  private currentdniSubject: BehaviorSubject<any> = new BehaviorSubject({} as any);
  public readonly currentUserDni: Observable<any> = this.currentdniSubject.asObservable();

  setCurrentUserDni(currentUserDni: any): void {
    this.currentdniSubject.next(currentUserDni);
  }


  // access token

  private currentTokenSubject: BehaviorSubject<any> = new BehaviorSubject({} as any);
  public readonly currentUserToken: Observable<any> = this.currentTokenSubject.asObservable();

  setCurrentUserToken(currentUserToken: any): void {
    this.currentTokenSubject.next(currentUserToken);
  }




  constructor() { }
}
