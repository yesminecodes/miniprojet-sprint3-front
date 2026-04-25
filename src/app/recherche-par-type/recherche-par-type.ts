import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Game } from '../model/game.model';
import { GameService } from '../services/game.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Type } from '../model/type.model';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recherche-par-type',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './recherche-par-type.html',
  styles: [`]`]
})
export class RechercheParType implements OnInit {
  games: Game[] = [];
  IdType!: number;
  types!: Type[];
  allGames!: Game[];
  searchTerm!: string;

  constructor(
    private gameService: GameService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef  // ✅
  ) {}

  ngOnInit(): void {
    this.gameService.listeTypes().subscribe(typeWrapper => {
      this.types = typeWrapper._embedded.types;
      if (this.types.length > 0) {
        this.IdType = this.types[0].idType;
        this.onChange();
      }
      this.cdr.detectChanges(); // ✅
    });
  }

  onChange() {
    const typeIdNum = Number(this.IdType);
    this.gameService.listeGame().subscribe(allGames => {
      this.games = allGames.filter(g => g.type?.idType === typeIdNum);
      this.cdr.detectChanges(); // ✅
    });
  }

  supprimerGame(g: Game) {
    if (confirm("Etes-vous sûr ?")) {
      this.gameService.supprimerGame(g.idGame!).subscribe(() => {
        this.onChange();
      });
    }
  }
}