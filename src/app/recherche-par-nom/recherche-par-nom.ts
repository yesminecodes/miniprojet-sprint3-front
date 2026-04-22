import { Component, OnInit } from '@angular/core';
import { Game } from '../model/game.model';
import { GameService } from '../services/game.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilterPipe } from '../search-filter-pipe';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-recherche-par-nom',
  imports: [DatePipe, FormsModule,CommonModule,RouterLink],
  templateUrl: './recherche-par-nom.html',
  styles: ``
})
export class RechercheParNom implements OnInit {
  nomGame!: string;
  games!: Game[];
  allgames!: Game[];
  searchTerm!: string;
  IdType!: number;
  constructor(private gameService: GameService,public authService: AuthService) { }
   ngOnInit(): void {
    this.gameService.listeGame().subscribe(games => {
      this.allgames = games;
      this.games = games;
    });
  }
  onKeyUp(filterText: string) {
    this.games = this.allgames.filter(item => item.nomGame?.toLowerCase().includes(filterText));
  }
 supprimerGame(g: Game) {
  let conf = confirm("Etes-vous sûr ?");
  if (conf) {
    this.gameService.supprimerGame(g.idGame!);
    this.gameService.listeGame().subscribe(games => {
      this.games = games;
    });
    console.log('Deleted:', g.nomGame);
  }
}
}

