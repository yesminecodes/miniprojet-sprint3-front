import { Injectable } from '@angular/core';
import { Game } from '../model/game.model';
import { Type } from '../model/type.model';
import { TypeWrapper } from '../model/typeWrapped.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Image } from '../model/image.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  apiURL: string = 'http://localhost:8090/games/api';
  apiURLType: string = 'http://localhost:8090/games/type';

  constructor(private http: HttpClient) {}

  listeGame(): Observable<Game[]> {
    return this.http.get<Game[]>(this.apiURL + '/all');
  }

  ajouterGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.apiURL + '/addgame', game);
  }

  consulterGame(id: number): Observable<Game> {
    return this.http.get<Game>(this.apiURL + '/getbyid/' + id);
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(this.apiURL + '/updategame/' + game.idGame, game);
  }

  supprimerGame(id: number) {
    return this.http.delete(this.apiURL + '/delgame/' + id);
  }

  listeTypes(): Observable<TypeWrapper> {
    return this.http.get<TypeWrapper>(this.apiURLType);
  }

  addType(t: Type): Observable<Type> {
    return this.http.post<Type>(this.apiURLType, t);
  }

  updateType(t: Type): Observable<Type> {
    return this.http.put<Type>(this.apiURLType + '/' + t.idType, t);
  }

  consulterType(id: number, types: Type[]): Type | undefined {
    return types.find((type) => type.idType === id);
  }

  rechercherParType(idType: number): Observable<Game[]> {
    return this.http
      .get<Game[]>(this.apiURL + '/all')
      .pipe(map((allGames) => allGames.filter((g) => g.type?.idType === idType)));
  }

  uploadImage(file: File, filename: string): Observable<Image> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<Image>(`${this.apiURL}/image/upload`, formData);
  }

  uploadImageGame(file: File, idGame: number): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);

  return this.http.post(
    `${this.apiURL}/image/uploadImageGame/${idGame}`,
    formData
  );
}

  getImagesGame(idGame: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiURL}/image/getImagesGame/${idGame}`);
  }

  loadImage(id: number): Observable<Image> {
    return this.http.get<Image>(`${this.apiURL}/image/get/info/${id}`);
  }

  supprimerImage(id: number) {
    return this.http.delete(`${this.apiURL}/image/delete/${id}`);
  }

  uploadImageFS(file: File, idGame: number): Observable<any> {
  const formData = new FormData();
  formData.append('image', file);

  return this.http.post(
    `${this.apiURL}/image/uploadFS/${idGame}`,
    formData
  );
}
}