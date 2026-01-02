# Assignment Table - Structure & Relationships Explanation

## 📋 Assignment Table Structure

```javascript
Assignments Table Fields:
├── id (Primary Key) - Auto increment
├── title (STRING) - Assignment title [REQUIRED]
├── description (TEXT) - Assignment details [OPTIONAL]
├── createdDate (DATE) - When assignment was created [AUTO]
├── dueDate (DATE) - When assignment is due [REQUIRED]
├── batchId (INTEGER) - Foreign Key to Batches [REQUIRED]
├── subjectId (INTEGER) - Foreign Key to Subjects [REQUIRED]
├── createdBy (INTEGER) - Foreign Key to Users (Instructor) [REQUIRED]
├── createdAt (DATE) - Timestamp
└── updatedAt (DATE) - Timestamp
```

---

## 🔗 Relationship Architecture

### **1. Batch → Assignment (One-to-Many)**
```
One Batch can have MANY Assignments
  ↓
Example:
- Batch: "Java Fundamentals Batch A"
  ├── Assignment 1: "Chapter 1 Project"
  ├── Assignment 2: "Mid-term Exam"
  └── Assignment 3: "Final Project"
```

**Why?** An instructor teaching a batch may give multiple assignments to students in that batch.

---

### **2. Subject → Assignment (One-to-Many)**
```
One Subject can have MANY Assignments
  ↓
Example:
- Subject: "Java Basics"
  ├── Batch A → Assignment 1
  ├── Batch A → Assignment 2
  ├── Batch B → Assignment 3
  └── Batch B → Assignment 4
```

**Why?** Same subject taught in different batches can have assignments. This helps track all assignments for a subject across all batches.

---

### **3. User (Instructor) → Assignment (One-to-Many)**
```
One Instructor can CREATE MANY Assignments
  ↓
Example:
- Instructor: "John Doe"
  ├── For Batch A: Assignment 1
  ├── For Batch A: Assignment 2
  ├── For Batch B: Assignment 3
  └── For Batch C: Assignment 4
```

**Why?** An instructor teaches multiple batches and creates assignments for each batch.

---

## 🎯 How the Relationships Work Together

### **Scenario: Instructor John creates assignment for Java Batch A**

```
Step 1: Instructor selects a Batch
  → Batch: "Java Fundamentals Batch A" (id: 1)
  → Subject: "Java Basics" (auto-fetched from batch.subjectId)
  → CreatedBy: John's User ID (id: 3)

Step 2: Assignment is created with:
  {
    title: "Chapter 1 Project",
    description: "Build a calculator app",
    dueDate: "2026-02-15",
    batchId: 1,           ← Links to Batch
    subjectId: 1,         ← Auto-fetched from Batch
    createdBy: 3          ← Instructor's User ID
  }

Step 3: Relationships are established
  ┌─────────────────────────────────────┐
  │ Assignment ID: 1                    │
  │                                     │
  │ Batch → "Java Fund. Batch A"  ──────┤ Can query: Get all assignments in this batch
  │ Subject → "Java Basics"       ──────┤ Can query: Get all assignments in this subject
  │ Instructor → "John Doe"       ──────┤ Can query: Get all assignments by this instructor
  └─────────────────────────────────────┘
```

---

## 🔐 Access Control Rules

### **Who can Create Assignments?**
- ✅ **Instructors** - Only for their own batches
- ✅ **Admin/Counsellor** - For any batch

**Validation:**
```javascript
if (userRole === 'instructor' && batch.createdBy !== userId) {
  // Instructor can only create for their own batches
  return error;
}
```

---

### **Who can Update/Delete Assignments?**
- ✅ **Creator** - The instructor who created it
- ✅ **Admin/Counsellor** - Can modify any assignment

---

## 📊 Database Schema

```
USERS (id, name, email, role)
   │
   ├─→ (createdBy FK) → ASSIGNMENTS (id, title, description, createdDate, dueDate, batchId, subjectId, createdBy)
   │                                           ↑
   │                                           │
   └─→ (createdBy FK) → BATCHES (id, name, code, ..., subjectId, createdBy)
                           │
                           ├─→ (batchId FK) → ASSIGNMENTS
                           │
                           └─→ (subjectId FK) → SUBJECTS (id, name, code, image, ...)
                                                    ↑
                                                    │
                                                    └─→ (subjectId FK) → ASSIGNMENTS
```

---

## 🛡️ Cascade Delete Rules

```
If Batch is deleted:
  → All Assignments in that Batch are DELETED (CASCADE)

If Subject is deleted:
  → All Assignments for that Subject are DELETED (CASCADE)

If Instructor (User) is deleted:
  → All Assignments created by that Instructor are DELETED (CASCADE)
```

**Why?** Ensures referential integrity - no orphaned assignments.

---

## 📡 API Endpoints

### **Create Assignment**
```
POST /api/assignments/create
Body: {
  "batchId": 1,
  "title": "Chapter 1 Project",
  "description": "Build a calculator",
  "dueDate": "2026-02-15"
}
```

### **Get Assignments by Batch**
```
GET /api/assignments/batch/1
Response includes: batchName, batchCode, assignments list
```

### **Get Assignments by Subject**
```
GET /api/assignments/subject/1
Response includes: subjectName, subjectCode, assignments list
```

### **Get My Assignments**
```
GET /api/assignments/my-assignments
- Instructor: Gets only their assignments
- Admin/Counsellor: Gets all assignments
```

### **Update Assignment**
```
PUT /api/assignments/1
Body: { "title": "Updated title", "dueDate": "2026-02-20" }
```

### **Delete Assignment**
```
DELETE /api/assignments/1
(Only creator or admin/counsellor can delete)
```

---

## ✨ Key Features

1. **Batch-Specific Assignments** - Instructor creates assignments for specific batches
2. **Subject Tracking** - Automatically links to subject through batch
3. **Multiple Assignments** - One instructor can create multiple assignments for multiple batches
4. **Access Control** - Instructors restricted to their own batches
5. **Cascade Delete** - Deleting batch/subject/instructor cleans up assignments
6. **Audit Trail** - createdDate tracks when assignment was created
7. **Deadline Tracking** - dueDate for assignment submissions

---

## 🚀 Migration Command

```bash
npx sequelize-cli db:migrate
```

This will create:
- ✅ assignments table
- ✅ All foreign key relationships
- ✅ Proper cascade deletes
