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

import { AzureAdService } from '../../servicios/azure-ad.service';
import { environment } from 'src/environments/environment';
import { ComunicacionService } from '../../servicios/comunicacion.service';

import Keyboard from "simple-keyboard";
import layout from "simple-keyboard-layouts/build/layouts/spanish";

import { Subscription } from "rxjs";
import { MyRestService } from 'src/app/servicios/my-rest.service';

@Component({
  selector: 'app-caseta-list',
  templateUrl: './caseta-list.component.html',
  styleUrls: ['./caseta-list.component.scss']
})
export class CasetaListComponent implements OnInit {

  @ViewChild('autoItems', { static: true }) public autoItems: any;

  bloqueado: boolean = true;
  isLogged: boolean = false;
  VerLoading: boolean = false;

  //teclado
  valueCaseta = "";
  keyboardCaseta: any;


  cities: any[] = [];
  casetas: any;
  casetas_array: any;

  selectedCity: any;
  filteredCountries: any;

  temporal:any;

  private userServiceSubscriptionToken: Subscription | undefined;

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

    this.VerLoading = true;

    this.azureAdService.isLogged.subscribe(
      x=>{
        console.log("valor...", x)
        this.isLogged = x;
      }
    );

    //recibiendo valor token del componente anterior
    this.userServiceSubscriptionToken = this.comunicacionService.currentUserToken.subscribe(
      currentToken => {
        
        // this.usuarioService.crearUsuario(data).subscribe(
        //   response => {  
        //     // if (response.exito){
        //     //   this.VerLoading=false;  
        //     //   this.router.navigate(['usuarios',{my_object: JSON.stringify("Se guardó el nuevo usuario correctamente.")}]);      
        //     // }else{
        //     //   this.VerLoading=false;  
        //     //   this.addSingle('warn', "Error:"+response.mensaje);
        //     // }        
        //     console.log("response...", response);         
        // });


      }
    );

    this.restApiService.ObtenerCasetaUsuario().subscribe(
      response => {  
        if(response.listaCasetas.length > 0){
          this.VerLoading = false;
          console.log("caseta :D", response);
          this.casetas_array = response.listaCasetas;     
        }
        //console.log(response.listaCasetas);
           
    },(errorServicio)=>{
      //console.log(errorServicio);
      console.log("uy", errorServicio);
      //this.mensajeError = errorServicio.error.error.message;
    });


    this.casetas = [
      {
        "listaCasetas": [
            {
                "codigoCaseta": "2",
                "nombreCaseta": "Magdalena",
                "codigoPlaza": "22",
                "nombrePlaza": "PARACAS",
                "urlEncuesta": ""
            },
            {
                "codigoCaseta": "3",
                "nombreCaseta": "Barranca",
                "codigoPlaza": "23",
                "nombrePlaza": "Magdalena Plaza",
                "urlEncuesta": ""
            }
        ],
        "listaMedioCaptacion": [
            {
                "codigoMedioCaptacion": "2",
                "nombreMedioCaptacion": "Latina TV"
            },
            {
                "codigoMedioCaptacion": "3",
                "nombreMedioCaptacion": "Panamericana TV"
            },
            {
                "codigoMedioCaptacion": "4",
                "nombreMedioCaptacion": "Facebook"
            },
            {
                "codigoMedioCaptacion": "5",
                "nombreMedioCaptacion": "Google"
            },
            {
                "codigoMedioCaptacion": "6",
                "nombreMedioCaptacion": "TV Exitosa"
            }
        ]
      }
    ];

    //this.VerLoading = false;
    //this.casetas_array = this.casetas[0].listaCasetas;
    //console.log("array...", this.casetas_array);


  }


  filterCountry(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.cities.length; i++) {
      let country = this.cities[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.filteredCountries = filtered;
  }

  //teclado
  ngAfterViewInit() {
    // this.keyboardCaseta = new Keyboard(".keyboard-texto-caseta",{
    //   onChange: input => this.onChangeCaseta(input),
    //   onKeyPress: button => this.onKeyPress(button),
    //   preventMouseDownDefault: true,
    //   //...layout,
    //   theme: 'simple-keyboard hg-theme-default hg-layout-default',
    //   layout: {
    //     default: [
    //       "q w e r t y u i o p {bksp}",
    //       "a s d f g h j k l ñ",
    //       "{shift} z x c v b n m",
    //       "{space}"
    //     ],
    //     shift: [
    //       "Q W E R T Y U I O P {bksp}",
    //       'A S D F G H J K L Ñ',
    //       "{shift} Z X C V B N M",
    //       "{space}"
    //     ]
    //   },
    //   display: {
    //     "{bksp}": "⌫ Borrar",
    //     "{shift}": "Bloq. mayús",
    //     "{space}": "Espacio",
    //   }
    // });
  }

  getSelectedItemName(item: { id: number; name: string }): string {
    return item.name;
  }

  onChangeCaseta = (input: any) => {
    this.valueCaseta = input;
  };

  onChange() {
    this.bloqueado = false;
  }

  onClear(){
    this.bloqueado = true;
  }

  onInputChangeCaseta = (event: any) => {
    this.keyboardCaseta.setInput(event.target.value);
  };

  onKeyPress(button: any) {
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  }

  handleShift = () => {
    let currentLayout = this.keyboardCaseta.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboardCaseta.setOptions({
      layoutName: shiftToggle
    });
  };


  seleccionar(){
    //enviando data del componente
    this.comunicacionService.setCurrentUser(this.selectedCity);
    this.router.navigate(['/caseta-user'])
  }

}
