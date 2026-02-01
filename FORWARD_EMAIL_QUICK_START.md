# 🎯 Admin Forward Email Feature - Quick Start

## What's New?

When reviewing a verification request, admin can now:
1. **Forward for internal review**
2. **Enter multiple reviewer emails**
3. **System validates and notifies all reviewers**

---

## How to Use (3 Steps)

### Step 1️⃣ Select "Forward for review"
```
In Admin Verification Page:
☑ Forward for review  ← Click this radio button
```

### Step 2️⃣ Enter Reviewer Emails
```
Blue textarea appears:

📧 Email addresses (semicolon separated if multiple):

john@nmims.edu; sarah@nmims.edu; ahmed@nmims.edu
```

### Step 3️⃣ Click Submit
```
System validates emails:
✓ All valid?  → Success toast + Forward sent
✗ Invalid?    → Error toast + Shows invalid emails
```

---

## Email Format

### ✓ Correct Format
```
reviewer1@nmims.edu; reviewer2@nmims.edu; reviewer3@nmims.edu
```

### 📝 Format Variations (All Work)
```
Single:       reviewer@nmims.edu
Multiple:     r1@nmims.edu; r2@nmims.edu
With spaces:  r1@nmims.edu  ;  r2@nmims.edu  (spaces trimmed)
Long domain:  reviewer@nmims.ac.in; team@verification.edu
```

### ✗ Invalid Format (Will Fail)
```
no-at-sign
@nmims.edu
reviewer@
missing.com
```

---

## What Happens

### When Forward Succeeds ✓
```
Status Changes To: IN_PROCESS (Yellow badge)

Request Data Saved:
├─ forwardedTo: [array of emails]
├─ forwardedDate: [timestamp]
└─ status: "IN_PROCESS"

Toast Shows:
  "Request forwarded to 3 reviewer(s): 
   john@nmims.edu, sarah@nmims.edu, ahmed@nmims.edu"

Emails Sent To:
├─ john@nmims.edu ✓
├─ sarah@nmims.edu ✓
└─ ahmed@nmims.edu ✓
```

### When Forward Fails ✗
```
If Empty:
  Error: "Missing Reviewer Emails"
  Message: "Please enter at least one email address"

If Invalid:
  Error: "Invalid Email Format"
  Message: "Invalid emails: invalid@, @domain.com"
  
Action: Stays on page, user can fix and retry
```

---

## Real-World Examples

### Example 1: Forward to Department Heads
```
Input:  head.cs@nmims.edu; head.science@nmims.edu; head.admin@nmims.edu
Result: ✓ Sent to all 3 department heads
```

### Example 2: Forward to Review Committee
```
Input:  chair@committee.edu; secretary@committee.edu; member@committee.edu
Result: ✓ All 3 committee members notified
```

### Example 3: Forward to Multiple Departments
```
Input:  verify@cs.nmims.edu; verify@sci.nmims.edu; verify@admin.nmims.edu
Result: ✓ Sent to all 3 verification teams
```

---

## Keyboard Tips

| Shortcut | Action |
|----------|--------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Ctrl+A | Select all emails |
| Ctrl+C | Copy emails |
| Ctrl+V | Paste emails |
| Enter | New line in textarea (not submit) |

---

## Common Questions

### Q: Can I forward to 1 person?
**A:** Yes. Enter: `reviewer@nmims.edu` (no semicolon needed)

### Q: What about spaces around semicolon?
**A:** Spaces are automatically trimmed. Both work:
- `r1@nmims.edu;r2@nmims.edu`
- `r1@nmims.edu ; r2@nmims.edu`

### Q: What if I have 10 reviewers?
**A:** Just enter all 10 separated by semicolons. System sends to all.

### Q: What if I made a typo?
**A:** System shows error. Edit the email and resubmit.

### Q: Can I modify after forwarding?
**A:** No, but you can check what was forwarded in the request data.

---

## Status Flow

```
Payment Approved (Indigo)
     ↓
Forward for Review Selected
     ↓
Emails Entered & Validated
     ↓
Submit Clicked
     ↓
Status: IN_PROCESS (Yellow)
     ↓
Request shows "In Review" on Dashboard
     ↓
Reviewer Emails Notified
```

---

## Email That Reviewers Receive

```
From: admin@nmims.edu
To: reviewer@nmims.edu
Subject: 📋 Education Verification - Forwarded for Review

Dear Reviewer,

Request forwarded for your review:

Applicant: John Doe
Student ID: 12345
Program: BCS
Year: 2022
Request ID: INV-12345ABC

Please login to dashboard to review.
```

---

## Troubleshooting

### Problem: Blue section not appearing
**Solution:** Make sure "Forward for review" radio is selected

### Problem: Email validation errors
**Solution:** Check for:
- @ symbol present
- Domain after @
- No spaces in email
- Valid extension (.com, .edu, .in, etc.)

### Problem: Too many emails?
**Solution:** No limit. Add as many as needed separated by `;`

### Problem: Confirm what was forwarded?
**Solution:** Check admin dashboard - request shows status "In Review"

---

## Statistics

- ✅ Email format validation: Built-in
- ✅ Multiple recipients: Unlimited
- ✅ Auto-trimmed whitespace: Yes
- ✅ Invalid email detection: Yes
- ✅ Timestamp tracking: Yes
- ✅ Request history: Stored

---

## Key Benefits

| Feature | Benefit |
|---------|---------|
| Semicolon separator | Easy to copy/paste from list |
| Email validation | No invalid emails sent |
| Auto-trim spaces | Flexible input format |
| Error messages | Know exactly what's wrong |
| Toast confirmation | See all recipients confirmed |
| Status tracking | Know when request was forwarded |
| Unlimited recipients | No restriction on team size |

---

## Testing Checklist

- [ ] Select "Forward for review"
- [ ] Blue textarea appears
- [ ] Enter single email → Success
- [ ] Enter multiple emails → Success
- [ ] Leave empty → Error shows
- [ ] Invalid email → Error shows invalid one(s)
- [ ] Spaces around semicolon → Trimmed automatically
- [ ] Toast shows all emails
- [ ] Status changes to "In Review"
- [ ] Admin dashboard shows "In Review" status

