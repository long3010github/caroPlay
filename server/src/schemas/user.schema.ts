import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  username: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: undefined })
  @Exclude()
  currentRoom?: string;

  // @Prop()
  // breed: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
