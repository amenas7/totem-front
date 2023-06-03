import { Component, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';

import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';

import { AzureAdService } from './servicios/azure-ad.service';
import { environment } from 'src/environments/environment';
import { MyRestService } from './servicios/my-rest.service';
import { ComunicacionService } from './servicios/comunicacion.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'totem';
  VerLoading: boolean = false;
  //variables ofice 364
  isLogged: boolean = false;
  private readonly _destroy = new Subject<void>();
  userOffice: any;

  constructor(
    public router: Router, 
    route: ActivatedRoute,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadCastService: MsalBroadcastService,
    private authService: MsalService,
    private azureAdService: AzureAdService,
    private restApiService: MyRestService,
    private comunicacionService: ComunicacionService
  ){

  }

  ngOnInit(): void {
    //nuevo login con office 365
    this.msalBroadCastService.inProgress$
    .pipe(
      filter(
        (interactionStatus: InteractionStatus) =>
          interactionStatus == InteractionStatus.None
      ),
      takeUntil(this._destroy)
    )
    .subscribe((x) => {
      //trae datos de usuarios logeados
      this.isLogged = this.authService.instance.getAllAccounts().length > 0;

      //guardando variable en un servicio para luego compartirla entre componentes
      this.azureAdService.isLogged.next(this.isLogged);
      if(this.isLogged){

        this.azureAdService.getUserProfile()
          .subscribe(profileData => {
            this.userOffice = profileData?.displayName;
            //console.log("Perfil...", profileData);
        });


        this.restApiService.ObtenerAccessToken()
          .subscribe(token => {
            //this.userOffice = token?.displayName;
            console.log("token...", token);
        });

        //
        //enviando data del componente

        // this.comunicacionService.setCurrentUserToken("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIxZDQ2ZTkzMi0yNGQyLTRhZWEtOWY5OS1hNDRkZDJiZWNjZjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzA5OGY2YTYtMTBiYS00OTBjLTkwZGYtNjhkODBkNWFhMWQyL3YyLjAiLCJpYXQiOjE2ODQ5NzM5NjgsIm5iZiI6MTY4NDk3Mzk2OCwiZXhwIjoxNjg0OTc3ODY4LCJhaW8iOiJFMlpnWUxDK3lhVlptcEM4V1NLRFJhcjY5MEo3eHYxZTkvaGZ2UHJVTDVaZnV2cU0yQ1FBIiwiYXpwIjoiMWQ0NmU5MzItMjRkMi00YWVhLTlmOTktYTQ0ZGQyYmVjY2YwIiwiYXpwYWNyIjoiMSIsIm9pZCI6IjhkNGU2NzBmLThiODYtNDQ5My04MTAzLWQ2NmNkYWJjNjM5MCIsInJoIjoiMC5BUlVBcHZhWWNMb1FERW1RMzJqWURWcWgwakxwUmgzU0pPcEtuNW1rVGRLLXpQQVZBQUEuIiwic3ViIjoiOGQ0ZTY3MGYtOGI4Ni00NDkzLTgxMDMtZDY2Y2RhYmM2MzkwIiwidGlkIjoiNzA5OGY2YTYtMTBiYS00OTBjLTkwZGYtNjhkODBkNWFhMWQyIiwidXRpIjoiQ0FHY2RuVnoyMGU0a0U3em9yeFpBQSIsInZlciI6IjIuMCJ9.FuMZr1sYztXFftd_AVF1OXWT4AiaaGhJTYWGyMgZaHFO0kUHEcHFttVlfYAkr8ngwgqIuSnptTZFoXfap0yxgvkIufGSpSVPL_c6_jTYvKnFaKUFlEbCdIeB92L4YNplzXWrP9XvJ6PJUQbJo-wUVRI0dahzKJMam6OzEQ6sAVKYQ0PV26_Gvv9K-xoB_zQ2wmWTg7D24GfJtoW30kVtf485QYXC0LfVSYcOtkX0V3CgCHsapIoAW9274wxJHhXO4T6HGCaFqXuP6tK5QkY5e_8-WOXcoRAkDDzimnDMylFPVTm47onoT-Aa2053EFpRnI76N-fqZqM93MPHEDos_g");

        // localStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIxZDQ2ZTkzMi0yNGQyLTRhZWEtOWY5OS1hNDRkZDJiZWNjZjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzA5OGY2YTYtMTBiYS00OTBjLTkwZGYtNjhkODBkNWFhMWQyL3YyLjAiLCJpYXQiOjE2ODUxMTg3MjAsIm5iZiI6MTY4NTExODcyMCwiZXhwIjoxNjg1MTIyNjIwLCJhaW8iOiJFMlpnWUxBVGtjcm5OMzFlZTJyT1l6T2xDSzZsdjJaSzdGKzYyZG5WTml5cDJNYXA4UklBIiwiYXpwIjoiMWQ0NmU5MzItMjRkMi00YWVhLTlmOTktYTQ0ZGQyYmVjY2YwIiwiYXpwYWNyIjoiMSIsIm9pZCI6IjhkNGU2NzBmLThiODYtNDQ5My04MTAzLWQ2NmNkYWJjNjM5MCIsInJoIjoiMC5BUlVBcHZhWWNMb1FERW1RMzJqWURWcWgwakxwUmgzU0pPcEtuNW1rVGRLLXpQQVZBQUEuIiwic3ViIjoiOGQ0ZTY3MGYtOGI4Ni00NDkzLTgxMDMtZDY2Y2RhYmM2MzkwIiwidGlkIjoiNzA5OGY2YTYtMTBiYS00OTBjLTkwZGYtNjhkODBkNWFhMWQyIiwidXRpIjoicEJtajMxYy01MHE4MFNheVhYT0RBQSIsInZlciI6IjIuMCJ9.e9ZkZ2iulIyguL94jIkmuoh4bzalsOuHnQnd4YHXzW-rt7-TbVLrDBl-Qj2_aIBJ6qmZqO1IvTe5yZ8g8lTvCJDspeBpFzlx7OzonlVm8BDqbdy1gnIJp0CzSLzYeuiM1ILkwZWT0qwDRgo9pTHCWU90TGlqZouXMp-o7ZMdI_txLR9XeXghdgr6hzBH4Vb0SbpJFdUTNjlbhIwHIYTS5_SmzucmQfPEGUDPeLFb_vxOMy103V7B1iAKPchjkSbJGs8PWjjy7D_LJiSAGaRYgsXmtgnSIP5yn977wb1ok6Vmi8V0tpPeHR5xVF43GfXgubMSPWREZ0Sq_SAUT3hrdQ");

        localStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ii1LSTNROW5OUjdiUm9meG1lWm9YcWJIWkdldyJ9.eyJhdWQiOiIxZDQ2ZTkzMi0yNGQyLTRhZWEtOWY5OS1hNDRkZDJiZWNjZjAiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzA5OGY2YTYtMTBiYS00OTBjLTkwZGYtNjhkODBkNWFhMWQyL3YyLjAiLCJpYXQiOjE2ODU1OTA2NDIsIm5iZiI6MTY4NTU5MDY0MiwiZXhwIjoxNjg1NTk0NTQyLCJhaW8iOiJBU1FBMi84VEFBQUE3YTFZYnZzdkJaYlVVNjcweUM3b1k3dWU5TDk1RTJkTjJBTzFlQ3dyZEFrPSIsImF6cCI6IjFkNDZlOTMyLTI0ZDItNGFlYS05Zjk5LWE0NGRkMmJlY2NmMCIsImF6cGFjciI6IjEiLCJvaWQiOiI4ZDRlNjcwZi04Yjg2LTQ0OTMtODEwMy1kNjZjZGFiYzYzOTAiLCJyaCI6IjAuQVJVQXB2YVljTG9RREVtUTMyallEVnFoMGpMcFJoM1NKT3BLbjVta1RkSy16UEFWQUFBLiIsInN1YiI6IjhkNGU2NzBmLThiODYtNDQ5My04MTAzLWQ2NmNkYWJjNjM5MCIsInRpZCI6IjcwOThmNmE2LTEwYmEtNDkwYy05MGRmLTY4ZDgwZDVhYTFkMiIsInV0aSI6IlZjajl0bDFXLWtTNFBza2w0VVFTQUEiLCJ2ZXIiOiIyLjAifQ.VjQP4L_H2Y0N3vDrAFkpNsqtZE-GdMqLr9VgL6h8jPh8oJNpkjlt2RLCZW05QRGNynkit5FKGSfyudhIIOsVGOEaIFl996Vi94cPilP5ANcNbID9_4uMagIiStfJI7jzoJakGyLPK0q6pbkRtyQ6fk5Ybf4Zq4Pxv6aVWXt2EjkMpvH2cNEA4O8p5X2JoMghV50xALdoVY2vE74iQN7_-H0vq8QmiEMObzT39wSTdHNT6ax_mm7sPV9p7k4sGgXC8VetKzbVl8HWPyIoYEIUsHyM_UtRwJa5x0gfQu4eJrgvYo7z_TG_xh8IFZBdxfnLQeNzm1xAXSehrKYIDXxHIA");



        this.router.navigate(['/caseta-list'])

        
      }

    });


    

  }

  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }

  login(){
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  };


  salir(){
    this.authService.logoutRedirect({ postLogoutRedirectUri: environment.postLogoutUrl })
  }

  inicio(){
    this.router.navigate(['/caseta-list'])
  }

  perfil(){
    this.router.navigate(['/profile'])
  }


}
