# NestJS Learning Path 📚

A comprehensive guide tracking my NestJS learning journey - from basics to advanced concepts.

---

## 📋 Table of Contents

1. [Getting Started](#1-getting-started)
2. [Core Concepts](#2-core-concepts)
3. [Modules & Dependency Injection](#3-modules--dependency-injection)
4. [Controllers & Routing](#4-controllers--routing)
5. [Providers & Services](#5-providers--services)
6. [Database Integration (MongoDB)](#6-database-integration-mongodb)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Validation & DTOs](#8-validation--dtos)
9. [Advanced Topics](#9-advanced-topics)
10. [Best Practices](#10-best-practices)

---

## 1. Getting Started ✅

### What is NestJS?

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of:
- **OOP** (Object-Oriented Programming)
- **FP** (Functional Programming)  
- **FRP** (Functional Reactive Programming)

### Project Setup

```bash
# Install NestJS CLI
npm i -g @nestjs/cli

# Create new project
nest new project-name

# Start development server
npm run start:dev
```

### Current Project: CMS Demo API

- **Project Name**: cms-demo-api
- **NestJS Version**: 11.x
- **Database**: MongoDB (Mongoose)
- **Main Dependencies**:
  - @nestjs/mongoose: Database integration
  - @nestjs/config: Environment configuration
  - bcrypt: Password hashing

**Project Structure**:
```
src/
├── app.module.ts        # Root module
├── main.ts              # Entry point
├── auth/                # Authentication module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/
│       └── registerUser.dto.ts
└── user/                # User module
    ├── user.service.ts
    ├── user.module.ts
    └── schemas/
        └── user.schema.ts
```

---

## 2. Core Concepts 📖

### The NestJS Architecture

```
Request → Controller → Service → Database
Response ← Controller ← Service ← Database
```

### Key Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@Module()` | Define a module | `@Module({ imports: [], providers: [] })` |
| `@Injectable()` | Mark class as provider | `@Injectable() export class UserService` |
| `@Controller()` | Define controller | `@Controller('users')` |
| `@Get()` | HTTP GET endpoint | `@Get('/:id')` |
| `@Post()` | HTTP POST endpoint | `@Post('/register')` |
| `@Body()` | Extract request body | `create(@Body() dto: CreateDto)` |
| `@Param()` | Extract URL parameter | `findOne(@Param('id') id: string)` |

---

## 3. Modules & Dependency Injection 🔌

### ✅ What I've Learned

#### Module Basics

Modules are the fundamental building blocks of a NestJS application. Each module encapsulates related functionality.

**Example from my project**:

```typescript
// user.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
```

#### What Can Be Injected?

✅ **Can Be Injected**:
- Services with `@Injectable()` decorator
- Mongoose models (using `@InjectModel()`)
- Any provider registered in a module
- Built-in services (ConfigService, Logger, etc.)

❌ **Cannot Be Injected**:
- Controllers (they're entry points, not services)
- Plain classes without `@Injectable()`
- Anything not registered as a provider

#### Module Communication Patterns

**Pattern 1: Export Service** (when you want to use service methods)
```typescript
// user.module.ts
@Module({
  providers: [UserService],
  exports: [UserService],  // Export service
})
export class UserModule {}

// auth.service.ts
constructor(private userService: UserService) {}  // Inject service
```

**Pattern 2: Export MongooseModule** (when you need direct model access)
```typescript
// user.module.ts
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [MongooseModule],  // Export module
})
export class UserModule {}

// auth.service.ts
constructor(@InjectModel(User.name) private userModel: Model<User>) {}
```

**Pattern 3: Export Both** ⭐ (most flexible - my approach)
```typescript
// user.module.ts
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService],
  exports: [UserService, MongooseModule],  // Export both
})
export class UserModule {}
```

#### Dependency Injection in Action

**My AuthModule** using UserModule:
```typescript
// auth.module.ts
@Module({
  imports: [UserModule],  // 1. Import the module
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// auth.service.ts
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}  // 2. Inject the service
  
  registerUser(registerDto: RegisterDto) {
    return this.userService.createUser();  // 3. Use the service
  }
}
```

#### 🎯 Key Takeaways

1. **Module Encapsulation**: Each module owns its providers and schemas
2. **Export to Share**: Only exported providers can be used by other modules
3. **Import Before Inject**: Always import module before injecting its providers
4. **Avoid Direct Schema Registration**: Don't register schemas from other modules directly (breaks encapsulation)

---

## 4. Controllers & Routing 🛣️

### What Controllers Do

Controllers handle incoming **HTTP requests** and return **responses** to the client.

### Route Structure

```typescript
@Controller('auth')  // Base route: /auth
export class AuthController {
  @Post('register')  // Full route: POST /auth/register
  register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }
  
  @Get('profile/:id')  // Full route: GET /auth/profile/:id
  getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }
}
```

### Request Object Decorators

```typescript
@Post('example')
example(
  @Body() body: any,           // Request body
  @Param('id') id: string,     // URL parameter
  @Query('search') search: string,  // Query string
  @Headers() headers: any,     // Request headers
  @Req() request: Request,     // Full request object
) {}
```

---

## 5. Providers & Services 🛠️

### What Are Providers?

Providers are classes with the `@Injectable()` decorator. They can:
- Contain business logic
- Be injected as dependencies
- Access databases, external APIs, etc.

### Service Example from My Project

```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}
  
  async createUser(userData: RegisterDto) {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }
  
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
```

---

## 6. Database Integration (MongoDB) 🗄️

### ✅ What I've Learned

#### Setting Up Mongoose

**1. Install dependencies**:
```bash
npm install @nestjs/mongoose mongoose
npm install @nestjs/config
```

**2. Create `.env` file in project root**:
```bash
# .env
MONGODB_URL=mongodb://localhost:27017/cms-demo
PORT=3000
```

**3. Connect in root module** (IMPORTANT: Order matters!):
```typescript
// app.module.ts
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // 1. Load ConfigModule FIRST with isGlobal option
    ConfigModule.forRoot({
      isGlobal: true,  // Makes ConfigService available everywhere
      envFilePath: '.env',
    }),
    
    // 2. Use forRootAsync to access environment variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    
    // 3. Other modules
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
```

**❌ Common Mistake** (What I fixed):
```typescript
// DON'T do this - process.env is not loaded yet!
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ConfigModule.forRoot(),
  ],
})
```

#### Why forRootAsync?

- `forRoot()` - Synchronous, runs immediately (env vars might not be loaded)
- `forRootAsync()` - Asynchronous, waits for ConfigService to load env vars
- **Always use `forRootAsync()` when using environment variables!**

#### Creating Schemas

**My User Schema**:
```typescript
@Schema({
  timestamps: true,      // Adds createdAt & updatedAt
  collection: 'users',   // Explicit collection name
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
    unique: true,
    lowercase: true,
  })
  email: string;
  
  @Prop({ type: String, required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
```

#### Using Models

**Registering in Module**:
```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
```

**Injecting in Service**:
```typescript
constructor(
  @InjectModel(User.name) private userModel: Model<User>
) {}
```

#### Common Mongoose Operations

```typescript
// Create
const user = new this.userModel(data);
await user.save();

// Find one
await this.userModel.findOne({ email });
await this.userModel.findById(id);

// Find many
await this.userModel.find({ status: 'active' });

// Update
await this.userModel.findByIdAndUpdate(id, data, { new: true });

// Delete
await this.userModel.findByIdAndDelete(id);
```

---

## 7. Authentication & Authorization 🔐

### 📝 To Learn

- [ ] JWT (JSON Web Tokens)
- [ ] Passport.js integration
- [ ] Guards and authentication guards
- [ ] Password hashing with bcrypt
- [ ] Role-based access control (RBAC)

### Current Implementation Plan

**AuthService tasks**:
1. Check if email already exists
2. Hash the password using bcrypt
3. Store user in database
4. Generate JWT token
5. Send token in response

---

## 8. Validation & DTOs 📋

### What Are DTOs?

DTOs (Data Transfer Objects) define the shape of data for API requests.

### My RegisterDto

```typescript
export class RegisterDto {
  fname: string;
  lname: string;
  email: string;
  password: string;
}
```

### 📝 To Learn

- [ ] Class-validator package
- [ ] Validation decorators (@IsEmail, @MinLength, etc.)
- [ ] Global validation pipes
- [ ] Custom validators

---

## 9. Advanced Topics 🚀

### 📝 To Learn

- [ ] **Middleware**: Request processing before controllers
- [ ] **Guards**: Authorization and authentication
- [ ] **Interceptors**: Transform responses, add logging
- [ ] **Pipes**: Transform and validate input data
- [ ] **Exception Filters**: Custom error handling
- [ ] **Testing**: Unit tests and E2E tests
- [ ] **Swagger/OpenAPI**: API documentation
- [ ] **WebSockets**: Real-time communication
- [ ] **Microservices**: Distributed architecture
- [ ] **GraphQL**: Alternative to REST

---

## 10. Best Practices ⭐

### Module Organization

✅ **DO**:
- Keep modules focused on a single feature
- Export only what other modules need
- Use barrel exports (index.ts)

❌ **DON'T**:
- Create one giant module with everything
- Directly register schemas from other modules
- Export controllers

### Dependency Injection

✅ **DO**:
```typescript
// Use constructor injection
constructor(private readonly userService: UserService) {}
```

❌ **DON'T**:
```typescript
// Don't create instances manually
const userService = new UserService();
```

### Schema Registration

✅ **DO** (Recommended):
```typescript
// Register schema in its own module
// Export MongooseModule to share
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  exports: [MongooseModule],
})
```

❌ **AVOID** (Not recommended but works):
```typescript
// Registering schemas from other modules directly
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },  // From another module
      { name: Meeting.name, schema: MeetingSchema },  // From another module
    ])
  ],
})
```

### File Naming Conventions

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- Modules: `*.module.ts`
- DTOs: `*.dto.ts`
- Schemas: `*.schema.ts`
- Interfaces: `*.interface.ts`

---

## 📚 Resources

### Official Documentation
- [NestJS Docs](https://docs.nestjs.com/)
- [Mongoose Docs](https://mongoosejs.com/)

### Video Tutorials
- [ ] NestJS Crash Course
- [ ] NestJS + MongoDB Tutorial
- [ ] Authentication with JWT

### Practice Projects
- [x] CMS Demo API (current)
- [ ] Blog API
- [ ] E-commerce API

---

## 📝 Learning Checklist

### Basics
- [x] Understanding NestJS architecture
- [x] Creating modules
- [x] Creating controllers
- [x] Creating services
- [x] Dependency injection basics

### Configuration
- [x] Setting up environment variables
- [x] Using ConfigModule
- [x] Understanding ConfigService
- [x] forRoot vs forRootAsync patterns
- [x] Making ConfigModule global

### Database
- [x] MongoDB connection setup
- [x] Creating schemas with Mongoose
- [x] Registering models in modules
- [x] Injecting models in services
- [x] Understanding module exports for schemas
- [x] Fixing database connection issues

### Module Communication
- [x] Importing modules
- [x] Exporting providers
- [x] Understanding what can be injected
- [x] Different patterns of sharing resources

### Authentication
- [ ] Password hashing with bcrypt
- [ ] JWT token generation
- [ ] JWT validation
- [ ] Auth guards
- [ ] Login endpoint
- [ ] Protected routes

### Validation
- [ ] Installing class-validator
- [ ] Creating DTOs with validation
- [ ] Global validation pipe
- [ ] Custom validators

### Advanced
- [ ] Middleware
- [ ] Guards
- [ ] Interceptors
- [ ] Pipes
- [ ] Exception filtersuserModel
- [ ] Testing

---

## 💡 Key Insights & Notes

### Date: Dec 19, 2025

**Topic: Module Exports & Dependency Injection**

Today I learned about:
1. What can and cannot be injected in NestJS
2. Two main patterns for sharing resources:
   - Exporting services (for using service methods)
   - Exporting MongooseModule (for direct model access)
3. Why exporting both is the most flexible approach
4. The difference between importing a module vs directly registering schemas
5. Best practices favor module encapsulation over direct schema registration

**Key Realization**: 
My current project setup with `UserModule` exporting both `UserService` and `MongooseModule` follows NestJS best practices and provides maximum flexibility for other modules to use User resources either through the service or direct model access.

---

**Topic: Environment Variables & ConfigModule**

Fixed a critical bug today!

**Problem**: Application crashed with `MongooseError: The 'uri' parameter must be a string, got "undefined"`

**Root Cause**:
1. No `.env` file existed in the project
2. `ConfigModule.forRoot()` was loaded AFTER trying to access `process.env.MONGODB_URL`
3. Used synchronous `MongooseModule.forRoot()` instead of async version

**Solution**:
1. ✅ Created `.env` file with `MONGODB_URL`
2. ✅ Moved `ConfigModule.forRoot()` to the TOP of imports array with `isGlobal: true`
3. ✅ Changed to `MongooseModule.forRootAsync()` with `useFactory` pattern
4. ✅ Injected `ConfigService` to properly access environment variables

**Key Takeaway**: 
- Environment variables are loaded by `ConfigModule.forRoot()` at runtime
- Always use `forRootAsync()` when you need to access async dependencies like ConfigService
- The order of module imports matters!
- `isGlobal: true` makes ConfigService available everywhere without re-importing

---

## 🎯 Current Goals

- [ ] Complete user registration with password hashing
- [ ] Implement JWT authentication
- [ ] Add validation to DTOs
- [ ] Create login endpoint
- [ ] Protect routes with guards
- [ ] Add error handling

---

## 🤔 Questions to Explore

1. How do guards work internally?
2. When should I use interceptors vs middleware?
3. How to structure a large-scale NestJS application?
4. Best practices for testing NestJS applications?
5. How to implement refresh tokens?

---

**Last Updated**: December 19, 2025

*Keep learning, keep building! 🚀*

