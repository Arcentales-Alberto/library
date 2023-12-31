import { prop, getModelForClass } from '@typegoose/typegoose';

export class Book { 
  @prop({ required: true, type: String })
  title!: string;

  @prop({ required: true, type: String })
  author!: string;
  
  @prop({ required: true, type: String })
  category!: string;

  @prop({ required: true, unique: true, type: String })
  isbn!: string;

  @prop({ required: true, type: Number })
  stock!: number;

  @prop({ required: true, type: String })
  externalBorrow!: string;

  @prop({ default: Date.now, type: Date })
  createdAt?: Date;

  @prop({ default: Date.now, type: Date})
  updatedAt?: Date;
}
export const BookModel = getModelForClass(Book);