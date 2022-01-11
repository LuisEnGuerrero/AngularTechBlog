import { Component, OnInit } from '@angular/core';
import { Article } from '../../models/article';
import { ArticleService } from '../../services/article.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Global } from '../../services/global';


@Component({
  selector: 'app-article-edit',
  templateUrl: '../article-new/article-new.component.html',
  styleUrls: ['./article-edit.component.css'],
  providers: [ArticleService]
})
export class ArticleEditComponent implements OnInit {
  public article!: Article;
  public status!: string;
  public isEdit!: boolean;
  public page_title: string;
  public url!: string;

  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.gif,.jpeg",
    maxSize: 50,
    uploadAPI: {
      url: Global.url + 'upload-image/'
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: false,
    fileNameIndex: true,
    autoUpload: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Sube una imágen para tu Artículo . . . ',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
  };


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _articleService: ArticleService
  ) {
    this.article = {
      _id: '',
      title: '',
      content: '',
      image: '',
      date: null
    };
    this.isEdit = true;
    this.page_title = 'Editar Artículo.';
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.getArticle();
  }

  onSubmit() {
    if (this.article._id != null){
    this._articleService.update(this.article._id, this.article).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = 'success';
          this.article = response.article;

          //Alerta de confirmación de exito:
          Swal.fire(
            'Articulo Editado!!!',
            'El artículo se ha editado correctamente!!!',
            'success'
          );

          this._router.navigate(['/blog/articulo/', this.article._id]);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
        this.status = 'error';
        Swal.fire(
          'Articulo NO Editado!!!',
          'El artículo NO se ha editado correctamente!!!',
          'error'
        );

      }
    );
  }}

  imageUpload(data: any){
    let image_data = JSON.parse(data.response);
    this.article.image = image_data.image;
  }

  cargarImg(event: any){
    let image = event.target.files[0];
    let reader = new FileReader();

    reader.readAsDataURL(image);
    reader.onloadend = () => {
      console.log(reader.result);
      this._articleService.uploadImage('file'+ Date.now(), reader.result).then(urlImage => {
        console.log(urlImage);
        if (urlImage != null){
            this.article.image = urlImage;
          }
      });
    }
  }


  getArticle(){
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
        }
      )

    });

  }

}
