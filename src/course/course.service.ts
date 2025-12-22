import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Model, PipelineStage, Types } from 'mongoose';
import { Course } from './schemas/course.schema';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    private readonly userService: UserService,
  ) {}
  async create(@Body() course: CreateCourseDto) {
    const user = await this.userService.findById(course.createdBy);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newCourse = await this.courseModel.create({
      ...course,
      createdBy: user._id,
    });

    return newCourse;
  }

  async findAll(): Promise<any> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByUser',
        },
      },
      {
        $unwind: '$createdByUser',
      },
      {
        $project: {
          updatedBy: 0,
          createdBy: 0,
          __v: 0,
        },
      },
    ];

    return await this.courseModel.aggregate(pipeline);
  }

  async findOne(id: Types.ObjectId) {
    return await this.courseModel.findById(id).exec();
  }

  async update(id: Types.ObjectId, updateCourseDto: UpdateCourseDto) {
    return await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: Types.ObjectId) {
    await this.courseModel.findByIdAndDelete(id).exec();
    return {
      message: 'Course deleted successfully',
    };
  }
}
