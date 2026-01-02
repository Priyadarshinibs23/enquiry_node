# Batch Management API Documentation

## Overview
- **Instructors** create batches with pending approval status
- **Admin/Counsellor** can directly create approved batches without waiting for approval
- **Instructors** can only see their own batches and approved batches
- **Admin/Counsellor** can see all batches and approve/reject pending ones

---

## 1. CREATE BATCH

**Endpoint:** `POST /api/batches/create`

**Authorization:** Bearer Token (any authenticated user - instructor/admin/counsellor)

### Request Body:
```json
{
  "name": "Batch A",
  "code": "BATCH001",
  "sessionDate": "2026-01-20",
  "sessionTime": "10:00",
  "status": "yet to start",
  "numberOfStudents": 25,
  "sessionLink": "https://zoom.us/j/123456789"
}
```

### Response (Instructor - 201):
```json
{
  "success": true,
  "message": "Batch created successfully and sent for approval",
  "data": {
    "id": 1,
    "name": "Batch A",
    "code": "BATCH001",
    "status": "yet to start",
    "numberOfStudents": 25,
    "sessionLink": "https://zoom.us/j/123456789",
    "sessionDate": "2026-01-20T00:00:00.000Z",
    "sessionTime": "10:00",
    "approvalStatus": "pending",
    "createdBy": 3,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

### Response (Admin/Counsellor - 201):
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "id": 1,
    "name": "Batch A",
    "code": "BATCH001",
    "status": "yet to start",
    "numberOfStudents": 25,
    "sessionLink": "https://zoom.us/j/123456789",
    "sessionDate": "2026-01-20T00:00:00.000Z",
    "sessionTime": "10:00",
    "approvalStatus": "approved",
    "createdBy": 1,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

---

## 2. GET ALL BATCHES

**Endpoint:** `GET /api/batches/`

**Authorization:** Bearer Token

### Response - Instructor (200):
```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "id": 1,
      "name": "Batch A",
      "code": "BATCH001",
      "status": "yet to start",
      "numberOfStudents": 25,
      "sessionLink": "https://zoom.us/j/123456789",
      "sessionDate": "2026-01-20T00:00:00.000Z",
      "sessionTime": "10:00",
      "approvalStatus": "pending",
      "createdBy": 3,
      "User": {
        "id": 3,
        "name": "John Instructor",
        "email": "john@example.com"
      }
    },
    {
      "id": 2,
      "name": "Batch B",
      "code": "BATCH002",
      "status": "yet to start",
      "numberOfStudents": 30,
      "sessionLink": "https://zoom.us/j/987654321",
      "sessionDate": "2026-02-01T00:00:00.000Z",
      "sessionTime": "14:00",
      "approvalStatus": "approved",
      "createdBy": 4,
      "User": {
        "id": 4,
        "name": "Sarah Instructor",
        "email": "sarah@example.com"
      }
    }
  ]
}
```

### Response - Admin/Counsellor (200):
```json
{
  "success": true,
  "total": 3,
  "data": [
    {
      "id": 1,
      "name": "Batch A",
      "code": "BATCH001",
      "status": "yet to start",
      "numberOfStudents": 25,
      "sessionLink": "https://zoom.us/j/123456789",
      "sessionDate": "2026-01-20T00:00:00.000Z",
      "sessionTime": "10:00",
      "approvalStatus": "pending",
      "createdBy": 3,
      "User": {
        "id": 3,
        "name": "John Instructor",
        "email": "john@example.com"
      }
    },
    {
      "id": 2,
      "name": "Batch B",
      "code": "BATCH002",
      "status": "yet to start",
      "numberOfStudents": 30,
      "sessionLink": "https://zoom.us/j/987654321",
      "sessionDate": "2026-02-01T00:00:00.000Z",
      "sessionTime": "14:00",
      "approvalStatus": "approved",
      "createdBy": 4,
      "User": {
        "id": 4,
        "name": "Sarah Instructor",
        "email": "sarah@example.com"
      }
    },
    {
      "id": 3,
      "name": "Batch C",
      "code": "BATCH003",
      "status": "yet to start",
      "numberOfStudents": 20,
      "sessionLink": "https://zoom.us/j/111111111",
      "sessionDate": "2026-01-15T00:00:00.000Z",
      "sessionTime": "09:00",
      "approvalStatus": "rejected",
      "createdBy": 3,
      "User": {
        "id": 3,
        "name": "John Instructor",
        "email": "john@example.com"
      }
    }
  ]
}
```

---

## 3. GET BATCH BY ID

**Endpoint:** `GET /api/batches/:batchId`

**Authorization:** Bearer Token

**URL Parameter:**
```
GET /api/batches/1
```

### Response (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Batch A",
    "code": "BATCH001",
    "status": "yet to start",
    "numberOfStudents": 25,
    "sessionLink": "https://zoom.us/j/123456789",
    "sessionDate": "2026-01-20T00:00:00.000Z",
    "sessionTime": "10:00",
    "approvalStatus": "pending",
    "createdBy": 3,
    "User": {
      "id": 3,
      "name": "John Instructor",
      "email": "john@example.com"
    }
  }
}
```

### Response - Instructor trying to view unapproved batch created by another instructor (403):
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

## 4. UPDATE BATCH

**Endpoint:** `PUT /api/batches/:batchId`

**Authorization:** Bearer Token (only batch creator or admin/counsellor)

**URL Parameter:**
```
PUT /api/batches/1
```

### Request Body:
```json
{
  "name": "Batch A Updated",
  "code": "BATCH001",
  "sessionDate": "2026-01-25",
  "sessionTime": "11:00",
  "status": "In progress",
  "numberOfStudents": 28,
  "sessionLink": "https://zoom.us/j/999999999"
}
```

### Response - Instructor Update (200):
```json
{
  "success": true,
  "message": "Batch updated and sent for re-approval",
  "data": {
    "id": 1,
    "name": "Batch A Updated",
    "code": "BATCH001",
    "status": "In progress",
    "numberOfStudents": 28,
    "sessionLink": "https://zoom.us/j/999999999",
    "sessionDate": "2026-01-25T00:00:00.000Z",
    "sessionTime": "11:00",
    "approvalStatus": "pending",
    "createdBy": 3,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T11:00:00.000Z"
  }
}
```

### Response - Admin Update (200):
```json
{
  "success": true,
  "message": "Batch updated successfully",
  "data": {
    "id": 1,
    "name": "Batch A Updated",
    "code": "BATCH001",
    "status": "In progress",
    "numberOfStudents": 28,
    "sessionLink": "https://zoom.us/j/999999999",
    "sessionDate": "2026-01-25T00:00:00.000Z",
    "sessionTime": "11:00",
    "approvalStatus": "approved",
    "createdBy": 3,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T11:00:00.000Z"
  }
}
```

### Response - Access Denied (403):
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

## 5. UPDATE APPROVAL STATUS (Admin/Counsellor Only)

**Endpoint:** `PATCH /api/batches/:batchId/approval-status`

**Authorization:** Bearer Token (Admin or Counsellor only)

**URL Parameter:**
```
PATCH /api/batches/1/approval-status
```

### Request Body:
```json
{
  "approvalStatus": "approved"
}
```

**Valid values:** `"approved"`, `"rejected"`, `"pending"`

### Response - Approve (200):
```json
{
  "success": true,
  "message": "Batch approved successfully",
  "data": {
    "id": 1,
    "name": "Batch A",
    "code": "BATCH001",
    "status": "yet to start",
    "numberOfStudents": 25,
    "sessionLink": "https://zoom.us/j/123456789",
    "sessionDate": "2026-01-20T00:00:00.000Z",
    "sessionTime": "10:00",
    "approvalStatus": "approved",
    "createdBy": 3,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

### Response - Reject (200):
```json
{
  "success": true,
  "message": "Batch rejected successfully",
  "data": {
    "id": 1,
    "name": "Batch A",
    "code": "BATCH001",
    "status": "yet to start",
    "numberOfStudents": 25,
    "sessionLink": "https://zoom.us/j/123456789",
    "sessionDate": "2026-01-20T00:00:00.000Z",
    "sessionTime": "10:00",
    "approvalStatus": "rejected",
    "createdBy": 3,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

### Response - Non-Admin Access (403):
```json
{
  "success": false,
  "message": "Only Admin and Counsellor can approve/reject batches"
}
```

---

## 6. DELETE BATCH

**Endpoint:** `DELETE /api/batches/:batchId`

**Authorization:** Bearer Token (only batch creator or admin/counsellor)

**URL Parameter:**
```
DELETE /api/batches/1
```

### Response (200):
```json
{
  "success": true,
  "message": "Batch deleted successfully"
}
```

### Response - Not Found (404):
```json
{
  "success": false,
  "message": "Batch not found"
}
```

### Response - Access Denied (403):
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

## Summary

| Role | Create | View Own/Approved | View All | Approve/Reject | Update | Delete |
|------|--------|------------------|----------|---|--------|--------|
| Instructor | ✅ (pending) | ✅ | ❌ | ❌ | ✅ (own only) | ✅ (own only) |
| Admin | ✅ (approved) | ✅ | ✅ | ✅ | ✅ (all) | ✅ (all) |
| Counsellor | ✅ (approved) | ✅ | ✅ | ✅ | ✅ (all) | ✅ (all) |
