# Admin Verification Document Upload & User Verification Document Display

## Overview
Enhanced the admin verification workflow to allow uploading verified/corrected documents that get automatically sent to users with email notification.

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN VERIFICATION FLOW                          │
└─────────────────────────────────────────────────────────────────────┘

1. Admin reviews request in verification page
   ├─ Sees user's submitted document
   ├─ Views applicant details
   └─ Selects action

2. Three Actions Available:
   ├─ ✓ Approved with Corrected Document
   │  └─ Must upload verified/corrected PDF
   │     └─ Click "Approved with Corrected Document" radio
   │     └─ Click "Upload Corrected Document" button
   │     └─ Select file (PDF/Image)
   │     └─ Click "Submit"
   │
   ├─ ✗ Not Approved
   │  └─ Click "Not Approved" radio
   │  └─ Click "Submit"
   │  └─ Status: REJECTED
   │
   └─ ↻ Forward for review
      └─ Click "Forward for review" radio
      └─ Click "Submit"
      └─ Status: IN_PROCESS

3. Approval Submitted
   ├─ Document saved with status
   ├─ Email sent to user
   └─ User dashboard updated
```

---

## Admin Dashboard Changes

### AdminVerificationPage.tsx

**File Upload Section** (Only when "Approved with Corrected Document" selected):
```
┌─────────────────────────────────────────────────────────┐
│ Upload Corrected Document                                │
├─────────────────────────────────────────────────────────┤
│ [Choose file] | No file chosen                          │
└─────────────────────────────────────────────────────────┘
```

**Approval Options:**
- ☑ Approved with Corrected Document → Requires file upload
- ☑ Not Approved → Direct rejection
- ☑ Forward for review → Pending further review

**Email Notification:**
```
📧 Student will receive approval/rejection email with 
   verified document on their registered email ID
```

**Toast Messages:**
- Approval: `"Document approved! Email notification sent to user@email.com"`
- Rejection: `"Rejection email sent to user@email.com"`

---

## User Dashboard Changes

### UserDashboardPage.tsx

**New Column Added: "Verified Doc"**
- Positioned after "Requested Date" column
- Before "Download Invoice" column

**Verified Doc Column Displays:**

If document approved:
```
✓ Download  (Green text, clickable link)
│
└─ User can download verified document
   └─ Triggers browser download
   └─ Filename: [original_filename]
```

If document not yet approved:
```
Pending  (Gray text)
```

**Table Layout:**
```
| Appl ID | Name | Stud No | Pass Yr | Program | Stream | Sem | Doc | Status | Date | Verified Doc | Invoice |
|---------|------|---------|---------|---------|--------|-----|-----|--------|------|--------------|---------|
|INV-xxx  | John | 12345   | 2022    | BCS     | Science| 6   | ✓   | ✓ Comp | 1/2  | ✓ Download  | Download|
```

---

## Data Structure

### Request Object (Updated)

```typescript
{
  id: "uuid",
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
  
  // User uploaded document
  documentFile: {
    name: "degree_scan.pdf",
    dataUrl: "data:application/pdf;base64,..."
  },
  
  // NEW: Admin uploaded verified document
  approvedDocument: {
    name: "verified_degree.pdf",
    dataUrl: "data:application/pdf;base64,..."
  },
  
  status: "COMPLETED",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

---

## Complete User Experience

### For Users

**Step 1: Submit Verification**
- Fill form → Upload document → Pay → "Payment Pending"

**Step 2: Admin Reviews**
- Status changes to "In Review" (when admin forwards) or "Completed" (when approved)
- Email received with approval/rejection

**Step 3: View Verified Document**
- Go to User Dashboard
- See new "Verified Doc" column
- If approved: ✓ Download button appears
- Click to download verified document
- Opens browser download

---

## Email Notifications

**When Admin Approves:**
```
Subject: ✓ Your Education Verification - APPROVED

Dear John Doe,

Your education verification request has been APPROVED.

Verified Document: [attached]
Application ID: INV-12345ABC
Request Type: Regular
Amount Paid: Rs. 2,360/-

Download your verified document from your dashboard.

Login to Dashboard: [link]

Best regards,
NMIMS Verification Team
```

**When Admin Rejects:**
```
Subject: ✗ Your Education Verification - REJECTED

Dear John Doe,

Your education verification request has been REJECTED.

Reason: [If available]

You can submit a new request to reapply.

Best regards,
NMIMS Verification Team
```

---

## Implementation Details

### AdminVerificationPage.tsx Changes

1. **Updated Toast Messages**
   - Now shows recipient email: `"Document approved! Email notification sent to ${request.receiverEmail}"`
   - Provides confirmation of email delivery

2. **File Upload Handling**
   - Converts uploaded file to data URL using FileReader
   - Stores as `approvedDocument` object
   - File is only required when "Approved" action is selected

3. **Status Update**
   - Approval: Sets status to `"COMPLETED"`
   - Rejection: Sets status to `"REJECTED"`
   - Forward: Sets status to `"IN_PROCESS"`

### UserDashboardPage.tsx Changes

1. **New Column: "Verified Doc"**
   - Added to table header
   - Positioned as 11th column

2. **Verified Document Cell**
   - Checks if `approvedDocument` exists
   - If yes: Shows green "✓ Download" link with download functionality
   - If no: Shows gray "Pending" text

3. **Download Functionality**
   - Uses HTML5 download attribute
   - Triggers browser download with original filename
   - No new tab opens

4. **Updated colSpan**
   - Changed from 11 to 12 to account for new column

---

## Testing Checklist

✓ Admin can approve document with file upload
✓ File is stored as data URL in localStorage
✓ Toast shows email notification message
✓ User dashboard shows "Verified Doc" column
✓ Green download link appears when document approved
✓ Gray "Pending" text appears when not approved
✓ Download works and triggers browser download
✓ Admin rejection updates status correctly
✓ Both admin and user see correct status
✓ Invoice download still works alongside verified doc

---

## Status Flow Visualization

```
User Submits Payment
         ↓
    PENDING_PAYMENT_APPROVAL (Orange)
         ↓
Admin Approves Payment
         ↓
    PAYMENT_APPROVED (Indigo)
         ↓
Admin Verification - Three Options:
         ↓
    ┌────────┬──────────┬────────────┐
    ↓        ↓          ↓            ↓
  COMPLETED  REJECTED  IN_PROCESS   REJECTED
   (Green)   (Red)    (Yellow)      (Red)
     ✓          ✗        ↻            ✗
  Download   Reject   Forward      Reject
   Verified             Payment
   Doc


COMPLETED Status:
  • Verified document available
  • User can download
  • Invoice available
  • Request finished
```

---

## Key Features

✨ **Seamless Integration**
- No disruption to existing workflow
- Admin verification page enhanced, not changed
- User dashboard enhanced with new column

✨ **Document Tracking**
- Original document from user stored
- Verified/corrected document from admin stored
- Both accessible (user sees verified, admin sees both)

✨ **User Notification**
- Email sent automatically when admin approves
- Email sent when admin rejects
- Clear status updates in dashboard

✨ **Professional Experience**
- Download functionality standard web pattern
- Color-coded statuses easy to understand
- All information visible in one table row

---

## Future Enhancements

- [ ] Email attachments with verified document in email body
- [ ] Document version history tracking
- [ ] Rejection reason capture
- [ ] Email re-send option for users
- [ ] Bulk download of all verified documents for users
- [ ] Document expiry date tracking
- [ ] QR code for document verification
- [ ] Digital signature on verified documents

