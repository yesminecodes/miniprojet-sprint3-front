import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../model/game.model';
import { Image } from '../model/image.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '../model/type.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.html',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
})
export class UpdateGame implements OnInit {
  currentGame = new Game();
  types!: Type[];
  myForm!: FormGroup;
  uploadedImage!: File;
  imagePreview: string | null = null;
  gameImages: Image[] = [];
  apiurl: string = 'http://localhost:8090/games/api';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  private formatDate(date: Date): string {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      idGame: [null],
      nomGame: ['', [Validators.required, Validators.minLength(3)]],
      prixGame: [0, [Validators.required, Validators.min(0)]],
      dateCreation: ['', Validators.required],
      idType: ['', Validators.required],
    });

    this.gameService.listeTypes().subscribe((res) => {
      this.types = res._embedded.types;
    });

    this.gameService.consulterGame(this.activatedRoute.snapshot.params['id']).subscribe((game) => {
      this.currentGame = game;
      this.myForm.patchValue({
        idGame: game.idGame,
        nomGame: game.nomGame,
        prixGame: game.prixGame,
        dateCreation: this.formatDate(game.dateCreation!),
        idType: game.type?.idType,
      });
      this.loadImages();
    });
  }

  loadImages() {
    this.gameService.getImagesGame(this.currentGame.idGame).subscribe({
      next: (images) => {
        this.gameImages = images;
        this.cdr.detectChanges();
      },
      error: () => { this.gameImages = []; }
    });
  }

  onImageUpload(event: any) {
    if (event.target.files?.length) {
      this.uploadedImage = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.uploadedImage);
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.cdr.detectChanges();
      };
    }
  }

  onAddImageGame() {
    if (!this.uploadedImage || !this.currentGame.idGame) return;
    this.gameService.uploadImageGame(this.uploadedImage, this.currentGame.idGame).subscribe({
      next: () => {
        this.imagePreview = null;
        this.loadImages();
      },
      error: (err) => console.error(err),
    });
  }

  supprimerImage(image: Image) {
    const conf = confirm("Supprimer cette image ?");
    if (conf)
      this.gameService.supprimerImage(image.idImage).subscribe({
        next: () => this.loadImages(),
        error: (err) => console.error(err)
      });
  }

  updateGame() {
    this.currentGame.nomGame = this.myForm.value.nomGame;
    this.currentGame.prixGame = this.myForm.value.prixGame;
    this.currentGame.dateCreation = new Date(this.myForm.value.dateCreation);
    const selectedType = this.types.find((t) => t.idType == this.myForm.value.idType);
    if (selectedType) this.currentGame.type = selectedType;
    this.gameService.updateGame(this.currentGame).subscribe(() => {
      this.router.navigate(['games']);
    });
  }

  onImgError(event: any) {
    event.target.style.display = 'none';
  }
}