# Enquiry-Assignment Relationship Documentation

## Overview
This document explains the new relationship between the **Enquiry** and **Assignment** models, enabling instructors to assign assignments to candidates (enquiries) with 'class' status.

---

## Database Schema

### Relationship Diagram
```
ENQUIRY (One)
    |
    | has many
    |
ASSIGNMENT (Many)
    |
    |--- belongs to BATCH
    |--- belongs to SUBJECT
    |--- belongs to USER (created by instructor)
```

### Assignment Table Structure (Updated)
```sql
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  createdDate DATE DEFAULT NOW(),
  dueDate DATE NOT NULL,
  batchId INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  subjectId INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  createdBy INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  enquiryId INTEGER REFERENCES enquiries(id) ON DELETE CASCADE,  -- NEW
  createdAt DATE DEFAULT NOW(),
  updatedAt DATE DEFAULT NOW()
);
```

### Enquiry Candidate Status Values
Valid `candidateStatus` values in the enquiry table:
- `demo` - Initial enquiry stage
- `qualified demo` - Passed demo
- `class` - **Currently in class** (Can be assigned)
- `class qualified` - **Completed class successfully** (Can be assigned)
- `placement` - Placed in job
- `enquiry stage` - Early stage enquiry

---

## API Endpoints

### 1. Assign Assignment to Enquiry
**Endpoint:** `POST /api/assignments/enquiry/assign`

**Authentication:** Required (ADMIN/COUNSELLOR only)

**Request Body:**
```json
{
  "assignmentId": 1,
  "enquiryId": 5
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Assignment assigned to enquiry John Doe",
  "data": {
    "id": 1,
    "title": "Math Homework",
    "description": "Solve equations chapter 5",
    "dueDate": "2026-01-15",
    "batchId": 1,
    "subjectId": 2,
    "enquiryId": 5,
    "batch": { "id": 1, "name": "Batch A", "code": "BATCH001" },
    "subject": { "id": 2, "name": "Mathematics", "code": "MATH101" },
    "instructor": { "id": 3, "name": "Rajesh Kumar", "email": "rajesh@example.com" },
    "enquiry": { "id": 5, "name": "John Doe", "email": "john@example.com", "candidateStatus": "class" }
  }
}
```

**Response (Error - Invalid Status):**
```json
{
  "message": "Enquiry must have 'class' or 'class qualified' status. Current status: demo"
}
```

**Response (Error - Unauthorized):**
```json
{
  "message": "Only admin or counsellor can assign assignments to enquiries"
}
```

---

### 2. Get Assignments for a Specific Enquiry (Candidate)
**Endpoint:** `GET /api/assignments/enquiry/:enquiryId`

**Authentication:** Not required

**Parameters:**
- `enquiryId` (path parameter): ID of the enquiry/candidate

**Response (Success):**
```json
{
  "success": true,
  "enquiryName": "John Doe",
  "candidateStatus": "class",
  "total": 3,
  "data": [
    {
      "id": 1,
      "title": "Math Homework",
      "description": "Solve equations chapter 5",
      "createdDate": "2026-01-01",
      "dueDate": "2026-01-15",
      "batch": { "id": 1, "name": "Batch A", "code": "BATCH001" },
      "subject": { "id": 2, "name": "Mathematics", "code": "MATH101" },
      "instructor": { "id": 3, "name": "Rajesh Kumar", "email": "rajesh@example.com" }
    },
    {
      "id": 2,
      "title": "Physics Project",
      "description": "Research on quantum mechanics",
      "createdDate": "2026-01-02",
      "dueDate": "2026-01-20",
      "batch": { "id": 1, "name": "Batch A", "code": "BATCH001" },
      "subject": { "id": 3, "name": "Physics", "code": "PHY101" },
      "instructor": { "id": 3, "name": "Rajesh Kumar", "email": "rajesh@example.com" }
    }
  ]
}
```

---

### 3. Get All Class Candidates with Their Assignments
**Endpoint:** `GET /api/assignments/enquiry/candidates/with-assignments`

**Authentication:** Required (ADMIN/COUNSELLOR only)

**Query Parameters:** None

**Response (Success):**
```json
{
  "success": true,
  "total": 2,
  "message": "Found 2 candidates with class status",
  "data": [
    {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com",
      "candidateStatus": "class",
      "phone": "9876543210",
      "assignments": [
        {
          "id": 1,
          "title": "Math Homework",
          "description": "Solve equations chapter 5",
          "createdDate": "2026-01-01",
          "dueDate": "2026-01-15",
          "batch": { "id": 1, "name": "Batch A", "code": "BATCH001" },
          "subject": { "id": 2, "name": "Mathematics", "code": "MATH101" }
        }
      ]
    },
    {
      "id": 6,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "candidateStatus": "class qualified",
      "phone": "9876543211",
      "assignments": [
        {
          "id": 2,
          "title": "Physics Project",
          "description": "Research on quantum mechanics",
          "createdDate": "2026-01-02",
          "dueDate": "2026-01-20",
          "batch": { "id": 1, "name": "Batch A", "code": "BATCH001" },
          "subject": { "id": 3, "name": "Physics", "code": "PHY101" }
        }
      ]
    }
  ]
}
```

---

## Use Cases

### Use Case 1: Assigning Homework to In-Class Candidates
1. Instructor creates an assignment for a batch
2. Admin/Counsellor views all candidates with 'class' status
3. Admin/Counsellor assigns the assignment to specific candidates
4. Candidates can fetch their assigned assignments

### Use Case 2: Tracking Candidate Progress
1. Counsellor wants to know which assignments are given to candidate "John Doe"
2. Calls: `GET /api/assignments/enquiry/5`
3. Gets list of all assignments assigned to John

### Use Case 3: Bulk View of Class Candidates
1. Admin/Counsellor wants to see all candidates currently in class
2. Calls: `GET /api/assignments/enquiry/candidates/with-assignments`
3. Gets comprehensive view of candidates and their assignments

---

## Access Control

| Role | Permission |
|------|-----------|
| ADMIN | ✅ Can assign assignments to enquiries |
| ADMIN | ✅ Can view all candidates with class status |
| ADMIN | ✅ Can view assignments for any enquiry |
| COUNSELLOR | ✅ Can assign assignments to enquiries |
| COUNSELLOR | ✅ Can view all candidates with class status |
| COUNSELLOR | ✅ Can view assignments for any enquiry |
| instructor | ❌ Cannot assign to enquiries (creates for batches only) |
| User | ❌ Cannot assign to enquiries |

---

## Database Relationships

### Enquiry Model
```javascript
db.Enquiry.hasMany(db.Assignment, {
  foreignKey: 'enquiryId',
  onDelete: 'CASCADE',
  as: 'assignments',
});
```

### Assignment Model
```javascript
db.Assignment.belongsTo(db.Enquiry, {
  foreignKey: 'enquiryId',
  as: 'enquiry',
});
```

**Cascade Delete Behavior:**
- If an enquiry is deleted, all assignments associated with it are also deleted
- If an assignment is deleted, the enquiry remains unaffected

---

## Migration

The migration file includes the new `enquiryId` column in the assignments table:

```javascript
enquiryId: {
  type: Sequelize.INTEGER,
  allowNull: true,  // Can be null for batch-only assignments
  references: { model: 'enquiries', key: 'id' },
  onDelete: 'CASCADE',
}
```

**Run Migration:**
```bash
npx sequelize-cli db:migrate
```

---

## Example Workflow

### Step 1: Create Assignment for Batch
```json
POST /api/assignments/create
{
  "batchId": 1,
  "title": "Algebra Basics",
  "description": "Master basic algebra concepts",
  "dueDate": "2026-01-15"
}
```

### Step 2: Get Candidates with Class Status
```
GET /api/assignments/enquiry/candidates/with-assignments
```

### Step 3: Assign to Specific Candidate
```json
POST /api/assignments/enquiry/assign
{
  "assignmentId": 1,
  "enquiryId": 5
}
```

### Step 4: View Candidate's Assignments
```
GET /api/assignments/enquiry/5
```

---

## Notes

1. **Optional Field:** `enquiryId` is optional in assignments. An assignment can exist without being assigned to any enquiry (batch-level only).

2. **Candidate Status Validation:** Only enquiries with `class` or `class qualified` status can be assigned.

3. **Cascade Delete:** Deleting an enquiry will cascade delete all its assignments. Be cautious with this operation.

4. **Access Control:** Only ADMIN and COUNSELLOR roles can manage enquiry assignments.

5. **Instructor Limitation:** Instructors create assignments for batches, not for individual enquiries. Counsellors/Admins handle the assignment-to-candidate mapping.

---

## Files Modified

1. **src/models/assignment.js** - Added `enquiryId` field
2. **src/models/index.js** - Added Enquiry-Assignment association
3. **src/controllers/assignment.controller.js** - Added 3 new methods:
   - `assignToEnquiry()` - Assign assignment to enquiry
   - `getAssignmentsByEnquiry()` - Get assignments for enquiry
   - `getClassCandidatesWithAssignments()` - Get all class candidates with assignments
4. **src/routes/assignment.routes.js** - Added 3 new routes
5. **src/migrations/20260101000000-add-batch-instructor-review-and-updates.js** - Updated assignments table schema

---

## Testing Checklist

- [ ] Run migration successfully
- [ ] Create assignment for batch
- [ ] Assign to enquiry with 'class' status
- [ ] Verify error when assigning to enquiry with non-class status
- [ ] Verify only ADMIN/COUNSELLOR can assign
- [ ] Get assignments for specific enquiry
- [ ] Get all class candidates with assignments
- [ ] Test cascade delete (delete enquiry → verify assignment deleted)
- [ ] Test with multiple assignments per enquiry
