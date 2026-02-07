
# Implementation Plan: Inquiry Management, Auth UI, Blog Image Upload, and Partners Section Update

## Overview
This plan covers four major features:
1. **Inquiry Management System** - Allow admins to view, manage, and respond to user inquiries
2. **Login/Signup Buttons** - Add visible authentication buttons to the header
3. **Blog Image Upload** - Replace URL-only input with file upload functionality
4. **Partners Section Update** - Update broker logos with proper brand colors

---

## 1. Inquiry Management System

### Database Changes
Create a new `inquiries` table to store contact form submissions:

```text
Table: public.inquiries
+--------------+------------------+------------------------+
| Column       | Type             | Details                |
+--------------+------------------+------------------------+
| id           | uuid             | Primary key            |
| name         | text             | Required               |
| email        | text             | Required               |
| phone        | text             | Optional               |
| course       | text             | Optional               |
| message      | text             | Required               |
| status       | text             | 'pending'/'resolved'   |
| created_at   | timestamptz      | Default: now()         |
| updated_at   | timestamptz      | Default: now()         |
+--------------+------------------+------------------------+
```

### RLS Policies
- Anyone can INSERT (submit inquiries)
- Only admins can SELECT, UPDATE, DELETE

### Frontend Changes
- **ContactSection.tsx**: Update form to save submissions to database
- **AdminInquiries.tsx**: New page with table view of all inquiries
- **AdminInquiryDetail.tsx**: View/manage individual inquiry details
- **useInquiries.ts**: React Query hooks for CRUD operations
- **AdminSidebar.tsx**: Add Inquiries navigation link
- **AdminDashboard.tsx**: Add inquiry stats card

---

## 2. Login and Signup Buttons

### New Pages
- **src/pages/Login.tsx**: User login page with email/password
- **src/pages/Signup.tsx**: User registration page with email verification

### Header Updates
- Add "Login" and "Sign Up" buttons to the right side of the header
- Buttons visible only when user is NOT logged in
- When logged in, show user avatar/name with dropdown for logout
- Responsive design with proper mobile menu integration

### Auth Context Updates
- Add `signUp` method to AuthContext
- Handle email verification flow

---

## 3. Blog Image Upload System

### Storage Setup
Create a storage bucket for blog images:
```text
Bucket: blog-images
- Public access for reading
- Authenticated uploads only
- File size limit: 5MB
- Allowed formats: jpg, jpeg, png, webp, gif
```

### RLS Policies for Storage
- Public read access
- Admin-only upload/delete

### Component Updates

**RichTextEditor.tsx**:
- Add file upload button alongside URL input in image dialog
- Drag-and-drop zone for images
- Image preview before insertion
- Progress indicator during upload
- Validation for file size (max 5MB) and format

**AdminBlogEditor.tsx**:
- Replace cover image URL input with upload component
- Support both local file upload and URL input
- Image preview with remove option

### New Components
- **ImageUploader.tsx**: Reusable upload component with:
  - File input button
  - Drag-and-drop zone
  - Upload progress
  - Preview
  - Delete functionality

---

## 4. Partners Section - Official Logos with Brand Colors

### Logo Sources and Colors
Update the partners array with SVG-based logos or high-quality images with proper brand colors:

| Platform | Primary Brand Color |
|----------|-------------------|
| NSE | Blue (#003366) |
| BSE | Red (#DC143C) |
| SEBI | Blue/Gold |
| Zerodha | Blue (#387ED1) |
| Angel One | Red (#FF3D00) |
| Upstox | Purple (#6B3FA0) |
| Groww | Green (#00D09C) |
| 5Paisa | Blue (#2B6CB0) |

### Component Updates
**PartnersMarquee.tsx**:
- Update partner logos with official sources
- Apply original brand colors (remove any grayscale filters)
- Ensure consistent sizing and alignment
- Add hover effects that maintain brand identity

---

## Technical Implementation Details

### File Structure Changes

```text
src/
├── pages/
│   ├── Login.tsx (new)
│   ├── Signup.tsx (new)
│   ├── AdminInquiries.tsx (new)
│   └── AdminInquiryDetail.tsx (new)
├── hooks/
│   └── useInquiries.ts (new)
├── components/
│   ├── Header.tsx (update)
│   ├── ContactSection.tsx (update)
│   ├── PartnersMarquee.tsx (update)
│   ├── admin/
│   │   └── AdminSidebar.tsx (update)
│   └── editor/
│       ├── RichTextEditor.tsx (update)
│       └── ImageUploader.tsx (new)
└── contexts/
    └── AuthContext.tsx (update)
```

### Database Migration Summary
1. Create `inquiries` table with proper columns
2. Enable RLS on inquiries table
3. Create policies for public insert, admin-only read/update/delete
4. Create storage bucket `blog-images`
5. Set up storage policies

### Security Considerations
- All admin operations protected by RLS using `has_role()` function
- Email verification required for new signups
- Input validation on all forms (name, email, file types)
- File upload size limits enforced both client and server side
- Secure storage URLs for uploaded images

---

## Implementation Order

1. **Database & Storage Setup** - Create inquiries table and blog-images bucket
2. **Inquiry Management** - Backend hooks and admin pages
3. **Contact Form Integration** - Connect form to database
4. **Auth Pages** - Login and Signup pages
5. **Header Updates** - Add auth buttons
6. **Image Upload Component** - Create reusable uploader
7. **Blog Editor Updates** - Integrate image upload
8. **Partners Section** - Update logos and colors

---

## Expected Outcomes
- Admins can efficiently manage all customer inquiries from the dashboard
- Users can easily access login/signup from any page
- Blog authors can upload images directly instead of finding URLs
- Partners section looks professional with authentic brand representation
