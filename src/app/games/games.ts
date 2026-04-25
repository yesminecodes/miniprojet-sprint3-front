import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../model/game.model';
import { GameService } from '../services/game.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './games.html',
})
export class Games implements OnInit {
  games: Game[] = [];
  apiurl: string = 'http://localhost:8090/games/api';

  constructor(
    private gameService: GameService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerGames();
  }

  chargerGames() {
    this.gameService.listeGame().subscribe({
      next: (res) => {
        this.games = res;
        this.games.forEach(game => {
          this.gameService.getImagesGame(game.idGame).subscribe({
            next: (images) => {
              game.images = images;
              this.cdr.detectChanges();
            },
            error: () => { game.images = []; }
          });
        });
      },
      error: (err) => console.error('Error loading games:', err)
    });
  }

  supprimerGame(game: Game) {
    const conf = confirm("Etes-vous sûr ?");
    if (conf)
      this.gameService.supprimerGame(game.idGame).subscribe({
        next: () => this.chargerGames(),
        error: (err) => console.error('Error deleting game:', err)
      });
  }

  onImgError(event: any) {
    event.target.style.display = 'none';
  }
}