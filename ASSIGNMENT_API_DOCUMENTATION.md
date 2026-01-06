# Assignment, Assignment Response & Materials API Documentation

## Base URL
```
http://localhost:3000/api
https://enquiry-node.vercel.app/api
```

---

## Table of Contents
1. [Assignment APIs](#assignment-apis)
2. [Assignment Response APIs](#assignment-response-apis)
3. [Materials APIs](#materials-apis)

---

# Assignment APIs

## 1. Create Assignment
**POST** `/assignments/create`

**Authentication:** Required (Instructor, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Request Body (Form-Data):**
```
batchId: 1
title: "Assignment 1"
description: "Complete the given task"
dueDate: "2024-01-20"
assignmentFile: [file] (optional)
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/assignments/create \
  -H "Authorization: Bearer {token}" \
  -F "batchId=1" \
  -F "title=Assignment 1" \
  -F "description=Complete the given task" \
  -F "dueDate=2024-01-20" \
  -F "assignmentFile=@file.pdf"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "id": 1,
    "title": "Assignment 1",
    "description": "Complete the given task",
    "dueDate": "2024-01-20",
    "batchId": 1,
    "subjectId": 5,
    "createdBy": 3,
    "assignmentFile": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "batchId, title, and dueDate are required"
}
```

**Error Response (403):**
```json
{
  "message": "Access denied. You can only create assignments for your own batches."
}
```

---

## 2. Get Batches by Instructor and Subject
**GET** `/assignments/batches-by-instructor-subject`

**Authentication:** Not Required

**Query Parameters:**
```
instructorId: 3 (required)
subjectId: 5 (required)
```

**Example URL:**
```
GET /assignments/batches-by-instructor-subject?instructorId=3&subjectId=5
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/assignments/batches-by-instructor-subject?instructorId=3&subjectId=5"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Batches retrieved successfully",
  "total": 2,
  "data": [
    {
      "id": 1,
      "name": "Batch A",
      "code": "BATCH001",
      "sessionDate": "2024-01-15",
      "sessionTime": "10:00",
      "status": "ongoing",
      "approvalStatus": "approved",
      "numberOfStudents": 25,
      "sessionLink": "https://meet.google.com/...",
      "createdBy": 3,
      "subjectId": 5,
      "subject": {
        "id": 5,
        "name": "Mathematics",
        "code": "MATH101",
        "image": "https://...",
        "overview": "Basic mathematics",
        "syllabus": "...",
        "prerequisites": "...",
        "startDate": "2024-01-10"
      },
      "creator": {
        "id": 3,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "instructorId and subjectId are required as query parameters"
}
```

---

## 3. Get Assignments for a Batch
**GET** `/assignments/batch/:batchId`

**Authentication:** Not Required

**URL Parameters:**
```
batchId: 1 (required)
```

**Example URL:**
```
GET /assignments/batch/1
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/assignments/batch/1
```

**Success Response (200):**
```json
{
  "success": true,
  "total": 3,
  "batchName": "Batch A",
  "batchCode": "BATCH001",
  "data": [
    {
      "id": 1,
      "title": "Assignment 1",
      "description": "Complete the given task",
      "dueDate": "2024-01-20",
      "batchId": 1,
      "subjectId": 5,
      "createdBy": 3,
      "assignmentFile": "https://res.cloudinary.com/...",
      "createdAt": "2024-01-10T10:00:00Z",
      "batch": {
        "id": 1,
        "name": "Batch A",
        "code": "BATCH001"
      },
      "subject": {
        "id": 5,
        "name": "Mathematics",
        "code": "MATH101"
      },
      "instructor": {
        "id": 3,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Error Response (404):**
```json
{
  "message": "Batch not found"
}
```

---

## 4. Get Single Assignment
**GET** `/assignments/:assignmentId`

**Authentication:** Not Required

**URL Parameters:**
```
assignmentId: 1 (required)
```

**Example URL:**
```
GET /assignments/1
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/assignments/1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Assignment 1",
    "description": "Complete the given task",
    "dueDate": "2024-01-20",
    "batchId": 1,
    "subjectId": 5,
    "createdBy": 3,
    "assignmentFile": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-10T10:00:00Z",
    "batch": {
      "id": 1,
      "name": "Batch A",
      "code": "BATCH001",
      "sessionDate": "2024-01-15",
      "sessionTime": "10:00"
    },
    "subject": {
      "id": 5,
      "name": "Mathematics",
      "code": "MATH101",
      "image": "https://..."
    },
    "instructor": {
      "id": 3,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

## 5. Update Assignment
**PUT** `/assignments/:assignmentId`

**Authentication:** Required (Creator, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**URL Parameters:**
```
assignmentId: 1 (required)
```

**Request Body:**
```json
{
  "title": "Updated Assignment Title",
  "description": "Updated description",
  "dueDate": "2024-01-25"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/assignments/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Assignment Title",
    "description": "Updated description",
    "dueDate": "2024-01-25"
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assignment updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Assignment Title",
    "description": "Updated description",
    "dueDate": "2024-01-25",
    "batchId": 1,
    "subjectId": 5,
    "createdBy": 3,
    "assignmentFile": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T11:00:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "message": "Access denied"
}
```

---

## 6. Delete Assignment
**DELETE** `/assignments/:assignmentId`

**Authentication:** Required (Creator, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}"
}
```

**URL Parameters:**
```
assignmentId: 1 (required)
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/assignments/1 \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assignment deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Assignment not found"
}
```

---

# Assignment Response APIs

## 1. Create Assignment Response (Student Submission)
**POST** `/assignment-responses/`

**Authentication:** Required (Student/Enquiry)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Request Body (Form-Data):**
```
assignmentId: 1 (required)
batchId: 1 (required)
enquiryId: 10 (optional)
submissionNotes: "Completed as per requirements"
submissionFile: [file] (optional)
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/assignment-responses/ \
  -H "Authorization: Bearer {token}" \
  -F "assignmentId=1" \
  -F "batchId=1" \
  -F "enquiryId=10" \
  -F "submissionNotes=Completed as per requirements" \
  -F "submissionFile=@solution.pdf"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Assignment response submitted successfully",
  "data": {
    "id": 1,
    "assignmentId": 1,
    "batchId": 1,
    "enquiryId": 10,
    "submissionNotes": "Completed as per requirements",
    "submissionFile": "https://res.cloudinary.com/...",
    "status": "submitted",
    "submittedOn": "2024-01-18T10:00:00Z",
    "reviewedBy": null,
    "reviewedOn": null,
    "instructorComments": null,
    "createdAt": "2024-01-18T10:00:00Z",
    "updatedAt": "2024-01-18T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "assignmentId and batchId are required"
}
```

---

## 2. Get Instructor Assignment Submissions
**GET** `/assignment-responses/instructor/submissions/:assignmentId`

**Authentication:** Required (Instructor, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}"
}
```

**URL Parameters:**
```
assignmentId: 1 (required)
```

**Example URL:**
```
GET /assignment-responses/instructor/submissions/1
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/assignment-responses/instructor/submissions/1 \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assignment submissions retrieved successfully",
  "assignment": {
    "id": 1,
    "title": "Assignment 1",
    "dueDate": "2024-01-20",
    "batch": {
      "id": 1,
      "name": "Batch A",
      "code": "BATCH001",
      "createdBy": 3
    }
  },
  "statistics": {
    "total": 25,
    "submitted": 20,
    "reviewed": 15,
    "pending": 5
  },
  "submissions": [
    {
      "id": 1,
      "assignmentId": 1,
      "batchId": 1,
      "enquiryId": 10,
      "submissionNotes": "Completed as per requirements",
      "submissionFile": "https://res.cloudinary.com/...",
      "status": "submitted",
      "submittedOn": "2024-01-18T10:00:00Z",
      "reviewedBy": null,
      "reviewedOn": null,
      "instructorComments": null,
      "assignment": {
        "id": 1,
        "title": "Assignment 1",
        "description": "Complete the task",
        "dueDate": "2024-01-20"
      },
      "enquiry": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210"
      },
      "batch": {
        "id": 1,
        "name": "Batch A",
        "code": "BATCH001"
      },
      "reviewer": null
    }
  ]
}
```

---

## 3. Get Assignment Responses by Batch and Subject
**GET** `/assignment-responses/batch-subject`

**Authentication:** Not Required

**Query Parameters:**
```
batchId: 1 (required)
subjectId: 5 (required)
```

**Example URL:**
```
GET /assignment-responses/batch-subject?batchId=1&subjectId=5
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/assignment-responses/batch-subject?batchId=1&subjectId=5"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assignment responses retrieved successfully",
  "total": 3,
  "batchId": "1",
  "subjectId": "5",
  "data": [
    {
      "id": 1,
      "assignmentId": 1,
      "batchId": 1,
      "enquiryId": 10,
      "submissionNotes": "Completed as per requirements",
      "submissionFile": "https://res.cloudinary.com/...",
      "status": "submitted",
      "submittedOn": "2024-01-18T10:00:00Z",
      "reviewedBy": null,
      "reviewedOn": null,
      "instructorComments": null,
      "assignment": {
        "id": 1,
        "title": "Assignment 1",
        "description": "Complete the task",
        "dueDate": "2024-01-20",
        "batchId": 1
      },
      "enquiry": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com",
        "candidateStatus": "class"
      },
      "reviewer": null
    }
  ]
}
```

---

## 4. Get Instructor Comments by Assignment
**GET** `/assignment-responses/:assignmentId/comments`

**Authentication:** Not Required

**URL Parameters:**
```
assignmentId: 1 (required)
```

**Example URL:**
```
GET /assignment-responses/1/comments
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/assignment-responses/1/comments
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Instructor comments retrieved successfully",
  "assignment": {
    "id": 1,
    "title": "Assignment 1",
    "description": "Complete the task",
    "dueDate": "2024-01-20",
    "batchId": 1
  },
  "total": 2,
  "data": [
    {
      "id": 1,
      "assignmentId": 1,
      "enquiry": {
        "id": 10,
        "name": "John Doe",
        "email": "john@example.com",
        "candidateStatus": "class"
      },
      "submissionNotes": "Completed as per requirements",
      "submissionFile": "https://res.cloudinary.com/...",
      "status": "reviewed",
      "instructorComments": "Great work! Well explained. Code is clean and follows best practices.",
      "reviewer": {
        "id": 3,
        "name": "Instructor Name",
        "email": "instructor@example.com"
      },
      "reviewedOn": "2024-01-19T10:00:00Z",
      "submittedOn": "2024-01-18T10:00:00Z"
    }
  ]
}
```

---

## 5. Update Assignment Response (Add Comments & Grade)
**PUT** `/assignment-responses/:id`

**Authentication:** Required (Instructor, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**URL Parameters:**
```
id: 1 (required)
```

**Request Body:**
```json
{
  "status": "reviewed",
  "instructorComments": "Excellent submission! All requirements met. Code is well-structured and documented. Great job on error handling!"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/assignment-responses/1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "reviewed",
    "instructorComments": "Excellent submission! All requirements met."
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assignment reviewed successfully with comments added",
  "data": {
    "id": 1,
    "assignment": {
      "id": 1,
      "title": "Assignment 1",
      "description": "Complete the task",
      "dueDate": "2024-01-20"
    },
    "enquiry": {
      "id": 10,
      "name": "John Doe",
      "email": "john@example.com",
      "candidateStatus": "class"
    },
    "submissionNotes": "Completed as per requirements",
    "submissionFile": "https://res.cloudinary.com/...",
    "status": "reviewed",
    "instructorComments": "Excellent submission! All requirements met.",
    "submittedOn": "2024-01-18T10:00:00Z",
    "reviewer": {
      "id": 3,
      "name": "Instructor Name",
      "email": "instructor@example.com"
    },
    "reviewedOn": "2024-01-19T10:00:00Z"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. You can only review assignments you created."
}
```

---

## 6. Delete Assignment Response
**DELETE** `/assignment-responses/:id`

**Authentication:** Required (Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}"
}
```

**URL Parameters:**
```
id: 1 (required)
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/assignment-responses/1 \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Assignment response deleted successfully"
}
```

---

# Materials APIs

## 1. Create Material
**POST** `/materials`

**Authentication:** Required (Instructor, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**Request Body (Form-Data):**
```
title: "Chapter 1 - Introduction" (required)
description: "Introduction to the course" (required)
subjectId: 5 (required)
batchId: 1 (optional)
instructorId: 3 (required)
documentFile: [file] (required)
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/materials \
  -H "Authorization: Bearer {token}" \
  -F "title=Chapter 1 - Introduction" \
  -F "description=Introduction to the course" \
  -F "subjectId=5" \
  -F "batchId=1" \
  -F "instructorId=3" \
  -F "documentFile=@chapter1.pdf"
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Material created successfully",
  "data": {
    "id": 1,
    "title": "Chapter 1 - Introduction",
    "description": "Introduction to the course",
    "subjectId": 5,
    "batchId": 1,
    "instructorId": 3,
    "documentUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "title, description, subjectId, instructorId, and documentFile are required"
}
```

---

## 2. Get All Materials
**GET** `/materials`

**Authentication:** Not Required

**Query Parameters (Optional):**
```
subjectId: 5
batchId: 1
instructorId: 3
limit: 10
offset: 0
```

**Example URL:**
```
GET /materials?subjectId=5&batchId=1
```

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/materials?subjectId=5&batchId=1"
```

**Success Response (200):**
```json
{
  "success": true,
  "total": 5,
  "data": [
    {
      "id": 1,
      "title": "Chapter 1 - Introduction",
      "description": "Introduction to the course",
      "subjectId": 5,
      "batchId": 1,
      "instructorId": 3,
      "documentUrl": "https://res.cloudinary.com/...",
      "createdAt": "2024-01-10T10:00:00Z",
      "updatedAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

## 3. Get Material by ID
**GET** `/materials/:materialId`

**Authentication:** Not Required

**URL Parameters:**
```
materialId: 1 (required)
```

**Example URL:**
```
GET /materials/1
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/materials/1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Chapter 1 - Introduction",
    "description": "Introduction to the course",
    "subjectId": 5,
    "batchId": 1,
    "instructorId": 3,
    "documentUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Material not found"
}
```

---

## 4. Get Materials by Subject
**GET** `/materials/subject/:subjectId`

**Authentication:** Not Required

**URL Parameters:**
```
subjectId: 5 (required)
```

**Example URL:**
```
GET /materials/subject/5
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/materials/subject/5
```

**Success Response (200):**
```json
{
  "success": true,
  "total": 3,
  "subjectName": "Mathematics",
  "subjectCode": "MATH101",
  "data": [
    {
      "id": 1,
      "title": "Chapter 1 - Introduction",
      "description": "Introduction to the course",
      "subjectId": 5,
      "batchId": 1,
      "instructorId": 3,
      "documentUrl": "https://res.cloudinary.com/...",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

## 5. Get Materials by Batch
**GET** `/materials/batch/:batchId`

**Authentication:** Not Required

**URL Parameters:**
```
batchId: 1 (required)
```

**Example URL:**
```
GET /materials/batch/1
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/materials/batch/1
```

**Success Response (200):**
```json
{
  "success": true,
  "total": 2,
  "batchName": "Batch A",
  "batchCode": "BATCH001",
  "data": [
    {
      "id": 1,
      "title": "Chapter 1 - Introduction",
      "description": "Introduction to the course",
      "subjectId": 5,
      "batchId": 1,
      "instructorId": 3,
      "documentUrl": "https://res.cloudinary.com/...",
      "createdAt": "2024-01-10T10:00:00Z"
    }
  ]
}
```

---

## 6. Update Material
**PUT** `/materials/:materialId`

**Authentication:** Required (Creator, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "multipart/form-data"
}
```

**URL Parameters:**
```
materialId: 1 (required)
```

**Request Body (Form-Data):**
```
title: "Chapter 1 - Introduction (Updated)" (optional)
description: "Updated description" (optional)
documentFile: [file] (optional)
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/materials/1 \
  -H "Authorization: Bearer {token}" \
  -F "title=Chapter 1 - Introduction (Updated)" \
  -F "description=Updated description" \
  -F "documentFile=@chapter1_updated.pdf"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Material updated successfully",
  "data": {
    "id": 1,
    "title": "Chapter 1 - Introduction (Updated)",
    "description": "Updated description",
    "subjectId": 5,
    "batchId": 1,
    "instructorId": 3,
    "documentUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T11:00:00Z"
  }
}
```

---

## 7. Delete Material
**DELETE** `/materials/:materialId`

**Authentication:** Required (Creator, Admin, Counsellor)

**Headers:**
```json
{
  "Authorization": "Bearer {token}"
}
```

**URL Parameters:**
```
materialId: 1 (required)
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/api/materials/1 \
  -H "Authorization: Bearer {token}"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Material deleted successfully"
}
```

**Error Response (404):**
```json
{
  "message": "Material not found"
}
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized - Invalid or missing token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Assignment Response Status Values
- `assigned` - Assignment assigned to student
- `submitted` - Student has submitted the assignment
- `reviewed` - Instructor has reviewed and graded the assignment

---

## Candidate Status Values
- `class` - Student admitted to class
- `class qualified` - Student qualified for class
- `rejected` - Student rejected
- `pending` - Application pending

---

## Role-Based Access Control

### Assignment Creation
- **ADMIN** - Can create assignments
- **COUNSELLOR** - Can create assignments
- **INSTRUCTOR** - Can create assignments for their own batches

### Assignment Response Review
- **INSTRUCTOR** - Can review submissions for assignments they created
- **ADMIN** - Can review all submissions
- **COUNSELLOR** - Can review all submissions

### Material Management
- **INSTRUCTOR** - Can create/update materials for their subjects/batches
- **ADMIN** - Can manage all materials
- **COUNSELLOR** - Can manage all materials

---

## File Upload Specifications

### Assignment File
- **Max Size**: 10 MB
- **Supported Formats**: PDF, DOC, DOCX, TXT, ZIP
- **Storage**: Cloudinary
- **Naming Convention**: `assignment-{batchId}-{timestamp}`

### Assignment Response File
- **Max Size**: 10 MB
- **Supported Formats**: PDF, DOC, DOCX, TXT, ZIP, Images
- **Storage**: Cloudinary
- **Naming Convention**: `assignment-response-{assignmentId}-{enquiryId}-{timestamp}`

### Material Document
- **Max Size**: 10 MB
- **Supported Formats**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
- **Storage**: Cloudinary
- **Naming Convention**: `material-{title}-{timestamp}`

---

## Notes
- All timestamps are in ISO 8601 format (UTC)
- Authorization token should be included in the `Authorization` header as `Bearer {token}`
- File uploads require `multipart/form-data` content type
- All endpoints support CORS for cross-origin requests
