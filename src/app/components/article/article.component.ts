import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Global } from '../../services/global';
import Swal from 'sweetalert2';

import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
  providers: [ArticleService]
})
export class ArticleComponent implements OnInit {

  public article!: Article;
  public url!: string;

  constructor(
    private _articleService: ArticleService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { 
    this.url = Global.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      let id = params['id'];

      this._articleService.getArticle(id).subscribe(
        response => {
          if(response.article){
            this.article = response.article;
          }else{
            this._router.navigate(['/home']);
          }
        },
        error => {
          console.log(error);
          this._router.navigate(['/home']);
        }
      )

    });
    
  }

  delete(id: string | null){
    if( id != null){

      Swal.fire({
        title: "Está Seguro?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'SI',
        denyButtonText: 'No',
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
          denyButton: 'order-3',
        }
//        text: "Va a Eliminar el Artículo, esta acción no podrá deshacerse!",
    })
        .then((result) => {
          if (result.isConfirmed) {
                // Confirmamos si la petición viene del Administrador:
                const passwordAutorized = "AngularDesign";

                Swal.fire({
                  title: 'Ingrese su Contraseña',
                  input: 'password',
                  customClass: {
                    validationMessage: 'my-validation-message'
                  },
                  preConfirm: (value) => {
                    if (value === passwordAutorized) {
                      this._articleService.delete(id).subscribe(
                        response => {
                          Swal.fire('Artículo Eliminado!', '', 'success')
                          this._router.navigate(['/blog']);
                        },
                        error => {
                          console.log(error);
                        }
                      )
                  } else { //Si no es Administrador no podrá eliminar el artículo:
                      Swal.fire(
                        'Contraseña Incorrecta!!!',
                        'El Artículo continuará Publicado!',
                        'warning'
                      );
                  }}
                })
              } else if (result.isDenied) {
                Swal.fire('El Artículo continuará Publicado!!!', '', 'info')
        }});
  }}

}
