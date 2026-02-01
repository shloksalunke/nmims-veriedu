# Forward for Review - Quick Reference Guide

## How It Works

### Three Verification Actions Available

```
1. ✓ APPROVED with Corrected Document
   └─ Requires file upload
   └─ Sets status to: COMPLETED
   └─ Verified document sent to user

2. ✗ NOT APPROVED
   └─ No additional fields
   └─ Sets status to: REJECTED
   └─ Rejection email sent to user

3. ↻ FORWARD FOR REVIEW (NEW)
   └─ Requires email addresses
   └─ Sets status to: IN_PROCESS
   └─ Sends to internal reviewers
```

---

## Step-by-Step: How to Forward a Request

### Step 1: Access Admin Verification Page
```
URL: /admin/verification/:id
Navigate from Admin Dashboard → View/Process button
```

### Step 2: See Request Details
```
┌──────────────────────────────────────────┐
│ Document Approval                         │
├──────────────────────────────────────────┤
│ Name:              John Doe               │
│ Passing Year:      2022                   │
│ Student ID:        12345                  │
│ CGPA:              3.5                    │
│ Email/Phone:       john@email.com / ...  │
└──────────────────────────────────────────┘
```

### Step 3: Select "Forward for review"
```
☐ Approved with Corrected Document
☐ Not Approved
☑ Forward for review        ← CLICK THIS
```

### Step 4: Email Input Field Appears
```
┌─────────────────────────────────────────────────────────┐
│ Email addresses (semicolon separated if multiple):      │
├─────────────────────────────────────────────────────────┤
│ reviewer1@nmims.edu; reviewer2@nmims.edu                │
│                                                          │
│                                                          │
├─────────────────────────────────────────────────────────┤
│ 💡 Enter multiple email addresses separated by `;`      │
└─────────────────────────────────────────────────────────┘
```

### Step 5: Enter Email Addresses
```
Format options:
• Single:    reviewer@nmims.edu
• Multiple:  reviewer1@nmims.edu; reviewer2@nmims.edu
• With names: john.smith@nmims.edu; sarah.khan@nmims.edu; team@verification.edu
• With spaces: reviewer1@nmims.edu  ;  reviewer2@nmims.edu  (spaces auto-trimmed)
```

### Step 6: Click Submit Button
```
      ┌──────────────────┐
      │    Submit        │
      └──────────────────┘
```

### Step 7: Validation & Confirmation
```
✓ All emails valid?
  └─→ SUCCESS
      ├─ Notification: "Request forwarded to 2 reviewer(s): reviewer1@nmims.edu, reviewer2@nmims.edu"
      ├─ Status changed to: IN_PROCESS
      └─ Redirect to: Admin Dashboard

✗ Missing emails?
  └─→ ERROR
      ├─ Toast: "Missing Reviewer Emails"
      └─ "Please enter at least one email address to forward the request."

✗ Invalid email format?
  └─→ ERROR
      ├─ Toast: "Invalid Email Format"
      └─ "Invalid emails: invalid@domain, @nodomain.com"
```

---

## Valid Email Examples

### ✓ Accepted Formats
```
john.smith@nmims.edu              ✓
sarah-khan@university.ac.in       ✓
verification.team@nmims.edu       ✓
reviewer1@nmims.edu               ✓
r.singh@nmims.ac.in               ✓
admin123@verification.edu         ✓
```

### ✗ Rejected Formats
```
john.smith                         ✗ Missing @domain
@nmims.edu                         ✗ Missing username
john@                              ✗ Missing domain
john smith@nmims.edu               ✗ Spaces in username
john.smith@.edu                    ✗ Missing domain name
```

---

## Multiple Email Examples

### Example 1: Two Reviewers
```
Input:  reviewer1@nmims.edu; reviewer2@nmims.edu
Result: ✓ Valid - 2 emails parsed
Toast:  "Request forwarded to 2 reviewer(s): reviewer1@nmims.edu, reviewer2@nmims.edu"
```

### Example 2: Three Reviewers (with spaces)
```
Input:  reviewer1@nmims.edu  ;  reviewer2@nmims.edu  ;  reviewer3@nmims.edu
Result: ✓ Valid - spaces trimmed automatically
Toast:  "Request forwarded to 3 reviewer(s): reviewer1@nmims.edu, reviewer2@nmims.edu, reviewer3@nmims.edu"
```

### Example 3: Department Team
```
Input:  john@nmims.edu; sarah@nmims.edu; ahmed@nmims.edu; maria@nmims.edu
Result: ✓ Valid - 4 emails parsed
Toast:  "Request forwarded to 4 reviewer(s): john@nmims.edu, sarah@nmims.edu, ahmed@nmims.edu, maria@nmims.edu"
```

### Example 4: Mixed with Invalid
```
Input:  reviewer1@nmims.edu; invalid.email; reviewer2@nmims.edu
Result: ✗ Invalid - one email has no @domain
Toast:  "Invalid Email Format"
        "Invalid emails: invalid.email"
Action: User must fix and resubmit
```

---

## What Gets Stored

When you successfully forward a request, this is saved:

```javascript
{
  // ... existing request data ...
  
  status: "IN_PROCESS",                    // Status changed to "In Review"
  
  forwardedTo: [                           // List of reviewer emails
    "reviewer1@nmims.edu",
    "reviewer2@nmims.edu",
    "reviewer3@nmims.edu"
  ],
  
  forwardedDate: "2024-01-15T10:30:00.000Z"  // When it was forwarded
}
```

---

## What Happens Next

### In Admin Dashboard
```
Request Status shows: "In Review" (Yellow badge)
Request appears in: Document Verification table
Action: Admin can still view and process request
```

### Email Notifications
```
Each reviewer receives email:
├─ Subject: 📋 Education Verification Request - Forwarded for Review
├─ Applicant details attached
├─ Request needs review
└─ Link to access dashboard

Emails sent to:
├─ reviewer1@nmims.edu ✓ Sent
├─ reviewer2@nmims.edu ✓ Sent
├─ reviewer3@nmims.edu ✓ Sent
```

### Request Status Flow
```
PENDING_PAYMENT_APPROVAL
         ↓
PAYMENT_APPROVED
         ↓
   APPROVAL OPTIONS:
   ┌─────────────────────┐
   │                     │
   ↓                     ↓
COMPLETED          IN_PROCESS
(Approved)         (Forwarded)
  ✓ Download        ↻ Review
  
   OR
   ↓
REJECTED
(Not Approved)
```

---

## Common Tasks

### Task: Forward to Department Heads
```
1. Click "Forward for review"
2. Enter emails: head1@nmims.edu; head2@nmims.edu; head3@nmims.edu
3. Click Submit
4. Toast confirms: "Request forwarded to 3 reviewer(s)"
```

### Task: Forward to Review Committee
```
1. Click "Forward for review"
2. Enter: john@committee.edu; sarah@committee.edu; verification@committee.edu
3. Click Submit
4. All 3 members receive notification
```

### Task: Forward to Multiple Departments
```
1. Click "Forward for review"
2. Enter all emails separated by semicolons
3. Click Submit
4. Request visible as "In Review" on dashboard
```

### Task: Correct & Resubmit
```
1. If email invalid → See error toast
2. Check entered email format
3. Edit in textarea
4. Click Submit again
5. If still invalid → Error shows exact invalid emails
6. Fix and resubmit
```

---

## Tips & Tricks

### Copy-Paste Multiple Emails
```
From Excel/Document:
reviewer1@nmims.edu
reviewer2@nmims.edu
reviewer3@nmims.edu

Format as:
reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu

Paste into textarea and submit ✓
```

### Easy Addition/Removal
```
Current: reviewer1@nmims.edu; reviewer2@nmims.edu
Need to add reviewer3? Simply add:
reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu

Need to remove reviewer2? Delete:
reviewer1@nmims.edu; reviewer3@nmims.edu
```

### Test Email Format
```
If unsure about email validity, check:
✓ Has @ symbol
✓ Has domain after @ (like nmims.edu)
✓ Has username before @ (like john.smith)
✓ No spaces around @ (valid: user@domain | invalid: user @ domain)
```

---

## Status in Dashboard

### How to Identify Forwarded Requests

```
Admin Dashboard - Document Verification Table:

Status Column Shows: "In Review" (Yellow)
↓
This means: ↻ Forwarded for internal review

Details Available:
├─ Request marked as IN_PROCESS
├─ Reviewer emails stored in: forwardedTo
├─ Forwarding time stored in: forwardedDate
└─ Can still view request details

Action Available:
├─ Click "View/Process" to see details
├─ Can see who forwarded it to
└─ Can see when it was forwarded
```

---

## Troubleshooting

### Problem: Email input not appearing
```
Solution: 
1. Make sure you selected "Forward for review" radio button
2. Wait 1 second for UI to update
3. Blue email section should appear below radio buttons
```

### Problem: Invalid email error even though format looks correct
```
Solution:
1. Check for typos in domain name
2. Ensure email has: username@domain.extension
3. Example of correct: john.smith@nmims.edu
4. Copy exact email from source to avoid spaces
```

### Problem: Toast shows different invalid emails than expected
```
Solution:
1. Check for hidden characters or spaces
2. Verify each email is complete: user@domain.com
3. Copy valid email and paste fresh
4. Try one email at a time first, then add more
```

### Problem: Need to change recipients after forwarding
```
Solution:
1. Cannot modify after submission
2. Request status is now "In Review"
3. If recipients wrong, note for next time
4. Can forward again if needed (creates new entry)
```

---

## Keyboard Shortcuts

```
Tab        → Move between fields
Shift+Tab  → Move to previous field
Enter      → In textarea: creates new line (not submit)
           → Use Submit button to submit
Ctrl+A     → Select all text in textarea
Ctrl+C     → Copy selected emails
Ctrl+V     → Paste emails (make sure separator is ;)
```

