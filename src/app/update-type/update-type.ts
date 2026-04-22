import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Type } from '../model/type.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-type',
  imports: [FormsModule],
  templateUrl: './update-type.html',
  styles: ``
})
export class UpdateType {
  @Input()
  type?: Type;
  @Input()
  ajout?: boolean;
  @Output()
  typeUpdated = new EventEmitter<Type>();
  ngOnInit(): void {
    console.log("ngOnInit du composant UpdateType ", this.type);
  }
  saveType() {
    this.typeUpdated.emit(this.type);
  }
}
