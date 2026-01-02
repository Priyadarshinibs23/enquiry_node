# Quick Reference: Enquiry-Assignment Relationship

## What Changed?

✅ Assignments can now be linked to **enquiries** (candidates)
✅ Only candidates with **'class'** or **'class qualified'** status can receive assignments
✅ **ADMIN/COUNSELLOR** can assign assignments to candidates
✅ Candidates can view all their assigned assignments

---

## Quick API Usage

### 1. Assign Assignment to Candidate
```bash
POST /api/assignments/enquiry/assign
Authorization: Bearer <ADMIN/COUNSELLOR_TOKEN>

{
  "assignmentId": 1,
  "enquiryId": 5
}
```

### 2. Get Candidate's Assignments
```bash
GET /api/assignments/enquiry/5

# Returns all assignments for candidate with ID 5
```

### 3. Get All Class Candidates with Assignments
```bash
GET /api/assignments/enquiry/candidates/with-assignments
Authorization: Bearer <ADMIN/COUNSELLOR_TOKEN>

# Returns all candidates with 'class' status and their assignments
```

---

## Database Field Added

**Table:** assignments
**New Column:** enquiryId
- Type: INTEGER
- Nullable: YES
- References: enquiries.id
- Cascade Delete: YES

---

## Valid Candidate Statuses for Assignment

✅ `class` - Currently in class
✅ `class qualified` - Completed class

❌ `demo` - Initial stage
❌ `qualified demo` - Passed demo
❌ `placement` - Placed in job
❌ `enquiry stage` - Early stage

---

## Access Control

| Role | Can Assign to Enquiry | Can View All Class Candidates |
|------|---------------------|-----------------------------|
| ADMIN | ✅ | ✅ |
| COUNSELLOR | ✅ | ✅ |
| instructor | ❌ | ❌ |
| User | ❌ | ❌ |

---

## Relationship Diagram

```
Enquiry
  ├─ id
  ├─ name
  ├─ email
  ├─ candidateStatus  ← Must be 'class' or 'class qualified'
  └─ assignments (many)
      └─ Assignment
          ├─ id
          ├─ title
          ├─ description
          ├─ dueDate
          ├─ batchId → Batch
          ├─ subjectId → Subject
          └─ createdBy → User (Instructor)
```

---

## Error Messages

| Error | Cause |
|-------|-------|
| "Enquiry must have 'class' or 'class qualified' status" | Trying to assign to candidate not in class |
| "Only admin or counsellor can assign assignments to enquiries" | Using non-admin/counsellor token |
| "Enquiry not found" | Invalid enquiryId |
| "Assignment not found" | Invalid assignmentId |

---

## Running Migration

```bash
npx sequelize-cli db:migrate
```

This creates the `enquiryId` column in the assignments table.

---

## Test Cases

1. ✅ Create assignment for batch
2. ✅ Assign to candidate with 'class' status → SUCCESS
3. ✅ Assign to candidate with 'demo' status → ERROR
4. ✅ View candidate's assignments → SUCCESS
5. ✅ View all class candidates → SUCCESS
6. ✅ Delete enquiry → All its assignments deleted

---

## Files Modified

- ✅ src/models/assignment.js
- ✅ src/models/index.js
- ✅ src/controllers/assignment.controller.js
- ✅ src/routes/assignment.routes.js
- ✅ src/migrations/20260101000000-add-batch-instructor-review-and-updates.js

---

## Example Workflow

```
1. Instructor creates Assignment for Batch A
   POST /api/assignments/create
   
2. Admin views all class candidates
   GET /api/assignments/enquiry/candidates/with-assignments
   
3. Admin assigns Assignment to John Doe (enquiry ID 5)
   POST /api/assignments/enquiry/assign
   { assignmentId: 1, enquiryId: 5 }
   
4. John Doe views his assignments
   GET /api/assignments/enquiry/5
   
5. Result: John Doe sees "Assignment: Math Homework, Due: 2026-01-15"
```

---

## Key Points

🔑 **Enquiry = Candidate** - Each enquiry record represents a potential/current candidate

🔑 **Status is Key** - Only 'class' or 'class qualified' candidates can be assigned

🔑 **Cascade Delete** - Deleting a candidate deletes all their assignments

🔑 **Role-Based** - Only ADMIN/COUNSELLOR handle assignment-to-candidate mapping

🔑 **Batch Assignment** - Instructors create for batches, Counsellors assign to individuals

---

Created: January 1, 2026
Enquiry Module v2.0
