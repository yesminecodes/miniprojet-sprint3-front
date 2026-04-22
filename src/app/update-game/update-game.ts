import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../model/game.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '../model/type.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.html',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class UpdateGame implements OnInit {

  currentGame = new Game();
  types!: Type[];
  myForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private fb: FormBuilder
  ) {}

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      idGame: [null],
      nomGame: ['', [Validators.required]],
      prixGame: [null, Validators.required],
      dateCreation: ['', Validators.required],
      idType: [null, Validators.required]
    });

    this.gameService.listeTypes().subscribe(t => {
      this.types = t._embedded.types;

      this.gameService.consulterGame(this.activatedRoute.snapshot.params['id'])
        .subscribe(game => {
          this.currentGame = game;
          this.myForm.patchValue({
            idGame: game.idGame,
            nomGame: game.nomGame,
            prixGame: game.prixGame,
            dateCreation: this.formatDate(game.dateCreation!),
            idType: game.type?.idType
          });
        });
    });
  }

  updateGame() {
    const formValues = this.myForm.value;

    const selectedType = this.types.find(t => t.idType === formValues.idType);

    const updatedGame: Game = {
      idGame: formValues.idGame,
      nomGame: formValues.nomGame,
      prixGame: formValues.prixGame,
      dateCreation: new Date(formValues.dateCreation),
      type: selectedType!
    };

    this.gameService.updateGame(updatedGame).subscribe(() => {
      this.router.navigate(['games']);
    });
  }

  updateType(updatedType: Type) {
    this.gameService.updateType(updatedType).subscribe(res => {
      console.log("Type updated:", res);
    });
  }
}
