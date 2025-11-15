# TODO: Enable Admin to Configure PDFs for Student Forms

## Frontend Changes
- [x] Update `CreateForms.tsx` to include PDF configuration section
  - Add input for number of PDFs (default 3)
  - Add "Add PDF" button to increase count
  - Add input fields for each PDF name
- [x] Update `createforms.api.ts` to handle PDF configs in API calls
- [x] Update `Student.tsx` to dynamically render PDF uploads based on config

## Backend Changes
- [ ] Update `/api/admin/get-grade-config` to include PDF configs in response
- [ ] Update `/api/admin/create-grade-config` to accept and store PDF configs
- [ ] Ensure database schema supports PDF count and names per grade

## Testing
- [ ] Test admin form creation with custom PDF counts and names
- [ ] Test student form displays correct number of PDF uploads with names
- [ ] Verify backend stores and retrieves configs correctly
