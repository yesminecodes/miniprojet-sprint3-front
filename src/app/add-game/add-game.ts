import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { Type } from '../model/type.model';
import { Game } from '../model/game.model';
import { CommonModule } from '@angular/common';
import { Image } from '../model/image.model';

@Component({
  selector: 'app-add-game',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-game.html',
})
export class AddGame implements OnInit {
  myForm!: FormGroup;
  types: Type[] = [];
  uploadedImage!: File;
  imagePath: any;
  newGame: Game = new Game();
  newIdType: any;

  constructor(
    private formBuilder: FormBuilder,
    private gameService: GameService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gameService.listeTypes().subscribe((res) => {
      this.types = res._embedded.types;
    });

    this.myForm = this.formBuilder.group({
      nomGame: ['', [Validators.required, Validators.minLength(3)]],
      prixGame: [0, [Validators.required, Validators.min(0)]],
      dateCreation: ['', Validators.required],
      idType: ['', Validators.required],
    });
  }

  addGame() {
  if (this.myForm.invalid) return;

  this.newGame.nomGame = this.myForm.value.nomGame;
  this.newGame.prixGame = this.myForm.value.prixGame;
  this.newGame.dateCreation = this.myForm.value.dateCreation;
  this.newGame.type = this.types.find(t => t.idType == this.myForm.value.idType)!;

  // Step 1: save the game
  this.gameService.ajouterGame(this.newGame).subscribe({
    next: (game) => {
      // Step 2: upload image to filesystem using the new game's ID
      this.gameService.uploadImageFS(this.uploadedImage, this.uploadedImage.name, game.idGame).subscribe({
        next: () => {
          this.router.navigate(['/games']);
        },
        error: (err) => {
          console.error('Image upload failed:', err);
          // game was saved but image failed — handle as needed
          this.router.navigate(['/games']);
        }
      });
    },
    error: (err) => {
      console.error('Failed to add game:', err);
    }
  });
}
  onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.uploadedImage);
    reader.onload = (_event) => {
      this.imagePath = reader.result;
    };
  }
}