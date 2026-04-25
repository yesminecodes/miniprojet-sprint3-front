import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Game } from '../model/game.model';
import { GameService } from '../services/game.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recherche-par-nom',
  imports: [DatePipe, FormsModule, CommonModule, RouterLink],
  templateUrl: './recherche-par-nom.html',
  styles: ``
})
export class RechercheParNom implements OnInit {
  nomGame!: string;
  games!: Game[];
  allgames!: Game[];
  searchTerm!: string;
  IdType!: number;

  constructor(
    private gameService: GameService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef  // ✅ inject
  ) {}

  ngOnInit(): void {
    this.gameService.listeGame().subscribe(games => {
      this.allgames = games;
      this.games = games;
      this.cdr.detectChanges(); // ✅ force view update
    });
  }

  onKeyUp(filterText: string) {
    this.games = this.allgames.filter(item =>
      item.nomGame?.toLowerCase().includes(filterText)
    );
    this.cdr.detectChanges(); // ✅
  }

  supprimerGame(g: Game) {
    const conf = confirm("Etes-vous sûr ?");
    if (conf) {
      this.gameService.supprimerGame(g.idGame!).subscribe({
        next: () => {
          this.gameService.listeGame().subscribe(games => {
            this.allgames = games;
            this.games = games;
            this.cdr.detectChanges(); // ✅
          });
        },
        error: (err) => console.error('Error deleting game:', err)
      });
    }
  }
}