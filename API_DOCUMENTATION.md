# Complete API Documentation - Enquiry Management System

**Base URL:** `http://localhost:5000/api`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Enquiries](#enquiries)
4. [Subjects](#subjects)
5. [Packages](#packages)
6. [Batches](#batches)
7. [Assignments](#assignments)
8. [Mock Interviews](#mock-interviews)
9. [Instructors](#instructors)
10. [Reviews](#reviews)
11. [Billing](#billing)
12. [Logs](#logs)

---

## Authentication

### 1. Login
**Endpoint:** `POST /auth/login`

**Description:** Login user with email and password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 2. Validate Token
**Endpoint:** `GET /auth/validate-token`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token is valid",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "ADMIN"
  }
}
```

---

## Users

### 1. Get All Users
**Endpoint:** `GET /users`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN

**Response (Success - 200):**
```json
{
  "success": true,
  "users": [
    {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "ADMIN"
    },
    {
      "id": 2,
      "email": "instructor@example.com",
      "name": "John Instructor",
      "role": "instructor"
    }
  ]
}
```

---

### 2. Create User
**Endpoint:** `POST /users`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "instructor"
}
```

**Valid Roles:** `ADMIN`, `instructor`, `COUNSELLOR`, `HR`, `ACCOUNTS`

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 3,
    "email": "newuser@example.com",
    "name": "New User",
    "role": "instructor"
  }
}
```

---

### 3. Change Password
**Endpoint:** `POST /users/change-password`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN

**Request Body:**
```json
{
  "userId": 2,
  "newPassword": "newpassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 4. Delete User
**Endpoint:** `DELETE /users/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN

**URL Parameters:**
- `id` - User ID to delete

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Enquiries

### 1. Get All Enquiries
**Endpoint:** `GET /enquiries`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "enquiries": [
    {
      "id": 1,
      "name": "John Candidate",
      "email": "john@example.com",
      "phone": "9876543210",
      "candidateStatus": "class",
      "source": "Website",
      "notes": "Interested in Python",
      "createdAt": "2026-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Enquiry by ID
**Endpoint:** `GET /enquiries/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Enquiry ID

**Response (Success - 200):**
```json
{
  "success": true,
  "enquiry": {
    "id": 1,
    "name": "John Candidate",
    "email": "john@example.com",
    "phone": "9876543210",
    "candidateStatus": "class",
    "source": "Website",
    "notes": "Interested in Python"
  }
}
```

---

### 3. Create Enquiry
**Endpoint:** `POST /enquiries`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR

**Request Body:**
```json
{
  "name": "Jane Candidate",
  "email": "jane@example.com",
  "phone": "9876543210",
  "candidateStatus": "class",
  "source": "Referral",
  "notes": "Interested in Web Development"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Enquiry created successfully",
  "enquiry": {
    "id": 2,
    "name": "Jane Candidate",
    "email": "jane@example.com",
    "phone": "9876543210",
    "candidateStatus": "class",
    "source": "Referral"
  }
}
```

---

### 4. Update Enquiry
**Endpoint:** `PUT /enquiries/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR

**URL Parameters:**
- `id` - Enquiry ID

**Request Body:**
```json
{
  "name": "Jane Updated",
  "phone": "9876543211",
  "candidateStatus": "enrolled",
  "notes": "Updated notes"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Enquiry updated successfully"
}
```

---

### 5. Change Enquiry Status
**Endpoint:** `POST /enquiries/change-status`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR, HR, ACCOUNTS

**Request Body:**
```json
{
  "enquiryId": 1,
  "newStatus": "enrolled"
}
```

**Valid Status Values:** `inquiry`, `class`, `enrolled`, `closed`, `not-interested`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Enquiry status updated to enrolled"
}
```

---

### 6. Delete Enquiry
**Endpoint:** `DELETE /enquiries/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR

**URL Parameters:**
- `id` - Enquiry ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Enquiry deleted successfully"
}
```

---

## Subjects

### 1. Get All Subjects
**Endpoint:** `GET /subjects`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "subjects": [
    {
      "id": 1,
      "name": "Python Programming",
      "code": "PY101",
      "description": "Learn Python basics",
      "image": "python.jpg",
      "startDate": "2026-01-15",
      "prerequisites": "Basic Math",
      "syllabus": "Introduction to Python",
      "overview": "Complete Python course"
    }
  ]
}
```

---

### 2. Get Subject by ID
**Endpoint:** `GET /subjects/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Subject ID

**Response (Success - 200):**
```json
{
  "success": true,
  "subject": {
    "id": 1,
    "name": "Python Programming",
    "code": "PY101",
    "description": "Learn Python basics"
  }
}
```

---

### 3. Create Subject
**Endpoint:** `POST /subjects`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (text) - Subject name (required)
- `code` (text) - Subject code (required)
- `description` (text) - Description
- `image` (file) - Subject image (optional)
- `startDate` (date) - Start date
- `prerequisites` (text) - Prerequisites
- `syllabus` (text) - Syllabus details
- `overview` (text) - Overview

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Subject created successfully",
  "subject": {
    "id": 2,
    "name": "Java Programming",
    "code": "JV101"
  }
}
```

---

### 4. Update Subject
**Endpoint:** `PUT /subjects/:id`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**URL Parameters:**
- `id` - Subject ID

**Form Data:** Same as Create Subject

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Subject updated successfully"
}
```

---

### 5. Delete Subject
**Endpoint:** `DELETE /subjects/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Subject ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

---

## Packages

### 1. Get All Packages
**Endpoint:** `GET /packages`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "packages": [
    {
      "id": 1,
      "name": "Beginner Package",
      "code": "PKG001",
      "description": "Basic programming package",
      "price": 5000,
      "duration": "3 months",
      "image": "package.jpg"
    }
  ]
}
```

---

### 2. Get Package by ID
**Endpoint:** `GET /packages/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Package ID

**Response (Success - 200):**
```json
{
  "success": true,
  "package": {
    "id": 1,
    "name": "Beginner Package",
    "price": 5000
  }
}
```

---

### 3. Create Package
**Endpoint:** `POST /packages`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (text) - Package name (required)
- `code` (text) - Package code (required)
- `description` (text) - Description
- `price` (number) - Price
- `duration` (text) - Duration
- `image` (file) - Package image (optional)
- `startDate` (date) - Start date
- `prerequisites` (text) - Prerequisites
- `syllabus` (text) - Syllabus
- `overview` (text) - Overview

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Package created successfully",
  "package": {
    "id": 2,
    "name": "Advanced Package",
    "code": "PKG002"
  }
}
```

---

### 4. Update Package
**Endpoint:** `PUT /packages/:id`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**URL Parameters:**
- `id` - Package ID

**Form Data:** Same as Create Package

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Package updated successfully"
}
```

---

### 5. Delete Package
**Endpoint:** `DELETE /packages/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Package ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Package deleted successfully"
}
```

---

## Batches

### 1. Create Batch
**Endpoint:** `POST /batches/create`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Python Batch 101",
  "code": "BATCH001",
  "subjectId": 1,
  "batchStartDate": "2026-02-01",
  "sessionLink": "https://meet.google.com/abc",
  "sessionDate": "2026-02-01",
  "sessionTime": "10:00:00",
  "numberOfStudents": 30
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "batch": {
    "id": 1,
    "name": "Python Batch 101",
    "code": "BATCH001",
    "status": "yet to start",
    "approvalStatus": "pending"
  }
}
```

---

### 2. Get Available Batches
**Endpoint:** `GET /batches/available-batches`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Description:** Get approved batches created by admin/counsellor (for instructors)

**Response (Success - 200):**
```json
{
  "success": true,
  "batches": [
    {
      "id": 1,
      "name": "Python Batch 101",
      "code": "BATCH001",
      "status": "In progress",
      "approvalStatus": "approved"
    }
  ]
}
```

---

### 3. Get All Batches
**Endpoint:** `GET /batches`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "batches": [
    {
      "id": 1,
      "name": "Python Batch 101",
      "code": "BATCH001",
      "status": "In progress",
      "approvalStatus": "approved",
      "numberOfStudents": 30
    }
  ]
}
```

---

### 4. Get Batch by ID
**Endpoint:** `GET /batches/:batchId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `batchId` - Batch ID

**Response (Success - 200):**
```json
{
  "success": true,
  "batch": {
    "id": 1,
    "name": "Python Batch 101",
    "code": "BATCH001",
    "subject": {
      "id": 1,
      "name": "Python Programming"
    }
  }
}
```

---

### 5. Update Batch
**Endpoint:** `PUT /batches/:batchId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `batchId` - Batch ID

**Request Body:**
```json
{
  "name": "Python Batch 101 Updated",
  "sessionLink": "https://meet.google.com/xyz",
  "numberOfStudents": 35
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Batch updated successfully"
}
```

---

### 6. Update Approval Status
**Endpoint:** `PATCH /batches/:batchId/approval-status`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR

**URL Parameters:**
- `batchId` - Batch ID

**Request Body:**
```json
{
  "approvalStatus": "approved"
}
```

**Valid Status Values:** `pending`, `approved`, `rejected`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Approval status updated to approved"
}
```

---

### 7. Delete Batch
**Endpoint:** `DELETE /batches/:batchId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `batchId` - Batch ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

---

## Assignments

### 1. Create Assignment
**Endpoint:** `POST /assignments/create`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "batchId": 1,
  "title": "Assignment 1: Python Basics",
  "description": "Learn and practice Python fundamentals",
  "dueDate": "2026-02-15"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "assignment": {
    "id": 1,
    "title": "Assignment 1: Python Basics",
    "batchId": 1,
    "subjectId": 1,
    "status": "assigned",
    "dueDate": "2026-02-15"
  }
}
```

---

### 2. Get My Assignments
**Endpoint:** `GET /assignments/my-assignments`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Description:** Get all assignments created by instructor or all (for admin/counsellor)

**Response (Success - 200):**
```json
{
  "success": true,
  "assignments": [
    {
      "id": 1,
      "title": "Assignment 1",
      "status": "assigned",
      "dueDate": "2026-02-15",
      "batch": {
        "id": 1,
        "name": "Python Batch 101"
      }
    }
  ]
}
```

---

### 3. Get Assignments by Batch
**Endpoint:** `GET /assignments/batch/:batchId`

**URL Parameters:**
- `batchId` - Batch ID

**Response (Success - 200):**
```json
{
  "success": true,
  "assignments": [
    {
      "id": 1,
      "title": "Assignment 1",
      "status": "assigned",
      "batchId": 1
    }
  ]
}
```

---

### 4. Get Assignments by Subject
**Endpoint:** `GET /assignments/subject/:subjectId`

**URL Parameters:**
- `subjectId` - Subject ID

**Response (Success - 200):**
```json
{
  "success": true,
  "assignments": [
    {
      "id": 1,
      "title": "Assignment 1",
      "status": "assigned",
      "subjectId": 1
    }
  ]
}
```

---

### 5. Get Single Assignment
**Endpoint:** `GET /assignments/:assignmentId`

**URL Parameters:**
- `assignmentId` - Assignment ID

**Response (Success - 200):**
```json
{
  "success": true,
  "assignment": {
    "id": 1,
    "title": "Assignment 1",
    "description": "Python basics",
    "status": "assigned",
    "dueDate": "2026-02-15"
  }
}
```

---

### 6. Update Assignment
**Endpoint:** `PUT /assignments/:assignmentId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `assignmentId` - Assignment ID

**Request Body:**
```json
{
  "title": "Assignment 1 Updated",
  "description": "Updated description",
  "dueDate": "2026-02-20"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Assignment updated successfully"
}
```

---

### 7. Delete Assignment
**Endpoint:** `DELETE /assignments/:assignmentId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `assignmentId` - Assignment ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Assignment deleted successfully"
}
```

---

### 8. Submit Assignment Work (NEW)
**Endpoint:** `POST /assignments/:assignmentId/submit`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `assignmentId` - Assignment ID

**Request Body:**
```json
{
  "submissionNotes": "Here is my solution with explanations",
  "submissionFile": "https://drive.google.com/file/xyz123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Assignment submitted by John Student",
  "data": {
    "id": 1,
    "title": "Assignment 1",
    "status": "submitted",
    "submittedOn": "2026-02-10T14:30:00.000Z",
    "submissionNotes": "Here is my solution",
    "submissionFile": "https://drive.google.com/file/xyz123"
  }
}
```

---

### 9. Review Assignment Submission (NEW)
**Endpoint:** `POST /assignments/:assignmentId/review`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** instructor, ADMIN, COUNSELLOR

**URL Parameters:**
- `assignmentId` - Assignment ID

**Request Body:**
```json
{
  "instructorComments": "Good work! You covered all topics well. Grade: A"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Assignment reviewed for John Student",
  "data": {
    "id": 1,
    "title": "Assignment 1",
    "status": "reviewed",
    "reviewedBy": {
      "id": 5,
      "name": "Dr. Smith",
      "email": "smith@example.com"
    },
    "reviewedOn": "2026-02-11T10:00:00.000Z",
    "instructorComments": "Good work! Grade: A",
    "enquiry": {
      "id": 1,
      "name": "John Student"
    }
  }
}
```

---

### 10. Get Submissions Pending Review (NEW)
**Endpoint:** `GET /assignments/submissions/pending-review`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** instructor, ADMIN, COUNSELLOR

**Description:** 
- Instructors see only pending submissions for their assignments
- Admin/Counsellor see all pending submissions

**Response (Success - 200):**
```json
{
  "success": true,
  "total": 3,
  "message": "Found 3 submissions pending review",
  "data": [
    {
      "id": 1,
      "title": "Assignment 1",
      "status": "submitted",
      "submittedOn": "2026-02-10T14:30:00.000Z",
      "submissionNotes": "My solution",
      "enquiry": {
        "id": 1,
        "name": "John Student",
        "email": "john@example.com"
      },
      "subject": {
        "id": 1,
        "name": "Python Programming"
      }
    }
  ]
}
```

---

### 11. Get Reviewed Assignments (NEW)
**Endpoint:** `GET /assignments/submissions/reviewed`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** instructor, ADMIN, COUNSELLOR

**Description:**
- Instructors see assignments they reviewed
- Admin/Counsellor see all reviewed assignments

**Response (Success - 200):**
```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "id": 1,
      "title": "Assignment 1",
      "status": "reviewed",
      "submittedOn": "2026-02-10T14:30:00.000Z",
      "reviewedOn": "2026-02-11T10:00:00.000Z",
      "instructorComments": "Good work! Grade: A",
      "enquiry": {
        "id": 1,
        "name": "John Student"
      },
      "reviewer": {
        "id": 5,
        "name": "Dr. Smith",
        "email": "smith@example.com"
      }
    }
  ]
}
```

---

## Instructors

### 1. Assign Subject to Instructor
**Endpoint:** `POST /instructors/assign-subject`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR

**Request Body:**
```json
{
  "userId": 2,
  "subjectId": 1
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Subject assigned to instructor successfully",
  "assignment": {
    "id": 1,
    "userId": 2,
    "subjectId": 1
  }
}
```

---

### 2. Get My Subjects (Instructor)
**Endpoint:** `GET /instructors/my-subjects`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "success": true,
  "subjects": [
    {
      "id": 1,
      "name": "Python Programming",
      "code": "PY101",
      "description": "Learn Python basics"
    }
  ]
}
```

---

### 3. Get Subject Detail
**Endpoint:** `GET /instructors/subject/:subjectId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `subjectId` - Subject ID

**Response (Success - 200):**
```json
{
  "success": true,
  "subject": {
    "id": 1,
    "name": "Python Programming",
    "code": "PY101",
    "description": "Learn Python basics",
    "syllabus": "Introduction to Python"
  }
}
```

---

## Reviews

### 1. Create Subject Review
**Endpoint:** `POST /reviews/subject/:subjectId/review`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `subjectId` - Subject ID

**Request Body:**
```json
{
  "username": "John Reviewer",
  "rating": 4.5,
  "comment": "Great course! Very helpful.",
  "image": "https://example.com/image.jpg"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "id": 1,
    "username": "John Reviewer",
    "rating": 4.5,
    "comment": "Great course!",
    "subjectId": 1
  }
}
```

---

### 2. Get Subject Reviews
**Endpoint:** `GET /reviews/subject/:subjectId/reviews`

**URL Parameters:**
- `subjectId` - Subject ID

**Response (Success - 200):**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "username": "John Reviewer",
      "rating": 4.5,
      "comment": "Great course!",
      "createdAt": "2026-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Create Package Review
**Endpoint:** `POST /reviews/package/:packageId/review`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `packageId` - Package ID

**Request Body:**
```json
{
  "username": "Jane Reviewer",
  "rating": 4.8,
  "comment": "Best package ever!",
  "image": "https://example.com/image.jpg"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "review": {
    "id": 2,
    "username": "Jane Reviewer",
    "rating": 4.8,
    "packageId": 1
  }
}
```

---

### 4. Get Package Reviews
**Endpoint:** `GET /reviews/package/:packageId/reviews`

**URL Parameters:**
- `packageId` - Package ID

**Response (Success - 200):**
```json
{
  "success": true,
  "reviews": [
    {
      "id": 2,
      "username": "Jane Reviewer",
      "rating": 4.8,
      "comment": "Best package!",
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

---

### 5. Get Review by ID
**Endpoint:** `GET /reviews/:reviewId`

**URL Parameters:**
- `reviewId` - Review ID

**Response (Success - 200):**
```json
{
  "success": true,
  "review": {
    "id": 1,
    "username": "John Reviewer",
    "rating": 4.5,
    "comment": "Great course!"
  }
}
```

---

### 6. Update Review
**Endpoint:** `PUT /reviews/:reviewId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `reviewId` - Review ID

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent course! Updated review."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Review updated successfully"
}
```

---

### 7. Delete Review
**Endpoint:** `DELETE /reviews/:reviewId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `reviewId` - Review ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

## Billing

### 1. Get All Billings
**Endpoint:** `GET /billings`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, ACCOUNTS

**Response (Success - 200):**
```json
{
  "success": true,
  "billings": [
    {
      "id": 1,
      "enquiryId": 1,
      "amount": 5000,
      "paymentStatus": "paid",
      "invoiceNumber": "INV001",
      "paymentDate": "2026-01-15"
    }
  ]
}
```

---

### 2. Get Billing by Enquiry ID
**Endpoint:** `GET /billings/enquiry/:enquiryId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, ACCOUNTS

**URL Parameters:**
- `enquiryId` - Enquiry ID

**Response (Success - 200):**
```json
{
  "success": true,
  "billing": {
    "id": 1,
    "enquiryId": 1,
    "amount": 5000,
    "paymentStatus": "paid"
  }
}
```

---

### 3. Get Billing by ID
**Endpoint:** `GET /billings/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, ACCOUNTS

**URL Parameters:**
- `id` - Billing ID

**Response (Success - 200):**
```json
{
  "success": true,
  "billing": {
    "id": 1,
    "enquiryId": 1,
    "amount": 5000,
    "paymentStatus": "paid"
  }
}
```

---

### 4. Create or Update Billing
**Endpoint:** `POST /billings`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, ACCOUNTS

**Request Body:**
```json
{
  "enquiryId": 1,
  "amount": 5000,
  "paymentStatus": "paid",
  "invoiceNumber": "INV001",
  "paymentDate": "2026-01-15",
  "description": "Payment for Python package"
}
```

**Valid Payment Status:** `pending`, `paid`, `failed`, `refunded`

**Response (Success - 201 or 200):**
```json
{
  "success": true,
  "message": "Billing created/updated successfully",
  "billing": {
    "id": 1,
    "enquiryId": 1,
    "amount": 5000,
    "paymentStatus": "paid"
  }
}
```

---

### 5. Delete Billing
**Endpoint:** `DELETE /billings/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN

**URL Parameters:**
- `id` - Billing ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Billing deleted successfully"
}
```

---

## Logs

### 1. Get Logs by Enquiry ID
**Endpoint:** `GET /logs/:enquiryId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `enquiryId` - Enquiry ID

**Response (Success - 200):**
```json
{
  "success": true,
  "logs": [
    {
      "id": 1,
      "enquiryId": 1,
      "action": "Enquiry created",
      "details": "New enquiry for Python course",
      "createdAt": "2026-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Create Log
**Endpoint:** `POST /logs`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "enquiryId": 1,
  "action": "Status changed",
  "details": "Changed from inquiry to enrolled"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Log created successfully",
  "log": {
    "id": 2,
    "enquiryId": 1,
    "action": "Status changed"
  }
}
```

---

### 3. Update Log
**Endpoint:** `PUT /logs/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Log ID

**Request Body:**
```json
{
  "action": "Updated action",
  "details": "Updated details"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Log updated successfully"
}
```

---

### 4. Delete Log
**Endpoint:** `DELETE /logs/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN

**URL Parameters:**
- `id` - Log ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Log deleted successfully"
}
```

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication Header Format

All protected endpoints require the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

Get the token from `/auth/login` endpoint.

---

## Mock Interviews

### 1. Schedule Mock Interview
**Endpoint:** `POST /mock-interviews/schedule`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** instructor, ADMIN, COUNSELLOR

**Description:** Schedule a mock interview for a student (must have candidateStatus='class')

**Request Body:**
```json
{
  "batchId": 1,
  "enquiryId": 1,
  "interviewDate": "2026-02-15",
  "interviewTime": "10:00:00",
  "mode": "online",
  "interviewLink": "https://meet.google.com/abc-def-ghi",
  "documentUpload": "https://drive.google.com/file/interview-doc"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Mock interview scheduled successfully",
  "data": {
    "id": 1,
    "batchId": 1,
    "enquiryId": 1,
    "studentName": "John Student",
    "studentEmail": "john@example.com",
    "interviewDate": "2026-02-15",
    "interviewTime": "10:00:00",
    "mode": "online",
    "status": "scheduled",
    "interviewLink": "https://meet.google.com/abc-def-ghi"
  }
}
```

---

### 2. Get All Mock Interviews
**Endpoint:** `GET /mock-interviews`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Description:**
- Instructors see only their scheduled interviews
- Admin/Counsellor see all interviews

**Response (Success - 200):**
```json
{
  "success": true,
  "total": 5,
  "data": [
    {
      "id": 1,
      "studentName": "John Student",
      "studentEmail": "john@example.com",
      "interviewDate": "2026-02-15",
      "interviewTime": "10:00:00",
      "mode": "online",
      "status": "scheduled",
      "batch": {
        "id": 1,
        "name": "Python Batch 101"
      },
      "enquiry": {
        "id": 1,
        "name": "John Student"
      }
    }
  ]
}
```

---

### 3. Get Mock Interview by ID
**Endpoint:** `GET /mock-interviews/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Mock Interview ID

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentName": "John Student",
    "studentEmail": "john@example.com",
    "interviewDate": "2026-02-15",
    "interviewTime": "10:00:00",
    "mode": "online",
    "status": "attended",
    "feedback": "Good performance, needs improvement in system design",
    "score": 8,
    "outOf": 10
  }
}
```

---

### 4. Get Mock Interviews by Batch
**Endpoint:** `GET /mock-interviews/batch/:batchId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `batchId` - Batch ID

**Response (Success - 200):**
```json
{
  "success": true,
  "total": 3,
  "data": [
    {
      "id": 1,
      "studentName": "John Student",
      "status": "attended",
      "interviewDate": "2026-02-15"
    }
  ]
}
```

---

### 5. Update Mock Interview
**Endpoint:** `PUT /mock-interviews/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Mock Interview ID

**Request Body:**
```json
{
  "interviewDate": "2026-02-20",
  "interviewTime": "14:00:00",
  "mode": "offline",
  "interviewLink": "Office - Room 101",
  "documentUpload": "https://drive.google.com/file/updated-doc"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Mock interview updated successfully",
  "data": {
    "id": 1,
    "interviewDate": "2026-02-20",
    "interviewTime": "14:00:00",
    "mode": "offline"
  }
}
```

---

### 6. Update Interview Status (Mark Attended/Not Attended)
**Endpoint:** `PATCH /mock-interviews/:id/status`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** instructor, ADMIN, COUNSELLOR

**URL Parameters:**
- `id` - Mock Interview ID

**Request Body:**
```json
{
  "status": "attended",
  "feedback": "Excellent performance! Well prepared and showed great problem-solving skills.",
  "score": 9
}
```

**Valid Status Values:** `attended`, `not-attended`, `cancelled`, `scheduled`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Interview marked as attended",
  "data": {
    "id": 1,
    "status": "attended",
    "feedback": "Excellent performance!",
    "score": 9,
    "outOf": 10,
    "enquiry": {
      "id": 1,
      "name": "John Student"
    },
    "instructor": {
      "id": 5,
      "name": "Dr. Smith"
    }
  }
}
```

---

### 7. Delete Mock Interview
**Endpoint:** `DELETE /mock-interviews/:id`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** instructor, ADMIN, COUNSELLOR

**URL Parameters:**
- `id` - Mock Interview ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Mock interview deleted successfully"
}
```

---

### 8. Get Interview Statistics for Instructor
**Endpoint:** `GET /mock-interviews/statistics/instructor`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Description:** Get statistics for logged-in instructor or specify instructorId as query param for admin/counsellor

**Query Parameters (Optional):**
- `instructorId` - For admin/counsellor to view other instructor's stats

**Response (Success - 200):**
```json
{
  "success": true,
  "statistics": {
    "totalInterviewsScheduled": 5,
    "totalInterviewsAttended": 3,
    "totalInterviewsNotAttended": 1,
    "totalInterviewsCancelled": 0,
    "totalOverall": 5
  },
  "details": {
    "scheduled": [
      {
        "id": 2,
        "studentName": "Jane Student",
        "interviewDate": "2026-02-20",
        "status": "scheduled"
      }
    ],
    "attended": [
      {
        "id": 1,
        "studentName": "John Student",
        "status": "attended",
        "score": 9
      }
    ],
    "notAttended": [
      {
        "id": 3,
        "studentName": "Mike Student",
        "status": "not-attended"
      }
    ]
  }
}
```

---

### 9. Get Interview Statistics for Batch
**Endpoint:** `GET /mock-interviews/statistics/batch/:batchId`

**Headers Required:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `batchId` - Batch ID

**Response (Success - 200):**
```json
{
  "success": true,
  "statistics": {
    "totalScheduled": 10,
    "totalAttended": 8,
    "totalNotAttended": 2,
    "totalOverall": 10,
    "averageScore": "8.50"
  }
}
```

---

### 10. Get System Wide Interview Statistics
**Endpoint:** `GET /mock-interviews/statistics/system`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Role Required:** ADMIN, COUNSELLOR

**Description:** Get overall system statistics and per-instructor breakdown

**Response (Success - 200):**
```json
{
  "success": true,
  "systemStatistics": {
    "totalInterviewsScheduled": 20,
    "totalInterviewsAttended": 15,
    "totalInterviewsNotAttended": 3,
    "totalOverall": 20,
    "completionRate": "75.00"
  },
  "instructorStatistics": [
    {
      "id": 5,
      "name": "Dr. Smith",
      "totalScheduled": 10,
      "totalAttended": 9,
      "totalNotAttended": 1
    },
    {
      "id": 6,
      "name": "Prof. John",
      "totalScheduled": 8,
      "totalAttended": 6,
      "totalNotAttended": 2
    }
  ]
}
```

---

## Mock Interview Table Structure

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| batchId | Integer | FK to batches |
| enquiryId | Integer | FK to enquiries (student) |
| instructorId | Integer | FK to users (instructor) |
| studentName | String | Student name from enquiry |
| studentEmail | String | Student email from enquiry |
| interviewDate | Date | Interview date |
| interviewTime | Time | Interview time |
| mode | ENUM | 'online' or 'offline' |
| interviewLink | String | Meet link or location |
| documentUpload | String | Document/file URL |
| status | ENUM | 'scheduled', 'attended', 'not-attended', 'cancelled' |
| feedback | Text | Interviewer feedback |
| score | Integer | Score (0-10) |
| outOf | Integer | Out of 10 (default) |
| createdAt | DateTime | Created timestamp |
| updatedAt | DateTime | Updated timestamp |

---

## Testing Guide for Postman

### Step 1: Login and Get Token
1. Create POST request to `http://localhost:5000/api/auth/login`
2. Add body:
```json
{
  "email": "admin@example.com",
  "password": "admin"
}
```
3. Copy the `token` from response
4. In Postman, go to "Authorization" tab
5. Select "Bearer Token" type
6. Paste the token

### Step 2: Test Assignment Submission Flow
1. **Create Assignment** - POST `/assignments/create` with batchId, title, dueDate
2. **Submit Assignment** - POST `/assignments/:assignmentId/submit` with submissionNotes, submissionFile
3. **Get Pending Review** - GET `/assignments/submissions/pending-review`
4. **Review Assignment** - POST `/assignments/:assignmentId/review` with instructorComments
5. **Get Reviewed** - GET `/assignments/submissions/reviewed`

### Step 3: Test Mock Interview Flow
1. **Schedule Interview** - POST `/mock-interviews/schedule` with batchId, enquiryId, date, time, mode
2. **Get All Interviews** - GET `/mock-interviews`
3. **Get Pending (Scheduled)** - Use filter on status="scheduled"
4. **Mark as Attended** - PATCH `/mock-interviews/:id/status` with status, feedback, score
5. **Get Statistics** - GET `/mock-interviews/statistics/instructor` or `/statistics/system`

---

This documentation covers all 12 route files with complete request/response examples. Use this for comprehensive testing in Postman!
