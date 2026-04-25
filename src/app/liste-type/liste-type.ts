import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Type } from '../model/type.model';
import { GameService } from '../services/game.service';
import { CommonModule } from '@angular/common';
import { UpdateType } from '../update-type/update-type';
import { Game } from '../model/game.model';

@Component({
  selector: 'app-liste-type',
  templateUrl: './liste-type.html',
  standalone: true,
  imports: [CommonModule, UpdateType]
})
export class ListeType implements OnInit {
  types: Type[] = [];
  currentType: Type = { idType: 0, nomType: '', descriptionType: '' };
  ajout: boolean = true;
  games: Game[] = [];
  selectedTypeId!: number;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef  // ✅
  ) {}

  ngOnInit(): void {
    this.chargerTypes();
  }

  chargerTypes() {
    this.gameService.listeTypes().subscribe(res => {
      this.types = res._embedded.types;
      this.cdr.detectChanges(); // ✅
    });
  }

  editType(type: Type) {
    this.currentType = { ...type };
    this.ajout = false;
  }

  typeUpdated(t: Type) {
    if (this.ajout) {
      this.gameService.addType(t).subscribe(res => {
        this.currentType = { idType: 0, nomType: '', descriptionType: '' };
        this.chargerTypes();
      });
    } else {
      this.gameService.updateType(t).subscribe(res => {
        this.ajout = true;
        this.currentType = { idType: 0, nomType: '', descriptionType: '' };
        this.chargerTypes();
      });
    }
  }

  fetchGamesByType(typeId: number) {
    this.selectedTypeId = typeId;
    this.gameService.listeGame().subscribe(allGames => {
      this.games = allGames.filter(g => g.type?.idType === typeId);
      this.cdr.detectChanges(); // ✅
    });
  }
}