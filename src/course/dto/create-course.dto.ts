import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateCourseDto {
  @IsString({ message: 'Name must be a string' })
  @Length(1, 100, { message: 'Name must be between 1 and 100 characters' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @Length(1, 500, {
    message: 'Description must be between 1 and 500 characters',
  })
  description: string;

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Duration must be a number' })
  @Min(1, { message: 'Duration must be at least 1 hour' })
  @Max(100, { message: 'Duration must be less than 100 hours' })
  duration: number;

  @IsMongoId({ message: 'Created by must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Created by is required' })
  createdBy: Types.ObjectId;

  @IsMongoId({ message: 'Updated by must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Updated by is required' })
  updatedBy: Types.ObjectId;
}
