import { Component, ViewChild, Inject, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

import { ToastrService } from 'ngx-toastr';

import {
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
  MsalGuardConfiguration,
  MsalService,
} from '@azure/msal-angular';

import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';

import { AzureAdService } from '../../servicios/azure-ad.service';
import { environment } from 'src/environments/environment';

import Keyboard from "simple-keyboard";
import layout from "simple-keyboard-layouts/build/layouts/spanish";
import { ComunicacionService } from 'src/app/servicios/comunicacion.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import * as intlTelInput from "intl-tel-input";

declare var window: any;

import Swal from 'sweetalert2';

@Component({
  selector: 'app-caseta',
  templateUrl: './caseta.component.html',
  styleUrls: ['./caseta.component.scss']
})
export class CasetaComponent implements OnInit, OnDestroy {

  //firma canvas
  //obteniendo referencia del div
  @ViewChild('imageCanvas') canvas: any;

  canvasElement: any;
  saveX: any;
  saveY: any;

  xAnterior: any = 0;
  yAnterior: any = 0;
  xActual: any = 0;
  yActual: any = 0;

  obtenerXReal: any;
  obtenerYReal: any;

  canvasEl: any;
  haComenzadoDibujo: boolean = false;

  public width: any = 240;
  public height: number = 240;

  contexto: any;

  //


  isLogged: boolean = false;
  VerLoading: boolean = false;

  terminos:boolean = false;
  caseta: any;
  tipo_documento: any;
  num_documento: any;

  telefono_codigo: any;

  tipo_email: any[] = [];
  selectedTipoEmail: any;

  tipo_telefono: any[] = [];
  selectedTipoTelefono: any;

  private userServiceSubscription: Subscription | undefined;

  formModal: any;

  //teclado
  valuenombres = "";
  valueApaterno = "";
  valueAmaterno = "";
  valueEmail = "";
  valueTelefono = "";
  valuePin = "";

  input: any;
  codigo_telefono_pin: any;
  iti: any;

  keyboardNombres: any;
  keyboardApaterno: any;
  keyboardAmaterno: any;
  keyboardEmail: any;
  keyboardTelefono: any;
  keyboardPin: any;
  tipoTeclado: any = 1;
  show: boolean = false;

  //

  tipoFormulario: any = 1;

  constructor(
    public router: Router, 
    route: ActivatedRoute,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadCastService: MsalBroadcastService,
    private authService: MsalService,
    private azureAdService: AzureAdService,
    private comunicacionService: ComunicacionService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.azureAdService.isLogged.subscribe(
      x=>{
        console.log("valor...", x)
        this.isLogged = x;
      }
    );

    //modal
    this.formModal = new window.bootstrap.Modal(
      document.getElementById('myModal')
    );

    //recibiendo valores del componente anterior
    this.userServiceSubscription = this.comunicacionService.currentUserDni.subscribe(
      currentUserDni => {
        console.log("recibiendo con dni...", currentUserDni);
        this.tipo_documento = currentUserDni?.tipo?.name;
        this.num_documento = currentUserDni?.num_documento;
        this.caseta = currentUserDni?.caseta.nombreCaseta;
      }
    );

    this.tipo_email = [
      {
        id: 1,
        name: "@hotmail"
      },
      {
        id: 2,
        name: "@outlook.com"
      },
      {
        id: 3,
        name: "@outlook.es"
      },
      {
        id: 4,
        name: "@gmail.com"
      },
      {
        id: 5,
        name: "@yahoo.com"
      },
      {
        id: 6,
        name: "@yahoo.es"
      },
      {
        id: 7,
        name: "Otro"
      }
    ];


    this.tipo_telefono = [
      {
        id: 1,
        name: "Casa"
      },
      {
        id: 2,
        name: "Trabajo"
      },
      {
        id: 3,
        name: "Otros"
      }
    ];

  }


  ngOnDestroy(){
    this.userServiceSubscription?.unsubscribe();
  }

  openFormModal() {
    this.formModal.show();
  }
  saveSomeThing() {
    // confirm or save something
    this.formModal.hide();
  }

  //teclado
  ngAfterViewInit() {

    this.render();

    this.input = document.getElementById("phone");

    //if(input) {
      this.iti = intlTelInput(this.input, {
        initialCountry: 'PE',
        separateDialCode: true,
        nationalMode: true,
        formatOnDisplay: false,
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js',
        customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
          return "";
        },
      });

      this.codigo_telefono_pin = this.iti.getSelectedCountryData().dialCode;

      this.keyboardNombres = new Keyboard(".keyboard-texto-nombres",{
      onChange: input => this.onChangeNombres(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: true,
      //...layout,
      theme: 'simple-keyboard hg-theme-default hg-layout-default',
      layout: {
        default: [
          "q w e r t y u i o p {bksp}",
          "a s d f g h j k l ñ",
          "{shift} z x c v b n m",
          "{space}"
        ],
        shift: [
          "Q W E R T Y U I O P {bksp}",
          'A S D F G H J K L Ñ',
          "{shift} Z X C V B N M",
          "{space}"
        ]
      },
      display: {
        "{bksp}": "⌫ Borrar",
        "{shift}": "Bloq. mayús",
        "{space}": "Espacio",
      }
    });

    this.keyboardApaterno = new Keyboard(".keyboard-texto-apaterno",{
      onChange: input => this.onChangeApaterno(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: true,
      //...layout,
      theme: 'simple-keyboard hg-theme-default hg-layout-default',
      layout: {
        default: [
          "q w e r t y u i o p {bksp}",
          "a s d f g h j k l ñ",
          "{shift} z x c v b n m",
          "{space}"
        ],
        shift: [
          "Q W E R T Y U I O P {bksp}",
          'A S D F G H J K L Ñ',
          "{shift} Z X C V B N M",
          "{space}"
        ]
      },
      display: {
        "{bksp}": "⌫ Borrar",
        "{shift}": "Bloq. mayús",
        "{space}": "Espacio",
      }
    });

    this.keyboardAmaterno = new Keyboard(".keyboard-texto-amaterno",{
      onChange: input => this.onChangeAmaterno(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: true,
      //...layout,
      theme: 'simple-keyboard hg-theme-default hg-layout-default',
      layout: {
        default: [
          "q w e r t y u i o p {bksp}",
          "a s d f g h j k l ñ",
          "{shift} z x c v b n m",
          "{space}"
        ],
        shift: [
          "Q W E R T Y U I O P {bksp}",
          'A S D F G H J K L Ñ',
          "{shift} Z X C V B N M",
          "{space}"
        ]
      },
      display: {
        "{bksp}": "⌫ Borrar",
        "{shift}": "Bloq. mayús",
        "{space}": "Espacio",
      }
    });

    this.keyboardEmail = new Keyboard(".keyboard-texto-email",{
      onChange: input => this.onChangeEmail(input),
      onKeyPress: button => this.onKeyPressEmail(button),
      preventMouseDownDefault: true,
      //...layout,
      theme: 'simple-keyboard hg-theme-default hg-layout-default',
      layout: {
        default: [
          "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
          "q w e r t y u i o p [ ] \\",
          "a s d f g h j k l ñ ; '",
          "{shift} z x c v b n m , . /",
          "{space}"
        ],
        shift: [
          "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
          "Q W E R T Y U I O P { } |",
          'A S D F G H J K L Ñ : "',
          "{shift} Z X C V B N M < > ?",
          "{space}"
        ]
      },
      display: {
        "{bksp}": "⌫ Borrar",
        "{shift}": "Bloq. mayús",
        "{space}": "Espacio",
      }
    });

    this.keyboardTelefono = new Keyboard(".keyboard-texto-telefono",{
      onChange: input => this.onChangeTelefono(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: true,
      //...layout,
      theme: 'simple-keyboard hg-theme-default hg-layout-default',
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

    this.keyboardPin = new Keyboard(".keyboard-pin",{
      onChange: input => this.onChangePin(input),
      onKeyPress: button => this.onKeyPress(button),
      preventMouseDownDefault: true,
      theme: 'simple-keyboard hg-theme-default hg-layout-default',
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

  startDrawing(ev: any){
    ev.preventDefault();
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    this.saveX = ev.touches[0].pageX - canvasPosition.x;
    this.saveY = ev.touches[0].pageY - canvasPosition.y;
    
  }

  moved(ev: any){
    ev.preventDefault();
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    let ctx = this.canvasElement.getContext('2d');
    let currentX = ev.touches[0].pageX - canvasPosition.x;
    let currentY = ev.touches[0].pageY - canvasPosition.y;

    ctx.lineJoin = 'round';
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(this.saveX, this.saveY);
    ctx.lineTo(currentX, currentY);
    ctx.closePath();

    ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
  }

  render(){

    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;


    this.canvasEl = this.canvas.nativeElement;
    this.contexto  = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;

    this.contexto.lineWidth = 3;
    this.contexto.lineCap = 'round';
    this.contexto.strokeStyle = '#000';

    this.obtenerXReal = (clientX: any) => clientX - this.canvasEl.getBoundingClientRect().left;
    this.obtenerYReal = (clientY: any) => clientY - this.canvasEl.getBoundingClientRect().top;
  }

  //======================================================================
  // EVENTOS
  //======================================================================

  //Eventos mouse
  MouseDown(evento: any){
    this.xAnterior = this.xActual;
    this.yAnterior = this.yActual;

    this.xActual = this.obtenerXReal(evento.clientX);
    this.yActual = this.obtenerYReal(evento.clientY);

    this.contexto.beginPath();
    this.contexto.fillStyle = "black";
    this.contexto.fillRect(this.xActual, this.yActual, 2, 2);
    this.contexto.closePath();
    this.haComenzadoDibujo = true;
  }

  MouseMove(evento: any){
    if (!this.haComenzadoDibujo) {
      return;
    }

    // El mouse se está moviendo y el usuario está presionando el botón, así que dibujamos la firma
    this.xAnterior = this.xActual;
    this.yAnterior = this.yActual;
    this.xActual = this.obtenerXReal(evento.clientX);
    this.yActual = this.obtenerYReal(evento.clientY);
    this.contexto.beginPath();
    this.contexto.moveTo(this.xAnterior, this.yAnterior);
    this.contexto.lineTo(this.xActual, this.yActual);
    this.contexto.strokeStyle = "black";
    this.contexto.lineWidth = 2;
    this.contexto.stroke();
    this.contexto.closePath();
  }

  MouseUp(evento: any){
    this.haComenzadoDibujo = false;
  }

  MouseOut(evento: any){
    this.haComenzadoDibujo = false;
  }

  generarUrl(){
    let dataUrl = this.canvasElement.toDataURL();
    
    this.toastr.success('Firma guardada');

  }

  clearZone(){
    this.contexto.fillStyle = "white";
    this.contexto.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);

    this.contexto.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.toastr.info('Firma Eliminada');
  }

  enviarPIN(){
    this.VerLoading = true;
    let codigo = "123456";

    setTimeout( () => {
      
      Swal.fire({
        iconHtml: '<i class="fa-solid fa-mobile-screen-button fa-bounce"></i>',
        title: `PIN generado: ${codigo}`,
        showConfirmButton: true,
        showCloseButton: false,
      }); 

      this.VerLoading = false;

    },2000);

    
  }

  onChangeNombres = (input: any) => {
    this.valuenombres = input;
  };

  onChangeApaterno = (input: any) => {
    this.valueApaterno = input;
  };

  onChangeAmaterno = (input: any) => {
    this.valueAmaterno = input;
  };

  onChangeEmail = (input: any) => {
    this.valueEmail = input;
  };

  onChangeTelefono = (input: any) => {
    this.valueTelefono = input;
    this.telefono_codigo = this.valueTelefono;
  };

  onChangePin = (input: any) => {
    this.valuePin = input;
  };








  onKeyPress(button: any) {
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  }

  onKeyPressEmail(button: any) {
    if (button === "{shift}" || button === "{lock}") this.handleShiftEmail();
  }


  handleShift = () => {
    let currentLayout = this.keyboardNombres.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboardNombres.setOptions({
      layoutName: shiftToggle
    });
  };

  handleShiftEmail = () => {
    let currentLayout = this.keyboardEmail.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboardEmail.setOptions({
      layoutName: shiftToggle
    });
  };

 


  onInputChangeNombres = (event: any) => {
    this.keyboardNombres.setInput(event.target.value);
  };

  onInputChangeApaterno = (event: any) => {
    this.keyboardApaterno.setInput(event.target.value);
  };

  onInputChangeAmaterno = (event: any) => {
    this.keyboardAmaterno.setInput(event.target.value);
  };

  onInputChangeEmail = (event: any) => {
    this.keyboardEmail.setInput(event.target.value);
  };

  onInputChangeTelefono = (event: any) => {
    this.keyboardTelefono.setInput(event.target.value);
  };

  onInputChangePIN = (event: any) => {
    this.keyboardPin.setInput(event.target.value);
  };


  //
  onCheckboxChange(e:any) {  
    if (e.target.checked) {
      console.log("true");
    } else {
      console.log("false");
    }
  }


  continuar_a_captacion(){
    const data = {
      terminos: this.terminos,
      telefono: this.telefono_codigo
    };

    console.log("codigo_telefono_pin...", this.codigo_telefono_pin);

    console.log("data...", data);

    //this.router.navigate(['/caseta-captacion'])
    this.tipoFormulario = 2;
    console.log("valor actual...", this.tipoFormulario);
  }

  regresar_usuario(){
    this.router.navigate(['/caseta-user'])
  }

  regresar_datos_personales(){
    this.tipoFormulario = 1;
  }

  continuar_final(){
    this.tipoFormulario = 3;
  }

  regresar_captacion(){
    this.tipoFormulario = 2;
  }

  enviando_final(){
    const data = {
      //terminos: this.terminos
    };

    console.log("data...", data);

    Swal.fire({
      icon: 'success',
      title: 'Registro exitoso',
      showConfirmButton: true,
      showCloseButton: false,
    });

    this.router.navigate(['/caseta-list'])
  }




  focusMostrarKeyboard(valor: any){
    console.log(valor);
    if(valor == 'nombres'){
      this.tipoTeclado = 1;
    }
    else if (valor == 'apaterno'){
      this.tipoTeclado = 2;
    }
    else if (valor == 'amaterno'){
      this.tipoTeclado = 3;
    }

    else if (valor == 'email'){
      this.tipoTeclado = 4;
    }

    else if (valor == 'telefono'){
      this.tipoTeclado = 5;
      this.codigo_telefono_pin = this.iti.getSelectedCountryData().dialCode;
    }

    else if (valor == 'pin'){
      this.tipoTeclado = 6;
    }


  }

}
