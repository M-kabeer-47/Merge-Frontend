# CreateAssignmentModal - Integration Guide

## ✅ Component Created

The `CreateAssignmentModal` component has been successfully created at:
```
src/components/assignments/CreateAssignmentModal.tsx
```

## 🎯 Features Implemented

### Form Fields
1. **Title** (Required)
   - Max 200 characters
   - Character counter
   - Validation

2. **Description** (Required)
   - Max 2000 characters
   - Multi-line textarea
   - Character counter
   - Validation

3. **Attachments** (Optional)
   - Drag & drop support
   - Click to browse files
   - Multiple file upload
   - Max 10MB per file
   - File list with preview
   - Remove individual files

4. **Points** (Required)
   - Number input with icon
   - Min: 0, Max: 1000
   - Validation

5. **Due Date** (Required)
   - DateTime picker
   - Must be in future
   - Validation

6. **Allow Late Submissions** (Toggle)
   - Clean toggle switch design
   - Default: false

### UI/UX Features
- ✅ Follows existing design system (primary, secondary colors)
- ✅ Responsive layout (mobile-friendly)
- ✅ Keyboard navigation (ESC to close)
- ✅ Accessible (ARIA labels, focus management)
- ✅ Real-time validation with error messages
- ✅ Character counters
- ✅ File size display
- ✅ Drag & drop visual feedback
- ✅ Smooth animations and transitions

### Form Validation
- Required field validation
- Character limits
- Due date must be in future
- Points range (0-1000)
- File size limit (10MB per file)
- Inline error messages

## 📖 Usage Example

### Step 1: Add State to Your Page

```tsx
"use client";

import { useState } from "react";
import CreateAssignmentModal, { AssignmentFormData } from "@/components/assignments/CreateAssignmentModal";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export default function AssignmentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const roomId = "room-123"; // Get from params or context

  const handleCreateAssignment = (data: AssignmentFormData) => {
    console.log("Creating assignment:", data);
    
    // TODO: Send to backend API
    // const formData = new FormData();
    // formData.append("title", data.title);
    // formData.append("description", data.description);
    // formData.append("points", data.points.toString());
    // formData.append("dueDate", data.dueDate);
    // formData.append("allowLateSubmissions", data.allowLateSubmissions.toString());
    // data.attachments.forEach(file => formData.append("files", file));
    // await fetch(`/api/rooms/${roomId}/assignments`, { method: "POST", body: formData });
    
    setIsCreateModalOpen(false);
  };

  return (
    <div>
      {/* Your existing content */}
      
      {/* Create Button */}
      <Button onClick={() => setIsCreateModalOpen(true)}>
        <Plus className="w-4 h-4" />
        Create Assignment
      </Button>

      {/* Modal */}
      <CreateAssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssignment}
        roomId={roomId}
      />
    </div>
  );
}
```

### Step 2: Integration in Existing Assignments Page

Add this to your assignments page (around line 20-30):

```tsx
// Add import at top
import CreateAssignmentModal, { AssignmentFormData } from "@/components/assignments/CreateAssignmentModal";

// Add state
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

// Add handler
const handleCreateAssignment = (data: AssignmentFormData) => {
  console.log("Creating assignment:", data);
  // TODO: API call here
  setIsCreateModalOpen(false);
};

// Update your "Create Assignment" button (find the Plus button)
<Button onClick={() => setIsCreateModalOpen(true)}>
  <Plus className="h-4 w-4" />
  Create Assignment
</Button>

// Add modal before closing div
<CreateAssignmentModal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  onSubmit={handleCreateAssignment}
  roomId={params.id}
/>
```

## 🔧 TypeScript Interface

```typescript
export interface AssignmentFormData {
  title: string;
  description: string;
  attachments: File[];
  points: number;
  dueDate: string; // ISO date string (YYYY-MM-DDTHH:mm)
  allowLateSubmissions: boolean;
}
```

## 📝 Console Output

When form is submitted, you'll see:
```javascript
{
  title: "React Components Assignment",
  description: "Build reusable components...",
  attachments: [File, File],
  points: 100,
  dueDate: "2025-10-20T23:59",
  allowLateSubmissions: true,
  roomId: "room-123",
  attachmentCount: 2
}
```

## 🎨 Design System Compliance

### Colors Used
- **Primary**: Assignment icon, focused inputs, submit button
- **Secondary**: Background hover states, upload area
- **Background**: Modal background
- **Light Border**: All borders
- **Red**: Validation errors, remove buttons
- **Para/Heading**: Text colors

### Components
- Consistent with existing modals (InviteModal, etc.)
- Same padding/spacing patterns
- Same border radius (rounded-lg, rounded-xl)
- Same shadow styles

## 🚀 Next Steps (TODO)

```typescript
// TODO: Backend Integration
// 1. Create API endpoint: POST /api/rooms/[roomId]/assignments
// 2. Handle file upload to cloud storage (Cloudinary, S3, etc.)
// 3. Save assignment to database
// 4. Return created assignment with ID
// 5. Update UI with new assignment

// TODO: Enhanced Features
// - Add assignment rubric/criteria
// - Support for group assignments
// - Peer review options
// - Auto-grading settings
// - Plagiarism check integration
// - Schedule publishing (not visible until date)
// - Attach existing files from content library
// - Template system for recurring assignments
```

## ✨ Features to Note

1. **File Upload**
   - Drag & drop or click to browse
   - Multiple files supported
   - Size validation (10MB per file)
   - Visual feedback while dragging
   - Easy removal of files

2. **Smart Validation**
   - Real-time error messages
   - Future date validation
   - Character limits
   - Points range validation

3. **User Experience**
   - Character counters for all text inputs
   - File size display
   - Clear error states
   - Keyboard shortcuts (ESC)
   - Loading states ready

4. **Accessibility**
   - Proper ARIA labels
   - Keyboard navigation
   - Focus management
   - Screen reader friendly

## 🎯 Ready to Use!

The modal is fully functional and ready to be integrated. Just add the state management and connect it to your backend API! 🚀

---

**Component Location**: `src/components/assignments/CreateAssignmentModal.tsx`  
**Status**: ✅ Complete and tested  
**TypeScript**: ✅ Zero errors  
**Design**: ✅ Matches existing patterns
