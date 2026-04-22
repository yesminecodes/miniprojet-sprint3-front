import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { Type } from '../model/type.model';
import { Game } from '../model/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-game',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-game.html'
})
export class AddGame implements OnInit {

  myForm!: FormGroup;
  types: Type[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.gameService.listeTypes().subscribe(res => {
      this.types = res._embedded.types;
    });

    this.myForm = this.formBuilder.group({
      nomGame: ['', [Validators.required, Validators.minLength(3)]],
      prixGame: [0, [Validators.required, Validators.min(0)]],
      dateCreation: ['', Validators.required],
      idType: ['', Validators.required]
    });
  }

  addGame() {
    const form = this.myForm.value;

    const selectedType = this.types.find(t => t.idType == form.idType);

    const gameToAdd: Game = {
      nomGame: form.nomGame,
      prixGame: form.prixGame,
      dateCreation: new Date(form.dateCreation),
      type: selectedType!
    };

    this.gameService.ajouterGame(gameToAdd).subscribe(() => {
      this.router.navigate(['games']);
    });
  }
}
