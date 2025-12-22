import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/types/common.type';

/* The method of writing the schema for the mongoose model is same as of express with mongoose
    but defining the schema using the class and @Prop decorator
 */

@Schema({
  timestamps: true, // for the createdAt and updateAt fields in the collection
  collection: 'users', // explicitly setting the collection name
})
export class User {
  @Prop({
    type: String,
    required: true,
    maxlength: [30, 'First name must be less than 30 characters'],
  })
  fname: string;

  @Prop({
    type: String,
    required: true,
    maxlength: [30, 'Last name must be less than 30 characters'],
  })
  lname: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: [50, 'Email must be less than 50 characters'],
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(Role),
    default: Role.student,
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
