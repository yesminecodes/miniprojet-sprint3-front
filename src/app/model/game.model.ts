import { Type } from "./type.model";
import { Image } from "./image.model";

export class Game {
    idGame!: number;
    nomGame?: string;
    prixGame?: number;
    dateCreation?: Date;
    type?: Type;
    email?: string;
    image?: Image;
    imageStr?: string;
    images?: Image[];
} 