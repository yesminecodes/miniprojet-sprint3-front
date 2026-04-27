import { Routes } from '@angular/router';
import { Games } from './games/games';
import { AddGame } from './add-game/add-game';
import { UpdateGame } from './update-game/update-game';
import { RechercheParType } from './recherche-par-type/recherche-par-type';
import { RechercheParNom } from './recherche-par-nom/recherche-par-nom';
import { Login } from './login/login';
import { Forbidden } from './forbidden/forbidden';
import { gameGuard } from './game-guard';
import { authGuard } from './auth.guard';
import { ListeType } from './liste-type/liste-type';
import { Logout } from './logout/logout';
import { Register } from './register/register';
import { VerifEmail } from './verif-email/verif-email';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'verifEmail/:email', component: VerifEmail },
  { path: 'app-forbidden', component: Forbidden },
  { path: 'logout', component: Logout },
  { path: 'games', component: Games, canActivate: [authGuard] },
  { path: 'rechercheParType', component: RechercheParType, canActivate: [authGuard] },
  { path: 'rechercheParNom', component: RechercheParNom, canActivate: [authGuard] },
  { path: 'updateGame/:id', component: UpdateGame, canActivate: [authGuard] },
  { path: 'add-game', component: AddGame, canActivate: [authGuard, gameGuard] },
  { path: 'listeTypes', component: ListeType, canActivate: [authGuard, gameGuard] },
  { path: '', redirectTo: 'games', pathMatch: 'full' },
];