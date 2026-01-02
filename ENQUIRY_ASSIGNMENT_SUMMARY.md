# Enquiry-Assignment Relationship Implementation Summary

## Changes Made

### 1. Model Updates

#### Assignment Model (`src/models/assignment.js`)
- **Added Field:** `enquiryId` (INTEGER, nullable, foreign key to enquiries table)
- **Purpose:** Links assignments to specific enquiries/candidates
- **Cascade Delete:** When enquiry is deleted, all its assignments are deleted

#### Models Index (`src/models/index.js`)
- **Added Association:** One-to-Many relationship between Enquiry and Assignment
```javascript
db.Enquiry.hasMany(db.Assignment, {
  foreignKey: 'enquiryId',
  onDelete: 'CASCADE',
  as: 'assignments',
});
db.Assignment.belongsTo(db.Enquiry, {
  foreignKey: 'enquiryId',
  as: 'enquiry',
});
```

### 2. Controller Methods (`src/controllers/assignment.controller.js`)

#### New Method 1: `assignToEnquiry()`
- **Purpose:** Assign an assignment to an enquiry with 'class' or 'class qualified' status
- **Access:** ADMIN/COUNSELLOR only
- **Validation:** 
  - Checks if enquiry has valid status (class or class qualified)
  - Prevents assignment to enquiries in other statuses
- **Returns:** Updated assignment with all relationships

#### New Method 2: `getAssignmentsByEnquiry()`
- **Purpose:** Fetch all assignments for a specific enquiry/candidate
- **Access:** Public (no auth required)
- **Response:** List of assignments with candidate info

#### New Method 3: `getClassCandidatesWithAssignments()`
- **Purpose:** Get all enquiries with 'class' status and their assigned assignments
- **Access:** ADMIN/COUNSELLOR only
- **Response:** Comprehensive list of candidates with their assignments

### 3. New API Routes (`src/routes/assignment.routes.js`)

| HTTP Method | Endpoint | Handler | Auth | Purpose |
|----------|----------|---------|------|---------|
| POST | `/enquiry/assign` | assignToEnquiry | Required | Assign assignment to enquiry |
| GET | `/enquiry/:enquiryId` | getAssignmentsByEnquiry | None | Get assignments for enquiry |
| GET | `/enquiry/candidates/with-assignments` | getClassCandidatesWithAssignments | Required | Get all class candidates with assignments |

### 4. Migration Update (`src/migrations/20260101000000-add-batch-instructor-review-and-updates.js`)

- **Added Column:** `enquiryId` in assignments table
- **Type:** INTEGER, nullable
- **References:** enquiries table, id column
- **Cascade:** ON DELETE CASCADE

### 5. Documentation

- **Created:** `ENQUIRY_ASSIGNMENT_RELATIONSHIP.md`
- **Includes:** 
  - Database schema explanation
  - API endpoint documentation
  - Use cases
  - Access control matrix
  - Example workflow
  - Testing checklist

---

## Workflow Flow

```
ENQUIRY (Candidate Status)
    ↓
    (Status: 'class' or 'class qualified')
    ↓
Can be assigned ASSIGNMENT
    ↓
Assignment contains:
  - Title, Description
  - Due Date
  - Batch (from assignment.batchId)
  - Subject (from assignment.subjectId)
  - Created by Instructor
    ↓
Candidate can view all assignments
```

---

## Key Features

✅ **Candidate Status Validation**: Only 'class' or 'class qualified' candidates can receive assignments

✅ **Access Control**: Only ADMIN/COUNSELLOR can assign assignments to enquiries

✅ **Cascade Delete**: Deleting an enquiry automatically deletes all its assignments

✅ **Flexible Assignment**: Assignments can exist without enquiry (batch-level) or with enquiry (candidate-level)

✅ **Comprehensive Querying**: Can fetch:
   - All assignments for a specific enquiry
   - All candidates with class status
   - All assignments for all class candidates

---

## Database Impact

### Before
```
assignments table:
- id, title, description, createdDate, dueDate
- batchId (FK), subjectId (FK), createdBy (FK)
```

### After
```
assignments table:
- id, title, description, createdDate, dueDate
- batchId (FK), subjectId (FK), createdBy (FK)
- enquiryId (FK) ← NEW
```

---

## Next Steps

1. **Run Migration**
   ```bash
   npx sequelize-cli db:migrate
   ```

2. **Test Endpoints in Postman**
   - POST /api/assignments/enquiry/assign
   - GET /api/assignments/enquiry/:enquiryId
   - GET /api/assignments/enquiry/candidates/with-assignments

3. **Verify Access Control**
   - Test with ADMIN token
   - Test with COUNSELLOR token
   - Test with instructor token (should fail)

4. **Test Status Validation**
   - Try assigning to 'demo' status (should fail)
   - Try assigning to 'class' status (should succeed)
   - Try assigning to 'placement' status (should fail)

---

## Files Modified Summary

| File | Changes | Status |
|------|---------|--------|
| src/models/assignment.js | Added enquiryId field | ✅ Complete |
| src/models/index.js | Added Enquiry-Assignment association | ✅ Complete |
| src/controllers/assignment.controller.js | Added 3 new methods | ✅ Complete |
| src/routes/assignment.routes.js | Added 3 new routes | ✅ Complete |
| src/migrations/20260101000000-add-batch-instructor-review-and-updates.js | Updated assignments table schema | ✅ Complete |
| ENQUIRY_ASSIGNMENT_RELATIONSHIP.md | New documentation | ✅ Complete |

---

## Candidate Status Options

The enquiry model supports these status values:
- `demo` - Initial enquiry stage
- `qualified demo` - Passed demo
- **`class`** - Currently in class (assignable)
- **`class qualified`** - Completed class (assignable)
- `placement` - Placed in job
- `enquiry stage` - Early stage

**Only 'class' and 'class qualified' candidates can receive assignments.**

---

## Error Handling

### Scenario 1: Assigning to Non-Class Candidate
```json
{
  "message": "Enquiry must have 'class' or 'class qualified' status. Current status: demo"
}
```

### Scenario 2: Unauthorized Access
```json
{
  "message": "Only admin or counsellor can assign assignments to enquiries"
}
```

### Scenario 3: Invalid IDs
```json
{
  "message": "Assignment not found"
}
// or
{
  "message": "Enquiry not found"
}
```

---

## Success Flow Example

1. Create assignment for Batch A (Math 101)
2. Get all candidates with 'class' status
3. Select candidate "John Doe" (enquiry ID 5)
4. Assign assignment to John Doe
5. John Doe can now view his assignments
6. John Doe can track his assignment progress

---

Generated: January 1, 2026
