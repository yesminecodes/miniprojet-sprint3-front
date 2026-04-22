import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Game } from '../model/game.model';
import { GameService } from '../services/game.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-games',
  imports: [CommonModule, RouterLink],
  templateUrl: './games.html',
})
export class Games implements OnInit {
  games!: Game[];

  constructor(private gameService: GameService, public authService: AuthService) {}

  ngOnInit() {
    this.authService.loadToken(); 
    this.chargerGames();
  }

  chargerGames() {
    this.gameService.listeGame().subscribe({
      next: (games) => {
        console.log(games);
        this.games = games;
      },
      error: (err) => {
        console.error('Error loading games:', err);
      }
    });
  }

  supprimerGame(game: Game) {
    let conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.gameService.supprimerGame(game.idGame!).subscribe({
        next: () => {
          console.log("game supprimé");
          this.chargerGames();
        },
        error: (err) => {
          console.error('Error deleting game:', err);
        }
      });
  }
  
}