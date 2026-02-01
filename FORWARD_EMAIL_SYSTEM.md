# Internal Review Email Forwarding System

## Overview
Admin can now forward verification requests to multiple internal reviewers via email with a semicolon-separated list of email addresses. System validates emails and sends notifications to all specified reviewers.

---

## Feature Flow

```
┌─────────────────────────────────────────────────────────────────┐
│           ADMIN VERIFICATION - FORWARD FOR REVIEW               │
└─────────────────────────────────────────────────────────────────┘

1. Admin Reviews Request
   └─ Views applicant details
   └─ Sees document submitted

2. Select "Forward for review" Radio Button
   └─ Blue email input section appears

3. Enter Reviewer Emails
   ├─ Format: email1@domain.com; email2@domain.com; email3@domain.com
   ├─ Multiple emails separated by semicolon (;)
   ├─ Whitespace automatically trimmed
   └─ Placeholder shows example format

4. Click Submit Button
   └─ System validates:
      ├─ At least one email provided
      └─ All emails have valid format (user@domain.ext)

5. Validation Results:
   ├─ ✓ All valid → Emails stored, request forwarded, redirect to dashboard
   ├─ ✗ Missing emails → Toast error, prompt to enter emails
   └─ ✗ Invalid emails → Toast error, shows invalid email(s)

6. Data Storage:
   └─ Request object updated with:
      ├─ status: "IN_PROCESS"
      ├─ forwardedTo: ["email1@domain.com", "email2@domain.com", ...]
      └─ forwardedDate: "2024-01-15T10:30:00.000Z"

7. Toast Notification to Admin:
   └─ "Request forwarded to 3 reviewer(s): email1@domain.com, email2@domain.com, email3@domain.com"
```

---

## User Interface

### Before Selection (Default)
```
☐ Approved with Corrected Document
☐ Not Approved
☐ Forward for review

[No input fields visible]
```

### After Selecting "Forward for review"
```
☑ Forward for review

┌────────────────────────────────────────────────────────────┐
│ Email addresses (semicolon separated if multiple):         │
├────────────────────────────────────────────────────────────┤
│ reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu │
│                                                              │
│                                                              │
├────────────────────────────────────────────────────────────┤
│ 💡 Enter multiple email addresses separated by semicolons (;) │
└────────────────────────────────────────────────────────────┘

[Submit Button]
```

### Input Field Properties
- **Type**: Textarea (3 rows)
- **Background**: Blue-50 (light blue)
- **Border**: Rounded with blue focus ring
- **Placeholder**: `reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu`
- **Helper Text**: Shows format instructions

---

## Email Parsing & Validation

### Parsing Process
```typescript
Input: "reviewer1@nmims.edu; reviewer2@nmims.edu;  reviewer3@nmims.edu  "
                           ↓
                    Split by ";"
                           ↓
                   Trim whitespace
                           ↓
           ["reviewer1@nmims.edu", "reviewer2@nmims.edu", "reviewer3@nmims.edu"]
                           ↓
                   Validate format
                           ↓
         Store if all valid, reject if any invalid
```

### Validation Rules
1. **At least one email required**
   - Toast: "Missing Reviewer Emails - Please enter at least one email address"

2. **Email format validation**
   - Pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
   - Examples:
     - ✓ `reviewer@nmims.edu`
     - ✓ `john.doe@nmims.ac.in`
     - ✓ `verification-team@university.edu`
     - ✗ `invalid.email`
     - ✗ `@nmims.edu`
     - ✗ `reviewer@`

3. **Multiple emails example**
   - Input: `reviewer1@nmims.edu; john.smith@nmims.edu; team@verification.edu`
   - Output: Array of 3 valid emails
   - All forwarded together

---

## Data Structure

### Updated Request Object
```typescript
{
  id: "uuid-12345",
  firstName: "John",
  lastName: "Doe",
  studentNumber: "12345",
  schoolName: "School Name",
  programName: "BCS",
  stream: "Science",
  semester: "6",
  yearOfPassing: 2022,
  cgpa: "3.5",
  requestType: "Regular",
  baseAmount: 2000,
  amountPayable: 2360,
  receiverEmail: "john@email.com",
  receiverNumber: "1234567890",
  
  documentFile: { name: "...", dataUrl: "..." },
  approvedDocument: { name: "...", dataUrl: "..." },
  
  status: "IN_PROCESS",
  
  // NEW: Forwarding information
  forwardedTo: [
    "reviewer1@nmims.edu",
    "reviewer2@nmims.edu",
    "reviewer3@nmims.edu"
  ],
  forwardedDate: "2024-01-15T10:30:00.000Z",
  
  createdAt: "2024-01-15T10:00:00.000Z"
}
```

---

## Toast Notifications

### Success (Forward Action)
```
Title: "Forwarded for Review"
Description: "Request forwarded to 3 reviewer(s): reviewer1@nmims.edu, reviewer2@nmims.edu, reviewer3@nmims.edu"
Type: Default (blue)
```

### Error - Missing Emails
```
Title: "Missing Reviewer Emails"
Description: "Please enter at least one email address to forward the request."
Type: Destructive (red)
```

### Error - Invalid Email Format
```
Title: "Invalid Email Format"
Description: "Invalid emails: invalid@, @nmims.edu"
Type: Destructive (red)
```

---

## Implementation Details

### AdminVerificationPage.tsx Changes

**1. New State Variable**
```typescript
const [forwardEmails, setForwardEmails] = useState<string>("");
```

**2. Email Parsing Function (in handleSubmit)**
```typescript
const emailList = forwardEmails
  .split(";")                              // Split by semicolon
  .map((email) => email.trim())            // Remove whitespace
  .filter((email) => email.length > 0);    // Remove empty strings
```

**3. Email Validation Function**
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

if (invalidEmails.length > 0) {
  // Show error toast
  return;
}
```

**4. Store Forward Information**
```typescript
allRequests[index].forwardedTo = emailList;
allRequests[index].forwardedDate = new Date().toISOString();
```

**5. Display Emails in Toast**
```typescript
description: `Request forwarded to ${emailList.length} reviewer(s): ${emailList.join(", ")}`
```

---

## Complete User Flow

### Step 1: Admin Selects "Forward for review"
```
Radio buttons visible:
☐ Approved with Corrected Document
☐ Not Approved
☑ Forward for review ← SELECTED
```

### Step 2: Email Input Section Appears
```
Blue section with textarea appears below radio buttons
Placeholder shows example emails
```

### Step 3: Admin Enters Email Addresses
```
Input: reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu

Accepted formats:
• Single email: reviewer@nmims.edu
• Multiple emails: reviewer1@nmims.edu; reviewer2@nmims.edu
• Spaces before/after semicolons: reviewer1@nmims.edu  ;  reviewer2@nmims.edu
```

### Step 4: Admin Clicks Submit
```
System validates:
✓ Emails present? YES
✓ Valid format? YES
↓
Forward request
Update status to: IN_PROCESS
Store email list
Redirect to admin dashboard
Show success toast
```

### Step 5: Toast Shows Confirmation
```
✓ Forwarded for Review
  Request forwarded to 3 reviewer(s): reviewer1@nmims.edu, reviewer2@nmims.edu, reviewer3@nmims.edu
```

---

## Admin Dashboard After Forwarding

### Request Appears in "Document Verification" Table
```
| Appl ID | Name | Stud No | Pass Yr | Program | Stream | Sem | Doc | Status | Date | Action |
|---------|------|---------|---------|---------|--------|-----|-----|--------|------|--------|
|INV-xxx  | John | 12345   | 2022    | BCS     | Science| 6   | ✓   | In Rev | 1/2  | View   |
```

**Status**: "In Review" (Yellow badge)

### Request Object in localStorage
```
{
  ...
  status: "IN_PROCESS",
  forwardedTo: ["reviewer1@nmims.edu", "reviewer2@nmims.edu", "reviewer3@nmims.edu"],
  forwardedDate: "2024-01-15T10:30:00.000Z"
}
```

---

## Email Notification Content

### Email Sent to Each Reviewer
```
Subject: 📋 Education Verification Request - Forwarded for Review
         [Application ID: INV-12345ABC]

From: admin@nmims.edu
To: reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu

---

Dear Reviewer,

An education verification request has been forwarded to you for internal review.

REQUEST DETAILS:
─────────────────────────────────────────
Applicant Name:        John Doe
Student Number:        12345
Program:              BCS
Stream:               Science
Year of Passing:      2022
CGPA:                 3.5
Request Type:         Regular
Amount Paid:          Rs. 2,360/-
─────────────────────────────────────────

Application ID: INV-12345ABC
Forwarded By:   University Admin
Forwarded Date: January 15, 2024

ACTION REQUIRED:
Please review the submitted document and provide your feedback.
Access the admin dashboard for detailed information.

Link: [Admin Dashboard URL]

---

Best regards,
NMIMS Verification System
```

---

## Error Handling

### Scenario 1: No Emails Entered
```
User selects "Forward for review"
User clicks Submit without entering emails
↓
Toast: "Missing Reviewer Emails"
"Please enter at least one email address to forward the request."
↓
Stays on page, allows user to enter emails
```

### Scenario 2: One Invalid Email
```
Input: reviewer1@nmims.edu; invalid.email; reviewer3@nmims.edu
↓
System identifies: "invalid.email" is invalid
↓
Toast: "Invalid Email Format"
"Invalid emails: invalid.email"
↓
Stays on page, user can correct
```

### Scenario 3: Multiple Invalid Emails
```
Input: @nmims.edu; invalid@; another@invalid
↓
Toast: "Invalid Email Format"
"Invalid emails: @nmims.edu, invalid@, another@invalid"
↓
User must correct all before proceeding
```

### Scenario 4: Valid Emails with Extra Spaces
```
Input: " reviewer1@nmims.edu ; reviewer2@nmims.edu  "
↓
Trimmed to: ["reviewer1@nmims.edu", "reviewer2@nmims.edu"]
↓
✓ Valid, forward proceeds
```

---

## Benefits

✅ **Multiple Internal Reviewers**
- Forward to entire team at once
- No need to manually add reviewers individually

✅ **Email Validation**
- Prevents invalid email addresses
- Catches typos before submission

✅ **Clear Tracking**
- See who request was forwarded to
- Timestamp of forwarding
- Status shows "In Review"

✅ **Professional Communication**
- Email notifications to all reviewers
- Complete request details included
- Clear action required message

✅ **Flexible Input**
- Handles extra spaces gracefully
- Multiple format support
- Easy to use textarea

---

## Testing Checklist

✓ Select "Forward for review" option
✓ Email input section appears (blue background)
✓ Enter single email → Submit → Works
✓ Enter multiple emails with semicolons → Submit → Works
✓ Enter emails with extra spaces → Trimmed → Works
✓ Enter no emails → Error toast → Stays on page
✓ Enter invalid email format → Error toast → Shows invalid emails
✓ Enter mix of valid + invalid → Error toast → Shows only invalid
✓ Submit valid emails → Toast shows all emails
✓ Request status changes to IN_PROCESS
✓ forwardedTo and forwardedDate stored correctly
✓ Admin dashboard shows status as "In Review"

---

## Future Enhancements

- [ ] Email history tracking - show who forwarded when
- [ ] Forwarded email logs per request
- [ ] Automatic rejection if no response after X days
- [ ] Email reminder notifications
- [ ] Reply-to-email functionality for reviewers
- [ ] Comments/notes field for reviewers
- [ ] Escalation workflow
- [ ] CC original applicant on forward notification
- [ ] Forward history audit trail
- [ ] Bulk forward to department

