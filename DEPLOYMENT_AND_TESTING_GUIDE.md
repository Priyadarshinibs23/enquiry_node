# Deployment & Testing Guide: Enquiry-Assignment Relationship

---

## 🚀 Deployment Steps

### Phase 1: Pre-Deployment Verification (5 mins)

```bash
# 1. Verify all files are in place
ls -la src/models/assignment.js
ls -la src/controllers/assignment.controller.js
ls -la src/routes/assignment.routes.js
ls -la src/migrations/20260101000000-add-batch-instructor-review-and-updates.js

# 2. Check models/index.js for associations
grep "Enquiry.hasMany" src/models/index.js

# 3. Verify no syntax errors
node -c src/models/assignment.js
node -c src/controllers/assignment.controller.js
node -c src/routes/assignment.routes.js

# Expected: All files exist, syntax is valid
```

### Phase 2: Database Migration (2 mins)

```bash
# 1. Run migration
npx sequelize-cli db:migrate

# Expected output:
# ✓ Successfully created 'assignments' table
# ✓ Migration 20260101000000-add-batch-instructor-review-and-updates.js executed

# 2. Verify migration status
npx sequelize-cli db:migrate:status

# Expected: ✓ up | 20260101000000-add-batch-instructor-review-and-updates.js

# 3. If error, check database connection
# Re-run: npx sequelize-cli db:migrate
```

### Phase 3: Start Application (3 mins)

```bash
# 1. Clear any old processes
# Windows: taskkill /F /IM node.exe
# Mac/Linux: pkill -f node

# 2. Start application
npm start

# Expected output:
# Server running on port 3000
# Database connected successfully

# 3. Keep terminal open for logs
```

### Phase 4: Verification (2 mins)

```bash
# In another terminal, verify API is responding
curl http://localhost:3000/api/assignments/batch/1

# Expected: JSON response (may be empty if no data, but no error)
# Status: 200 or 404 (not 500)
```

---

## 🧪 Testing Guide

### Manual Testing (Postman)

#### Setup in Postman

1. **Create environment variable:**
   - Variable: `ADMIN_TOKEN`
   - Variable: `COUNSELLOR_TOKEN`
   - Variable: `INSTRUCTOR_TOKEN`
   - Variable: `BASE_URL` = `http://localhost:3000`

2. **Get tokens from authentication endpoint:**
   ```
   POST http://localhost:3000/api/auth/login
   {
     "email": "admin@example.com",
     "password": "password"
   }
   ```
   Copy token to `ADMIN_TOKEN` variable

---

### Test Case 1: Assign Assignment to Enquiry

**Endpoint:** `POST {{BASE_URL}}/api/assignments/enquiry/assign`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Body:**
```json
{
  "assignmentId": 1,
  "enquiryId": 5
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Assignment assigned to enquiry John Doe",
  "data": {
    "id": 1,
    "title": "Math Homework",
    "enquiryId": 5,
    "batch": { "id": 1, "name": "Batch A" },
    "enquiry": { "id": 5, "name": "John Doe", "candidateStatus": "class" }
  }
}
```

**Test Variations:**

a) **Test with invalid role (Instructor):**
   - Use: `Authorization: Bearer {{INSTRUCTOR_TOKEN}}`
   - Expected: `403 Forbidden`
   - Message: "Only admin or counsellor can assign..."

b) **Test with invalid enquiry status:**
   - Use enquiry with status "demo"
   - Expected: `400 Bad Request`
   - Message: "Enquiry must have 'class' or 'class qualified' status"

c) **Test with non-existent assignment:**
   - Use: `assignmentId: 99999`
   - Expected: `404 Not Found`
   - Message: "Assignment not found"

d) **Test with non-existent enquiry:**
   - Use: `enquiryId: 99999`
   - Expected: `404 Not Found`
   - Message: "Enquiry not found"

---

### Test Case 2: Get Assignments for Enquiry

**Endpoint:** `GET {{BASE_URL}}/api/assignments/enquiry/5`

**Headers:**
```
Content-Type: application/json
```

**Body:** None

**Expected Response (200):**
```json
{
  "success": true,
  "enquiryName": "John Doe",
  "candidateStatus": "class",
  "total": 2,
  "data": [
    {
      "id": 1,
      "title": "Math Homework",
      "createdDate": "2026-01-01",
      "dueDate": "2026-01-15",
      "batch": { "id": 1, "name": "Batch A", "code": "BATCH001" },
      "subject": { "id": 2, "name": "Mathematics" },
      "instructor": { "id": 3, "name": "Rajesh", "email": "rajesh@example.com" }
    }
  ]
}
```

**Test Variations:**

a) **Test with invalid enquiry ID:**
   - Use: `enquiryId: 99999`
   - Expected: `404 Not Found`

b) **Test with enquiry having no assignments:**
   - Use: `enquiryId: 8`
   - Expected: `200 OK`
   - Data: empty array

---

### Test Case 3: Get All Class Candidates with Assignments

**Endpoint:** `GET {{BASE_URL}}/api/assignments/enquiry/candidates/with-assignments`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Body:** None

**Expected Response (200):**
```json
{
  "success": true,
  "total": 3,
  "message": "Found 3 candidates with class status",
  "data": [
    {
      "id": 5,
      "name": "John Doe",
      "email": "john@example.com",
      "candidateStatus": "class",
      "assignments": [
        {
          "id": 1,
          "title": "Math Homework",
          "dueDate": "2026-01-15"
        }
      ]
    }
  ]
}
```

**Test Variations:**

a) **Test with Counsellor token:**
   - Use: `Authorization: Bearer {{COUNSELLOR_TOKEN}}`
   - Expected: `200 OK` (same response)

b) **Test with Instructor token:**
   - Use: `Authorization: Bearer {{INSTRUCTOR_TOKEN}}`
   - Expected: `403 Forbidden`

c) **Test with no auth token:**
   - No Authorization header
   - Expected: `403 Forbidden` or `401 Unauthorized`

---

## 🔍 Automated Testing Script

Save as `test-enquiry-assignment.js`:

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let ADMIN_TOKEN = '';
let ASSIGNMENT_ID = '';
let ENQUIRY_ID = '';

async function runTests() {
  console.log('🧪 Starting Enquiry-Assignment Tests\n');

  try {
    // 1. Login to get token
    console.log('1️⃣  Logging in as Admin...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password'
    });
    ADMIN_TOKEN = loginRes.data.token;
    console.log('✅ Admin login successful\n');

    // 2. Get first assignment
    console.log('2️⃣  Fetching assignment...');
    const assignRes = await axios.get(`${BASE_URL}/assignments/batch/1`);
    ASSIGNMENT_ID = assignRes.data.data[0].id;
    console.log(`✅ Assignment ${ASSIGNMENT_ID} found\n`);

    // 3. Get first class enquiry
    console.log('3️⃣  Finding class candidate...');
    const enqRes = await axios.get(`${BASE_URL}/enquiries`);
    const classEnquiry = enqRes.data.data.find(e => 
      e.candidateStatus === 'class' || e.candidateStatus === 'class qualified'
    );
    if (!classEnquiry) throw new Error('No class candidates found');
    ENQUIRY_ID = classEnquiry.id;
    console.log(`✅ Class candidate ${ENQUIRY_ID} found\n`);

    // 4. Assign assignment to enquiry
    console.log('4️⃣  Assigning assignment to enquiry...');
    const assignRes2 = await axios.post(
      `${BASE_URL}/assignments/enquiry/assign`,
      { assignmentId: ASSIGNMENT_ID, enquiryId: ENQUIRY_ID },
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    console.log('✅ Assignment assigned successfully\n');

    // 5. Get enquiry assignments
    console.log('5️⃣  Fetching enquiry assignments...');
    const enqAssignRes = await axios.get(
      `${BASE_URL}/assignments/enquiry/${ENQUIRY_ID}`
    );
    console.log(`✅ Found ${enqAssignRes.data.total} assignments for enquiry\n`);

    // 6. Get all class candidates
    console.log('6️⃣  Fetching all class candidates...');
    const classCandRes = await axios.get(
      `${BASE_URL}/assignments/enquiry/candidates/with-assignments`,
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    console.log(`✅ Found ${classCandRes.data.total} class candidates\n`);

    console.log('✅ ALL TESTS PASSED!');
  } catch (error) {
    console.error('❌ TEST FAILED:');
    console.error(error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
```

**Run automated tests:**
```bash
node test-enquiry-assignment.js
```

---

## 📋 Testing Checklist

### Unit Tests
- [ ] assignToEnquiry validates role correctly
- [ ] assignToEnquiry validates enquiry status
- [ ] assignToEnquiry updates assignment correctly
- [ ] getAssignmentsByEnquiry returns correct data
- [ ] getAssignmentsByEnquiry orders by dueDate
- [ ] getClassCandidatesWithAssignments filters by status

### Integration Tests
- [ ] Create assignment → Assign to enquiry → Verify link
- [ ] Delete enquiry → Verify assignments cascade deleted
- [ ] Multiple assignments per enquiry work correctly
- [ ] Enquiry with no assignments returns empty array
- [ ] Batch assignments not affected by enquiry assignments

### Security Tests
- [ ] Non-admin cannot assign to enquiry (403)
- [ ] Invalid token rejected (401)
- [ ] Admin can assign to any enquiry
- [ ] Counsellor can assign to any enquiry
- [ ] Instructor cannot assign to enquiry

### Validation Tests
- [ ] Enquiry with 'demo' status rejected
- [ ] Enquiry with 'class' status accepted
- [ ] Enquiry with 'class qualified' status accepted
- [ ] Non-existent enquiry returns 404
- [ ] Non-existent assignment returns 404

### Data Tests
- [ ] Response includes all required fields
- [ ] Relationships are properly populated
- [ ] Timestamps are correct
- [ ] Null fields handled correctly
- [ ] Array responses have correct count

---

## 🐛 Troubleshooting

### Issue: Migration fails with "table already exists"

**Solution:**
```bash
# Check migration status
npx sequelize-cli db:migrate:status

# If assignments table exists, update it instead:
# Modify migration or create new migration with:
# ALTER TABLE assignments ADD COLUMN enquiryId INTEGER;
```

### Issue: Endpoint returns 404

**Possible causes:**
1. Route not registered in app.js
2. Middleware not configured
3. Port number different

**Solution:**
```bash
# Check route registration
grep "assignments" src/app.js

# Verify port
grep "listen" src/server.js

# Check if server started
curl http://localhost:3000/health
```

### Issue: "Only admin or counsellor can assign"

**Cause:** Using instructor or user token

**Solution:**
```
Use valid ADMIN or COUNSELLOR token in Authorization header
```

### Issue: "Enquiry must have 'class' or 'class qualified' status"

**Cause:** Trying to assign to enquiry with wrong status

**Solution:**
```
First update enquiry status to 'class' or 'class qualified'
Then attempt assignment
```

---

## ✅ Rollback Procedures

### If Migration Fails

```bash
# Undo migration
npx sequelize-cli db:migrate:undo

# Check status
npx sequelize-cli db:migrate:status

# Re-run migration
npx sequelize-cli db:migrate
```

### If Code Has Issues

```bash
# Revert code changes
git revert HEAD

# Restart server
npm start
```

### If Need to Delete Column

```bash
# Create new migration
npx sequelize-cli migration:generate --name drop-enquiry-id-from-assignments

# In migration file, add:
# await queryInterface.removeColumn('assignments', 'enquiryId', { transaction });

# Run migration
npx sequelize-cli db:migrate
```

---

## 📊 Performance Testing

### Load Testing Setup

```javascript
// test-load.js
const autocannon = require('autocannon');

const result = await autocannon({
  url: 'http://localhost:3000/api/assignments/enquiry/5',
  connections: 10,
  duration: 10,
  pipelining: 1,
});

console.log(result);
```

### Query Performance

```sql
-- Check index on enquiryId
SELECT * FROM pg_indexes WHERE tablename = 'assignments';

-- If not present, create:
CREATE INDEX idx_assignments_enquiry_id ON assignments(enquiryId);
```

---

## 📈 Monitoring

### Database Queries to Monitor

```sql
-- Check assignment count by enquiry
SELECT enquiryId, COUNT(*) as assignment_count
FROM assignments
WHERE enquiryId IS NOT NULL
GROUP BY enquiryId;

-- Check class candidates
SELECT id, name, candidateStatus, COUNT(a.id) as assignment_count
FROM enquiries e
LEFT JOIN assignments a ON e.id = a.enquiryId
WHERE e.candidateStatus IN ('class', 'class qualified')
GROUP BY e.id;

-- Check for orphaned assignments (should be none)
SELECT * FROM assignments
WHERE enquiryId NOT IN (SELECT id FROM enquiries);
```

---

## 📝 Testing Report Template

```markdown
# Test Report: Enquiry-Assignment Implementation

**Date:** [Date]
**Tester:** [Name]
**Environment:** [Dev/Staging/Prod]

## Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Status: ✅ PASS / ⚠️ FAIL

## Test Results

### Functional Tests
- [ ] Assign to enquiry: ✅ PASS
- [ ] Get enquiry assignments: ✅ PASS
- [ ] Get class candidates: ✅ PASS

### Security Tests
- [ ] Role validation: ✅ PASS
- [ ] Status validation: ✅ PASS
- [ ] Token validation: ✅ PASS

### Performance Tests
- [ ] Response time < 200ms: ✅ PASS
- [ ] Database queries optimized: ✅ PASS

### Issues Found
1. [Issue description]
2. [Issue description]

## Sign-off
Approved by: _____________ Date: _______
```

---

## 🚀 Production Deployment Checklist

- [ ] Code review completed
- [ ] All tests passing
- [ ] Migration tested on staging
- [ ] Backup of production database taken
- [ ] Maintenance window scheduled
- [ ] Rollback plan reviewed
- [ ] Team notified
- [ ] Monitoring alerts set up
- [ ] Documentation updated
- [ ] Post-deployment verification plan ready

---

## 📞 Support Contacts

For issues during deployment, contact:
- **Backend Lead:** [Contact]
- **Database Admin:** [Contact]
- **DevOps:** [Contact]

---

**Version:** 1.0
**Last Updated:** January 1, 2026
**Status:** Ready for Deployment
