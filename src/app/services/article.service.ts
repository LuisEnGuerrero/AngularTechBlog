import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article';
import { Global } from './global';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  storageRef = firebase.app().storage().ref();

  public url!: string;

  constructor(
    private _http: HttpClient
  ) { 
    this.url = Global.url;
  }

  getArticles(last:any = null): Observable<any> {

    var articles = 'articles';

    if(last != null){
      articles = 'articles/true';
    }

    return this._http.get(this.url+'articles');
  }

  getArticle(articleId: string): Observable<any> {
    return this._http.get(this.url+'article/'+articleId);
  }

  search(searchString: string): Observable<any> {
    return this._http.get(this.url+'search/'+searchString);
  }

  create(article: Article): Observable<any> {
    let params = JSON.stringify(article);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url+'save', params, {headers: headers});
  }

  update(id: string, article: Article): Observable<any> {
    let params = JSON.stringify(article);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.put(this.url+'article/'+id, params, {headers: headers});
  }

  delete(id: string): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.delete(this.url+'article/'+id, {headers: headers});
  }

  async uploadImage(nombre: string, imgBase64: any){
    try{
      let response = await this.storageRef.child("articles/"+nombre).putString(imgBase64, 'data_url');
      return await response.ref.getDownloadURL();
    }catch(error){
      console.log(error);
      return null;
    }
  }
}
