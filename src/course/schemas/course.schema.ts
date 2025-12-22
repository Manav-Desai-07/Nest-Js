import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'courses',
})
export class Course {
  @Prop({
    type: String,
    unique: true,
    required: true,
    maxlength: [100, 'Course name must be less than 100 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    maxlength: [500, 'Course description must be less than 500 characters'],
  })
  description: string;

  @Prop({
    type: Number,
    required: true,
    min: [1, 'Course duration must be at least 1 hour'],
    max: [100, 'Course duration must be less than 100 hours'],
  })
  duration: number; // number of hours

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId; // the user who created the course

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  updatedBy: Types.ObjectId; // the user who updated the course
}

export const CourseSchema = SchemaFactory.createForClass(Course);
export type CourseDocument = HydratedDocument<Course>;
