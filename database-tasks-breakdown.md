# Database Implementation Tasks Breakdown

This document provides a detailed breakdown of database implementation tasks for our IT job search platform, based on the database schema plan. It organizes tasks into logical implementation phases with estimated effort, dependencies, and technical details.

## 1. Initial Setup (Total: 3 days)

### 1.1 Database Environment Setup (1 day)
- **Description**: Set up Supabase project and configure development environment
- **Priority**: Critical (P0)
- **Dependencies**: None
- **Technical Details**:
  - Create Supabase project
  - Configure environment variables
  - Set up Prisma with Supabase PostgreSQL connection
  - Create initial project structure
  - Configure database access credentials

```bash
# Example .env file configuration
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
SUPABASE_URL="https://[PROJECT_ID].supabase.co"
SUPABASE_KEY="[SUPABASE_SERVICE_ROLE_KEY]"
```

### 1.2 Prisma Setup (1 day)
- **Description**: Initialize Prisma and create base configuration
- **Priority**: Critical (P0)
- **Dependencies**: 1.1
- **Technical Details**:
  - Initialize Prisma in the project
  - Configure Prisma client
  - Set up Prisma schema file structure
  - Configure Prisma generators

```bash
# Initialize Prisma
npm install prisma --save-dev
npx prisma init

# Configure Prisma client
npm install @prisma/client
```

### 1.3 Database Connection Testing (1 day)
- **Description**: Ensure proper connection to Supabase from the application
- **Priority**: Critical (P0)
- **Dependencies**: 1.1, 1.2
- **Technical Details**:
  - Create connection test script
```typescript
// Example connection test
import { PrismaClient } from '@prisma/client'

async function testConnection() {
  const prisma = new PrismaClient()
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Connection successful:', result)
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
```

## 2. Core Tables Implementation (Total: 8 days)

### 2.1 Users Table (1 day)
- **Description**: Implement the Users table with authentication integration
- **Priority**: Critical (P0)
- **Dependencies**: 1.3
- **Technical Details**:
  - Create Prisma model for Users
  - Configure Supabase authentication integration
  - Set up email verification flow
  - Implement password hashing

```prisma
// Prisma model for Users
model User {
  id            String    @id @default(uuid()) @db.Uuid
  email         String    @unique
  passwordHash  String?
  name          String
  role          UserRole
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  isActive      Boolean   @default(true) @map("is_active")
  avatarUrl     String?   @map("avatar_url")
  phone         String?
  lastLogin     DateTime? @map("last_login")
  
  // Relations
  company       Company?
  resumes       Resume[]
  applications  Application[]
  jobsPosted    Job[]
  sentMessages     Message[]  @relation("SentMessages")
  receivedMessages Message[]  @relation("ReceivedMessages")
  notifications    Notification[]
  payments         Payment[]
  subscriptions    Subscription[]

  @@map("users")
}

enum UserRole {
  JOB_SEEKER
  HR
  ADMIN
}
```

### 2.2 Companies Table (1 day)
- **Description**: Implement the Companies table
- **Priority**: High (P1)
- **Dependencies**: 2.1
- **Technical Details**:
  - Create Prisma model for Companies
  - Configure one-to-one relationship with HR users
  - Set up company verification workflow

```prisma
// Prisma model for Companies
model Company {
  id          String    @id @default(uuid()) @db.Uuid
  name        String
  logoUrl     String?   @map("logo_url")
  description String?
  website     String?
  industry    String
  size        String
  location    String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  isVerified  Boolean   @default(false) @map("is_verified")
  hrId        String    @unique @map("hr_id") @db.Uuid
  
  // Relations
  hr          User      @relation(fields: [hrId], references: [id])
  jobs        Job[]
  subscriptions Subscription[]

  @@map("companies")
}
```
  - Verify database access permissions
  - Test connection pooling configuration
  - Document connection issues and solutions
### 2.3 Jobs Table (1 day)
- **Description**: Implement the Jobs table
- **Priority**: High (P1)
- **Dependencies**: 2.2
- **Technical Details**:
  - Create Prisma model for Jobs
  - Configure JSON fields for salary data
  - Set up job status workflow
  - Implement counters for views and applications

```prisma
// Prisma model for Jobs
model Job {
  id                String      @id @default(uuid()) @db.Uuid
  title             String
  description       String
  salary            Json?
  employmentType    String      @map("employment_type")
  location          String?
  categoryId        String      @map("category_id") @db.Uuid
  tags              String[]
  status            JobStatus   @default(DRAFT)
  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")
  expiresAt         DateTime?   @map("expires_at")
  companyId         String      @map("company_id") @db.Uuid
  hrId              String      @map("hr_id") @db.Uuid
  viewsCount        Int         @default(0) @map("views_count")
  applicationsCount Int         @default(0) @map("applications_count")
  
  // Relations
  company           Company     @relation(fields: [companyId], references: [id])
  hr                User        @relation(fields: [hrId], references: [id])
  category          Category    @relation(fields: [categoryId], references: [id])
  applications      Application[]
  payments          Payment[]

  @@map("jobs")
}

enum JobStatus {
  DRAFT
  PENDING
  ACTIVE
  CLOSED
  REJECTED
}
```

### 2.4 Resumes Table (1 day)
- **Description**: Implement the Resumes table
- **Priority**: High (P1)
- **Dependencies**: 2.1
- **Technical Details**:
  - Create Prisma model for Resumes
  - Configure JSON fields for experience and education
  - Set up file storage for uploaded resumes
  - Implement resume visibility controls

```prisma
// Prisma model for Resumes
model Resume {
  id            String    @id @default(uuid()) @db.Uuid
  name          String
  contacts      Json
  experience    Json[]
  education     Json[]
  skills        String[]
  portfolioUrls String[]  @map("portfolio_urls")
  fileUrl       String?   @map("file_url")
  desiredSalary Json?     @map("desired_salary")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  userId        String    @map("user_id") @db.Uuid
  isPublic      Boolean   @default(false) @map("is_public")
  
  // Relations
  user          User      @relation(fields: [userId], references: [id])
  applications  Application[]

  @@map("resumes")
}
```

### 2.5 Applications Table (1 day)
- **Description**: Implement the Applications table
- **Priority**: High (P1)
- **Dependencies**: 2.3, 2.4
- **Technical Details**:
  - Create Prisma model for Applications
  - Configure application status workflow
  - Set up notifications for status changes

```prisma
// Prisma model for Applications
model Application {
  id          String            @id @default(uuid()) @db.Uuid
  status      ApplicationStatus @default(PENDING)
  coverLetter String?           @map("cover_letter")
  createdAt   DateTime          @default(now()) @map("created_at")
  updatedAt   DateTime          @updatedAt @map("updated_at")
  jobId       String            @map("job_id") @db.Uuid
  resumeId    String            @map("resume_id") @db.Uuid
  userId      String            @map("user_id") @db.Uuid
  notes       String?
  
  // Relations
  job         Job               @relation(fields: [jobId], references: [id])
  resume      Resume            @relation(fields: [resumeId], references: [id])
  user        User              @relation(fields: [userId], references: [id])

  @@map("applications")
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  INTERVIEW
  ACCEPTED
  REJECTED
}
### 2.6 Messages Table (1 day)
- **Description**: Implement the Messages table
- **Priority**: Medium (P2)
- **Dependencies**: 2.1
- **Technical Details**:
  - Create Prisma model for Messages
  - Configure file storage for attachments
  - Set up read status tracking

```prisma
// Prisma model for Messages
model Message {
  id            String    @id @default(uuid()) @db.Uuid
  content       String
  isRead        Boolean   @default(false) @map("is_read")
  createdAt     DateTime  @default(now()) @map("created_at")
  senderId      String    @map("sender_id") @db.Uuid
  receiverId    String    @map("receiver_id") @db.Uuid
  attachmentUrl String?   @map("attachment_url")
  
  // Relations
  sender        User      @relation("SentMessages", fields: [senderId], references: [id])
  receiver      User      @relation("ReceivedMessages", fields: [receiverId], references: [id])

  @@map("messages")
}
```

### 2.7 Categories and Tags Tables (1 day)
- **Description**: Implement the Categories and Tags tables
- **Priority**: Medium (P2)
- **Dependencies**: None
- **Technical Details**:
  - Create Prisma models for Categories and Tags
  - Set up hierarchical structure for categories
  - Configure usage tracking for tags

```prisma
// Prisma model for Categories
model Category {
  id        String    @id @default(uuid()) @db.Uuid
  name      String    @unique
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  parentId  String?   @map("parent_id") @db.Uuid
  
  // Relations
  parent    Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryHierarchy")
  jobs      Job[]

  @@map("categories")
}

// Prisma model for Tags
model Tag {
  id          String    @id @default(uuid()) @db.Uuid
  name        String    @unique
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  usageCount  Int       @default(0) @map("usage_count")

  @@map("tags")
}
```

### 2.8 Notifications, Payments, and Subscriptions Tables (1 day)
- **Description**: Implement the remaining tables
- **Priority**: Medium (P2)
- **Dependencies**: 2.1, 2.3
- **Technical Details**:
  - Create Prisma models for Notifications, Payments, and Subscriptions
  - Configure payment integration
  - Set up subscription management

```prisma
// Prisma model for Notifications
model Notification {
  id                String    @id @default(uuid()) @db.Uuid
  type              String
  content           String
  isRead            Boolean   @default(false) @map("is_read")
  createdAt         DateTime  @default(now()) @map("created_at")
  userId            String    @map("user_id") @db.Uuid
  relatedEntityId   String?   @map("related_entity_id") @db.Uuid
  relatedEntityType String?   @map("related_entity_type")
  
  // Relations
  user              User      @relation(fields: [userId], references: [id])

  @@map("notifications")
}

// Prisma model for Payments
model Payment {
  id                String    @id @default(uuid()) @db.Uuid
  amount            Decimal   @db.Decimal(10, 2)
  currency          String
  status            String
  paymentMethod     String    @map("payment_method")
  createdAt         DateTime  @default(now()) @map("created_at")
  userId            String    @map("user_id") @db.Uuid
  jobId             String?   @map("job_id") @db.Uuid
  subscriptionId    String?   @map("subscription_id") @db.Uuid
  externalPaymentId String    @map("external_payment_id")
  
  // Relations
  user              User      @relation(fields: [userId], references: [id])
  job               Job?      @relation(fields: [jobId], references: [id])

  @@map("payments")
}

// Prisma model for Subscriptions
model Subscription {
  id          String    @id @default(uuid()) @db.Uuid
  plan        String
  status      String
  startDate   DateTime  @map("start_date")
  endDate     DateTime  @map("end_date")
  autoRenew   Boolean   @default(true) @map("auto_renew")
  userId      String    @map("user_id") @db.Uuid
  companyId   String?   @map("company_id") @db.Uuid
  
  // Relations
  user        User      @relation(fields: [userId], references: [id])
  company     Company?  @relation(fields: [companyId], references: [id])

  @@map("subscriptions")
}
```
```
## 3. Relationships Implementation (Total: 4 days)

### 3.1 One-to-One Relationships (1 day)
- **Description**: Implement one-to-one relationships
- **Priority**: High (P1)
- **Dependencies**: 2.1, 2.2
- **Technical Details**:
  - Configure User (HR) to Company relationship
  - Ensure proper foreign key constraints
  - Implement cascading behavior

```sql
-- Example SQL for enforcing one-to-one relationship
ALTER TABLE "companies" 
ADD CONSTRAINT "companies_hr_id_fkey" 
FOREIGN KEY ("hr_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Ensure uniqueness
ALTER TABLE "companies" ADD CONSTRAINT "companies_hr_id_unique" UNIQUE ("hr_id");
```

### 3.2 One-to-Many Relationships (2 days)
- **Description**: Implement one-to-many relationships
- **Priority**: High (P1)
- **Dependencies**: 2.1 through 2.8
- **Technical Details**:
  - Configure User to Resumes relationship
  - Configure User to Jobs relationship
  - Configure Company to Jobs relationship
  - Configure User to Applications relationship
  - Configure Job to Applications relationship
  - Configure Resume to Applications relationship
  - Configure User to Notifications relationship
  - Configure User to Payments relationship
  - Ensure proper foreign key constraints
  - Implement cascading behavior

```sql
-- Example SQL for enforcing one-to-many relationships
ALTER TABLE "resumes" 
ADD CONSTRAINT "resumes_user_id_fkey" 
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "jobs" 
ADD CONSTRAINT "jobs_company_id_fkey" 
FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "jobs" 
ADD CONSTRAINT "jobs_hr_id_fkey" 
FOREIGN KEY ("hr_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Additional constraints for other one-to-many relationships
```

### 3.3 Many-to-Many Relationships (1 day)
- **Description**: Implement many-to-many relationships
- **Priority**: Medium (P2)
- **Dependencies**: 2.3, 2.4, 2.7
- **Technical Details**:
  - Create junction tables for Jobs to Tags relationship
  - Create junction tables for Resumes to Tags relationship
  - Configure proper indexing for junction tables

```prisma
// Junction table for Jobs to Tags
model JobTag {
  jobId     String   @map("job_id") @db.Uuid
  tagId     String   @map("tag_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  
  // Relations
  job       Job      @relation(fields: [jobId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([jobId, tagId])
  @@map("job_tags")
}

// Junction table for Resumes to Tags
model ResumeTag {
  resumeId  String   @map("resume_id") @db.Uuid
  tagId     String   @map("tag_id") @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  
  // Relations
  resume    Resume   @relation(fields: [resumeId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([resumeId, tagId])
  @@map("resume_tags")
}
```

## 4. Indexes Implementation (Total: 3 days)

### 4.1 Primary and Foreign Key Indexes (1 day)
- **Description**: Implement indexes for primary and foreign keys
- **Priority**: High (P1)
- **Dependencies**: 2.1 through 2.8, 3.1 through 3.3
- **Technical Details**:
  - Create indexes for all foreign key fields
  - Optimize index types based on query patterns
  - Document index creation SQL

```sql
-- Example index creation for foreign keys
CREATE INDEX "idx_jobs_company_id" ON "jobs"("company_id");
CREATE INDEX "idx_jobs_hr_id" ON "jobs"("hr_id");
CREATE INDEX "idx_jobs_category_id" ON "jobs"("category_id");
CREATE INDEX "idx_applications_job_id" ON "applications"("job_id");
CREATE INDEX "idx_applications_resume_id" ON "applications"("resume_id");
CREATE INDEX "idx_applications_user_id" ON "applications"("user_id");
```

### 4.2 Performance Indexes (1 day)
- **Description**: Implement indexes for frequently queried fields
- **Priority**: Medium (P2)
- **Dependencies**: 4.1
- **Technical Details**:
  - Create indexes for status fields
  - Create indexes for date fields used in filtering
  - Create indexes for location and other search fields
  - Document index creation SQL

```sql
-- Example index creation for performance
CREATE INDEX "idx_jobs_status" ON "jobs"("status");
CREATE INDEX "idx_jobs_location" ON "jobs"("location");
CREATE INDEX "idx_jobs_employment_type" ON "jobs"("employment_type");
CREATE INDEX "idx_applications_status" ON "applications"("status");
CREATE INDEX "idx_resumes_is_public" ON "resumes"("is_public");
CREATE INDEX "idx_notifications_is_read" ON "notifications"("is_read");
```

### 4.3 Full-Text Search Indexes (1 day)
- **Description**: Implement full-text search capabilities
- **Priority**: Medium (P2)
- **Dependencies**: 4.2
- **Technical Details**:
  - Create GIN indexes for text search
  - Configure tsvector columns for jobs and resumes
  - Set up text search configuration
  - Document full-text search implementation

```sql
-- Add tsvector columns
ALTER TABLE "jobs" ADD COLUMN "search_vector" tsvector;
ALTER TABLE "resumes" ADD COLUMN "search_vector" tsvector;

-- Create GIN indexes
CREATE INDEX "idx_jobs_search_vector" ON "jobs" USING GIN("search_vector");
CREATE INDEX "idx_resumes_search_vector" ON "resumes" USING GIN("search_vector");

-- Create update triggers
CREATE FUNCTION update_job_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_job_search_vector
BEFORE INSERT OR UPDATE ON "jobs"
FOR EACH ROW EXECUTE FUNCTION update_job_search_vector();
```

## 5. Security Policies Implementation (Total: 4 days)

### 5.1 Row-Level Security Setup (1 day)
- **Description**: Configure Supabase RLS policies
- **Priority**: Critical (P0)
- **Dependencies**: 2.1 through 2.8
- **Technical Details**:
  - Enable RLS on all tables
  - Create base policy framework
  - Test policy enforcement

```sql
-- Enable RLS on tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "resumes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;
```

### 5.2 User Data Access Policies (1 day)
- **Description**: Implement RLS policies for user data
- **Priority**: Critical (P0)
- **Dependencies**: 5.1
- **Technical Details**:
  - Create policies for user profile access
  - Create policies for resume visibility
  - Create policies for application data access
  - Test policy enforcement

```sql
-- Example RLS policies for user data
-- Users can read their own data
CREATE POLICY "Users can read own data" ON "users"
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON "users"
  FOR UPDATE USING (auth.uid() = id);

-- HR users can read job seeker profiles
CREATE POLICY "HR can read job seeker profiles" ON "users"
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'HR') AND 
    role = 'JOB_SEEKER'
  );
```

### 5.3 Company and Job Policies (1 day)
- **Description**: Implement RLS policies for company and job data
- **Priority**: High (P1)
- **Dependencies**: 5.1
- **Technical Details**:
  - Create policies for company data access
  - Create policies for job posting access
  - Create policies for application management
  - Test policy enforcement

```sql
-- Example RLS policies for company and job data
-- HR users can manage their own company
CREATE POLICY "HR can manage own company" ON "companies"
  FOR ALL USING (auth.uid() = hr_id);

-- Everyone can read company data
CREATE POLICY "Everyone can read company data" ON "companies"
  FOR SELECT USING (true);

-- HR users can manage their own job postings
CREATE POLICY "HR can manage own jobs" ON "jobs"
  FOR ALL USING (auth.uid() = hr_id);

-- Everyone can read active jobs
CREATE POLICY "Everyone can read active jobs" ON "jobs"
  FOR SELECT USING (status = 'ACTIVE');
```

### 5.4 Messaging and Notification Policies (1 day)
- **Description**: Implement RLS policies for messages and notifications
- **Priority**: Medium (P2)
- **Dependencies**: 5.1
- **Technical Details**:
  - Create policies for message access
  - Create policies for notification access
  - Test policy enforcement

```sql
-- Example RLS policies for messages and notifications
-- Users can read messages they sent or received
CREATE POLICY "Users can read own messages" ON "messages"
  FOR SELECT USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

-- Users can create messages
CREATE POLICY "Users can create messages" ON "messages"
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON "notifications"
  FOR SELECT USING (auth.uid() = user_id);
```