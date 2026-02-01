# Payment Approval Workflow

## Overview
Implemented a complete payment verification workflow between user submission and admin approval.

---

## Flow Architecture

### 1. **User Payment Status: `PENDING_PAYMENT_APPROVAL`**
- When user completes payment on `/verify-document` page
- Request is created with status: `PENDING_PAYMENT_APPROVAL`
- Request appears immediately in Admin Dashboard's "Payment Approval Queue"
- User sees status: **"Payment Pending"** (orange badge) on User Dashboard

### 2. **Admin Payment Approval Queue**
New section added at the top of Admin Dashboard (`/admin/dashboard`):
- **Alert banner**: Shows count of pending payment verifications
- **Dedicated table** with columns:
  - SR. NO.
  - Name (applicant)
  - Student No.
  - Amount Paid (in Rs)
  - Request Type (Regular/Urgent)
  - Paid Date
  - Action buttons: **✓ Approve** | **✕ Reject**

### 3. **Admin Actions**

#### **Approve Payment** ✓
- Click "Approve" button
- Status changes to: `PAYMENT_APPROVED`
- Toast notification: "Payment Approved - Invoice will be sent to user"
- Request moves from Payment Queue to Verification Queue
- User sees status: **"Payment Approved"** (indigo badge)
- Next step: Request waits for document verification by admin

#### **Reject Payment** ✕
- Click "Reject" button
- Confirmation dialog appears
- Status changes to: `PAYMENT_REJECTED`
- Request is marked as "Rejected" on both dashboards
- Toast notification: "Payment Rejected"
- User sees status: **"Rejected"** (red badge)
- User can submit a new verification request if needed

---

## Status Color Coding

| Status | Color | Display Text |
|--------|-------|--------------|
| `PENDING_PAYMENT_APPROVAL` | Orange | "Payment Pending" |
| `PAYMENT_APPROVED` | Indigo | "Payment Approved" |
| `PAYMENT_REJECTED` | Red | "Rejected" |
| `IN_PROCESS` | Yellow | "In Review" |
| `COMPLETED` | Green | "Completed" |

---

## Dashboards Display

### **Admin Dashboard** (`/admin/dashboard`)
1. **Payment Approval Queue** (NEW - top section)
   - Shows only: `PENDING_PAYMENT_APPROVAL` requests
   - Orange header banner
   - Approve/Reject buttons

2. **Document Verification** (existing section below)
   - Shows: `PAYMENT_APPROVED`, `IN_PROCESS`, `COMPLETED`, `REJECTED` requests
   - View/Process button for each request

### **User Dashboard** (`/user-dashboard`)
- Shows user's own verification requests
- Status shows: Payment Pending → Payment Approved → In Review → Completed
- Download Invoice button available

---

## Key Code Changes

### VerifyDocumentPage.tsx
```tsx
status: "PENDING_PAYMENT_APPROVAL",  // Changed from "PENDING"
```

### AdminDashboardPage.tsx
```tsx
// New function: Filter for payment pending requests
const paymentPendingRequests = verificationRequests.filter((r) => r.status === "PENDING_PAYMENT_APPROVAL");

// New functions: Handle approval and rejection
const approvePayment = (id: string) => { /* ... */ }
const rejectPayment = (id: string) => { /* ... */ }

// New render section: Payment Approval Queue above existing verification table
```

### UserDashboardPage.tsx & AdminDashboardPage.tsx
```tsx
const getStatusDisplay = (status: string) => {
  switch (status) {
    case "PENDING_PAYMENT_APPROVAL": return "Payment Pending";
    case "PAYMENT_APPROVED": return "Payment Approved";
    case "PAYMENT_REJECTED": return "Rejected";
    // ... rest
  }
}
```

---

## Data Flow

```
User submits verification form with payment
    ↓
Request created with status: PENDING_PAYMENT_APPROVAL
    ↓
Request appears in Admin Dashboard Payment Queue
    ↓
┌─────────────────────────────────────────┐
│         Admin Reviews Payment           │
└─────────────────────────────────────────┘
    ↓
    ├─→ ✓ Approve
    │      └─→ Status: PAYMENT_APPROVED
    │         Moves to Verification Queue
    │         Appears in User Dashboard
    │         Ready for document review
    │
    └─→ ✕ Reject
           └─→ Status: PAYMENT_REJECTED
              Appears as "Rejected" on both dashboards
              User must resubmit new request
```

---

## Benefits

✅ **Clear approval workflow**: Payment verification separated from document verification
✅ **Admin visibility**: Dedicated payment queue prevents missing approvals
✅ **User transparency**: Clear status updates at each step
✅ **Error handling**: Easy rejection with automatic status updates on both sides
✅ **Professional**: Mimics real payment gateway workflows

---

## Future Enhancements

- [ ] Auto-send invoice PDF to user email when payment approved
- [ ] Add payment method tracking (Card, UPI, etc.)
- [ ] Capture rejection reason when rejecting payment
- [ ] Retry payment option for rejected payments
- [ ] Payment receipt download from user dashboard
- [ ] Real payment gateway integration (Razorpay)

