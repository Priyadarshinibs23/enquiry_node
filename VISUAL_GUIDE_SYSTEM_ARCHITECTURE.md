# Visual Guide: Enquiry-Assignment System

## 🎯 System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    ENQUIRY-ASSIGNMENT SYSTEM                   │
└────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      USER ROLES & ACCESS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INSTRUCTOR                 COUNSELLOR              ADMIN          │
│  ───────────                ──────────              ─────          │
│  ✅ Create                  ✅ Create               ✅ Create      │
│     assignments             ✅ Assign to enquiry    ✅ Assign      │
│                             ✅ View all             ✅ View all    │
│  ❌ Assign to enquiry       ❌ Create for other     ✅ Manage      │
│  ❌ View class list            (only own)           all            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
                    BATCH CREATION
                        ↓
            ┌───────────────────────┐
            │ Instructor creates    │
            │ Batch for Subject     │
            └───────────────────────┘
                        ↓
            ┌───────────────────────────────┐
            │ Get subject from batch.subjectId
            └───────────────────────────────┘
                        ↓
            ┌───────────────────────────────┐
            │ Create Assignment for Batch   │
            │ (title, description, dueDate) │
            └───────────────────────────────┘
                        ↓
        ┌───────────────────────────────────┐
        │ Assignment created with:          │
        │ - batchId (from input)            │
        │ - subjectId (auto from batch)     │
        │ - createdBy (instructor ID)       │
        │ - enquiryId (NULL initially)      │
        └───────────────────────────────────┘
                        ↓
    OPTION A (Batch-level)          OPTION B (Individual-level)
           ↓                                  ↓
    All batch members            Counsellor: "Assign to Rahul"
    get assignment               ↓
    automatically           Check Rahul's status
                           (must be 'class' or 'class qualified')
                           ↓
                           POST /api/assignments/enquiry/assign
                           { assignmentId: 1, enquiryId: 5 }
                           ↓
                           Assignment updated with enquiryId
                           ↓
                           Rahul gets individual assignment
```

---

## 🔄 Complete Request/Response Flow

### Flow 1: Assign Assignment to Enquiry

```
CLIENT REQUEST:
┌─────────────────────────────────────────┐
│ POST /api/assignments/enquiry/assign    │
├─────────────────────────────────────────┤
│ Headers:                                │
│ - Authorization: Bearer ADMIN_TOKEN     │
├─────────────────────────────────────────┤
│ Body: {                                 │
│   "assignmentId": 1,                    │
│   "enquiryId": 5                        │
│ }                                       │
└─────────────────────────────────────────┘
            ↓ REQUEST PROCESSING
┌─────────────────────────────────────────┐
│ Controller: assignToEnquiry()            │
├─────────────────────────────────────────┤
│ 1. Extract user role from token         │
│ 2. Verify role = ADMIN or COUNSELLOR    │
│ 3. Find assignment by ID = 1            │
│ 4. Find enquiry by ID = 5               │
│ 5. Check enquiry.candidateStatus       │
│ 6. If NOT ('class' OR 'class qualified')│
│    → Return 400 error                   │
│ 7. Update assignment.enquiryId = 5      │
│ 8. Fetch updated assignment with all    │
│    relationships                        │
└─────────────────────────────────────────┘
            ↓ SUCCESS RESPONSE
┌─────────────────────────────────────────┐
│ HTTP 200 OK                             │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": true,                      │
│   "message": "Assignment assigned...",  │
│   "data": {                             │
│     "id": 1,                            │
│     "title": "Math Homework",           │
│     "description": "...",               │
│     "dueDate": "2026-01-15",            │
│     "enquiryId": 5,                     │
│     "batch": {...},                     │
│     "subject": {...},                   │
│     "enquiry": {...}                    │
│   }                                     │
│ }                                       │
└─────────────────────────────────────────┘
```

---

### Flow 2: Get Assignments for Candidate

```
CLIENT REQUEST:
┌─────────────────────────────────────────┐
│ GET /api/assignments/enquiry/5          │
└─────────────────────────────────────────┘
            ↓ REQUEST PROCESSING
┌─────────────────────────────────────────┐
│ Controller: getAssignmentsByEnquiry()    │
├─────────────────────────────────────────┤
│ 1. Extract enquiryId = 5 from params    │
│ 2. Fetch enquiry record by ID           │
│ 3. Query assignments WHERE enquiryId=5  │
│ 4. Include batch, subject, instructor   │
│ 5. Order by dueDate ascending           │
│ 6. Return result set                    │
└─────────────────────────────────────────┘
            ↓ SUCCESS RESPONSE
┌─────────────────────────────────────────┐
│ HTTP 200 OK                             │
├─────────────────────────────────────────┤
│ {                                       │
│   "success": true,                      │
│   "enquiryName": "Rahul",               │
│   "candidateStatus": "class",           │
│   "total": 2,                           │
│   "data": [                             │
│     {                                   │
│       "id": 1,                          │
│       "title": "Math Homework",         │
│       "dueDate": "2026-01-15",          │
│       "batch": {name: "Batch A"},       │
│       "subject": {name: "Math"}         │
│     },                                  │
│     {                                   │
│       "id": 2,                          │
│       "title": "Physics Lab",           │
│       "dueDate": "2026-01-18",          │
│       "batch": {name: "Batch A"},       │
│       "subject": {name: "Physics"}      │
│     }                                   │
│   ]                                     │
│ }                                       │
└─────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Visualization

```
┌─────────────────────┐
│    ENQUIRIES        │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email               │
│ phone               │
│ candidateStatus ✨  │  <- ENUM: 'demo', 'qualified demo',
│ current_location    │            'class', 'class qualified',
│ packageId (FK)      │            'placement', 'enquiry stage'
│ ...                 │
└─────────────────────┘
           │
           │ ONE-TO-MANY
           │ (enquiryId FK)
           │
           ▼
┌─────────────────────────────────┐      ┌──────────────────┐
│       ASSIGNMENTS               │      │     BATCHES      │
├─────────────────────────────────┤      ├──────────────────┤
│ id (PK)                         │      │ id (PK)          │
│ title                           │◄─────│ name             │
│ description                     │      │ code             │
│ createdDate                     │      │ subjectId (FK)   │
│ dueDate                         │      │ createdBy (FK)   │
│ batchId (FK) ──────────────────►      │ ...              │
│ subjectId (FK) ──┐              │      └──────────────────┘
│ createdBy (FK)   │              │
│ enquiryId (FK)   │◄─ TO ENQUIRY │      ┌──────────────────┐
│                  │              │      │     SUBJECTS     │
└─────────────────────────────────┘      ├──────────────────┤
                                         │ id (PK)          │
              Links to ─────────────────►│ name             │
                                         │ code             │
                                         │ ...              │
                                         └──────────────────┘
```

---

## 🎬 Step-by-Step Example Workflow

```
STEP 1: Create Batch
───────────────────
Instructor: "I want to teach Algebra to a class"
Action: POST /api/batches/create
        { name: "Algebra Basics", 
          subjectId: 2,
          code: "ALG-001",
          sessionDate: "2026-01-10" }
Result: Batch created (ID: 10)


STEP 2: Create Assignment
──────────────────────────
Instructor: "Let me create homework for this batch"
Action: POST /api/assignments/create
        { batchId: 10,
          title: "Chapter 5 Exercises",
          description: "Solve all equations",
          dueDate: "2026-01-15" }
Result: Assignment created (ID: 1)
        subjectId auto-populated from batch (subjectId: 2)


STEP 3: Get In-Class Candidates
────────────────────────────────
Counsellor: "Show me all students currently in class"
Action: GET /api/assignments/enquiry/candidates/with-assignments
        Authorization: Bearer COUNSELLOR_TOKEN
Result: List of 5 candidates with status 'class':
        1. Rahul (enquiry ID: 5)
        2. Priya (enquiry ID: 6)
        3. Amit (enquiry ID: 7)
        4. Neha (enquiry ID: 8)
        5. Vikram (enquiry ID: 9)


STEP 4: Assign to Specific Candidate
─────────────────────────────────────
Counsellor: "Assign the assignment to Rahul"
Action: POST /api/assignments/enquiry/assign
        { assignmentId: 1,
          enquiryId: 5 }
        Authorization: Bearer COUNSELLOR_TOKEN
Check: Is Rahul's status 'class' or 'class qualified'? YES ✓
Result: Assignment 1 now linked to Rahul (enquiry 5)


STEP 5: Candidate Views Their Assignment
──────────────────────────────────────────
Rahul: "Show me my assignments"
Action: GET /api/assignments/enquiry/5
Result: 
{
  "enquiryName": "Rahul",
  "candidateStatus": "class",
  "total": 1,
  "data": [
    {
      "title": "Chapter 5 Exercises",
      "description": "Solve all equations",
      "dueDate": "2026-01-15",
      "batch": { "name": "Algebra Basics" },
      "subject": { "name": "Mathematics" }
    }
  ]
}


STEP 6: Counsellor Monitors Progress
─────────────────────────────────────
Counsellor: "Show me all my class students and their work"
Action: GET /api/assignments/enquiry/candidates/with-assignments
Result: Overview of all 5 candidates with their assignments
```

---

## ✅ Validation Flow

```
Request to assign assignment to enquiry:
│
├─ 1. IS USER ADMIN/COUNSELLOR?
│     NO  → ❌ 403 Forbidden
│     YES → Continue
│
├─ 2. DOES ASSIGNMENT EXIST?
│     NO  → ❌ 404 Not Found
│     YES → Continue
│
├─ 3. DOES ENQUIRY EXIST?
│     NO  → ❌ 404 Not Found
│     YES → Continue
│
├─ 4. IS ENQUIRY STATUS 'class' OR 'class qualified'?
│     NO  → ❌ 400 Bad Request
│     YES → Continue
│
└─ 5. UPDATE & RETURN SUCCESS
      ✅ 200 OK with updated data
```

---

## 🔐 Access Control Matrix

```
┌────────────────┬──────────┬───────────┬──────────┬──────────────┐
│ Operation      │ ADMIN    │ COUNSELLOR│ Instr.   │ Other User   │
├────────────────┼──────────┼───────────┼──────────┼──────────────┤
│ Create Assign. │ ✅ Own   │ ❌        │ ✅ Own   │ ❌           │
│ Assign to Enq. │ ✅ Any   │ ✅ Any    │ ❌       │ ❌           │
│ View My Enq.   │ ✅ All   │ ✅ All    │ ✅ Own   │ ❌           │
│ View Class Cand│ ✅ List  │ ✅ List   │ ❌       │ ❌           │
│ Delete Assign. │ ✅ Own   │ ❌        │ ✅ Own   │ ❌           │
└────────────────┴──────────┴───────────┴──────────┴──────────────┘
```

---

## 📈 Candidate Journey

```
CANDIDATE (ENQUIRY) LIFECYCLE:

Enquiry Created
      │
      ├─ Status: "enquiry stage"
      │  Can receive: ❌ Assignments
      │
      ▼
Demo Scheduled
      │
      ├─ Status: "demo"
      │  Can receive: ❌ Assignments
      │
      ▼
Demo Qualified
      │
      ├─ Status: "qualified demo"
      │  Can receive: ❌ Assignments
      │
      ▼
Class Started ◄─────── ASSIGNMENT ASSIGNMENT ELIGIBLE STARTS HERE
      │
      ├─ Status: "class"
      │  Can receive: ✅ ASSIGNMENTS ✅✅
      │
      ▼
Class Completed
      │
      ├─ Status: "class qualified"
      │  Can receive: ✅ ASSIGNMENTS ✅✅
      │
      ▼
Placement Done
      │
      ├─ Status: "placement"
      │  Can receive: ❌ Assignments
      │
      ▼
END (Alumni)
```

---

## 🎓 Assignment Types

```
BATCH-LEVEL ASSIGNMENT
├─ Created by: Instructor
├─ For: All batch members
├─ enquiryId: NULL (no individual link)
└─ Automatic delivery

INDIVIDUAL-LEVEL ASSIGNMENT
├─ Created by: Instructor (batch-level)
├─ Assigned by: Counsellor/Admin
├─ To: Specific candidate (enquiry)
├─ enquiryId: Set to candidate's enquiry ID
└─ Manual targeting
```

---

## 📞 API Endpoint Decision Tree

```
Need to work with assignments?
│
├─ Create assignment for batch?
│  └─ POST /api/assignments/create
│
├─ Get assignments for batch?
│  └─ GET /api/assignments/batch/:batchId
│
├─ Get assignments for subject?
│  └─ GET /api/assignments/subject/:subjectId
│
├─ Get single assignment?
│  └─ GET /api/assignments/:assignmentId
│
├─ Get my assignments (Instructor)?
│  └─ GET /api/assignments/my-assignments
│
├─ Assign to specific enquiry?
│  └─ POST /api/assignments/enquiry/assign ✅ NEW
│
├─ Get all assignments for candidate?
│  └─ GET /api/assignments/enquiry/:enquiryId ✅ NEW
│
├─ Get all class candidates with assignments?
│  └─ GET /api/assignments/enquiry/candidates/with-assignments ✅ NEW
│
├─ Update assignment?
│  └─ PUT /api/assignments/:assignmentId
│
└─ Delete assignment?
   └─ DELETE /api/assignments/:assignmentId
```

---

## 🚀 System Benefits

```
BEFORE:
├─ Only batch-level assignments
├─ All batch members get same
├─ No individual targeting
├─ No status validation
└─ Limited querying

AFTER:
├─ Batch-level + Individual-level ✅
├─ Targeted assignment ✅
├─ Status-based filtering ✅
├─ Role-based access ✅
├─ Comprehensive querying ✅
├─ Cascade delete integrity ✅
└─ Better candidate management ✅
```

---

## 🎯 Key Takeaways

1. **Enquiry = Candidate Record** in the system
2. **Status Must Be 'class'** for assignment eligibility
3. **Only Admin/Counsellor** can assign to enquiries
4. **Cascade Delete** maintains data integrity
5. **Three New Endpoints** for enquiry-based operations
6. **Multiple Assignments** per candidate supported
7. **Full Relationship** between enquiry and assignment

---

**Visual Guide Created:** January 1, 2026
**Purpose:** Quick understanding of entire system
**For:** Developers, Testers, Documentation
