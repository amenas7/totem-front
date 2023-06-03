import { Component, ViewChild, Inject, OnInit, OnDestroy } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


import { Subscription } from "rxjs";

import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';

import Swal from 'sweetalert2';

import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';

import { AzureAdService } from '../../servicios/azure-ad.service';
import { environment } from 'src/environments/environment';

import Keyboard from "simple-keyboard";
import { ComunicacionService } from '../../servicios/comunicacion.service';
import { MyRestService } from 'src/app/servicios/my-rest.service';

@Component({
  selector: 'app-caseta-user',
  templateUrl: './caseta-user.component.html',
  styleUrls: ['./caseta-user.component.scss']
})
export class CasetaUserComponent implements OnInit, OnDestroy {
  bloqueado: boolean = false;
  isLogged: boolean = false;
  VerLoading: boolean = false;

  

  tipos: any[] = [];

  selectedTipo: any;
  num_documento: any;

  //teclado
  value = "";
  keyboard: any;
  //

  //private countdownEndRef: Subscription = null;


  caseta: string = "";
  array_caseta: any;
  private userServiceSubscription: Subscription | undefined;

  constructor(
    public router: Router, 
    route: ActivatedRoute,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadCastService: MsalBroadcastService,
    private authService: MsalService,
    private azureAdService: AzureAdService,
    private comunicacionService: ComunicacionService,
    private restApiService: MyRestService
  ) { }

  ngOnInit(): void {

    this.azureAdService.isLogged.subscribe(
      x=>{
        console.log("valor...", x)
        this.isLogged = x;
      }
    );

    //recibiendo valores del componente anterior
    this.userServiceSubscription = this.comunicacionService.currentUser.subscribe(
      currentCaseta => {
        console.log("recibiendo...", currentCaseta);
        this.array_caseta = currentCaseta;
        this.caseta = currentCaseta?.nombreCaseta;
      }
    );

    this.tipos = [
      { name: 'DNI', code: '01' },
      { name: 'C.E.', code: '02' },
      { name: 'Pasaporte', code: '03' }
    ];

    
  }

  onChangeTipo() {
    //this.bloqueado = false;
  }

  onClearTipo(){
    //this.bloqueado = true;
  }

  ngOnDestroy(){
    this.userServiceSubscription?.unsubscribe();
  }

  //teclado
  ngAfterViewInit() {
    this.keyboard = new Keyboard(".keyboard1",{
      onChange: input => this.onChange(input),
      theme: "hg-theme-default hg-layout-default myTheme",
      layout: {
        default: [
          "1 2 3",
          "4 5 6",
          "7 8 9",
          "0 {bksp}",
        ]
      },
      display: {
        "{bksp}": "⌫ Borrar",
      }
    });
    
  }

  onChange = (input: string) => {
    this.value = input;
    this.num_documento = input;
  };


  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  //validar cantidad de caracteres de un objeto
  contarCaracteres(objeto: any) {
    var contador = 0;
  
    for (var propiedad in objeto) {
      if (objeto.hasOwnProperty(propiedad)) {
        contador += objeto[propiedad].toString().length;
      }
    }
  
    return contador;
  }

  regresar(){
    this.router.navigate(['/caseta-list'])
  }

  continuar(){

    // const data = {
    //   caseta: this.array_caseta,
    //   tipo: this.selectedTipo,
    //   num_documento: this.num_documento
    // };

    // this.comunicacionService.setCurrentUserDni(data);
    // this.router.navigate(['/caseta'])



    this.VerLoading = true;

      if(this.selectedTipo == undefined ||  this.selectedTipo == null)
    {
      this.VerLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Seleccione un tipo de documento',
        showConfirmButton: true,
        showCloseButton: false,
      });
      return;
    }

    if(this.num_documento == undefined ||  this.num_documento == null)
    {
      this.VerLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Ingrese un número de documento',
        showConfirmButton: true,
        showCloseButton: false,
      });
      return;
    }

    const data_service = {
      tipoDocumento: this.selectedTipo.code,
      numeroDocumento: this.num_documento
    }

    this.restApiService.ObtenerVerificaDNI(data_service).subscribe(
      response => {

        this.VerLoading = false;

        let cantidadCaracteres = this.contarCaracteres(response);
        
        if(cantidadCaracteres > 0){
          //enviando data del componente
          const data = {
            caseta: this.array_caseta,
            tipo: this.selectedTipo,
            num_documento: this.num_documento
          };

          this.comunicacionService.setCurrentUserDni(data);
          this.router.navigate(['/caseta'])
        }else{

          Swal.fire({
            icon: 'error',
            title: 'Revisé los datos ingresados',
            showConfirmButton: true,
            showCloseButton: false,
          });
        }
      
    });

    
  }


}
