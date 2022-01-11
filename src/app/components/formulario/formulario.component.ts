import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  public title = "";
  public user: any;

  constructor() {
    this.user = {
      nombre: '',
      correo: '',
      comentario: '',
      editar: ''
    };
   }

  ngOnInit(): void {
  }

  onSubmit(){
    alert("Formulario enviado!");
  }
}
