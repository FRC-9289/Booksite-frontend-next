# TODO: Implement Comments on Student PDF Submissions and Admin Form Creation

## Comment Feature
- [x] Create addComment.api.ts for posting comments to backend
- [x] Update Admin.tsx: Add comment textarea and submit button for each submission
- [x] Update Admin.tsx: Display existing comments below each submission
- [x] Update Admin.tsx: On comment submit, call addComment API and send email notification to student

## Admin Form Creation (Integrated into Admin Dashboard)
- [x] Create createGradeConfig.api.ts for posting grade configs to backend
- [x] Create getGradeConfig.api.ts for fetching grade configs from backend
- [x] Update Admin.tsx: Add new section for grade config creation (grade select, male/female room inputs per bus, submit button)

## Dynamic Student Form Rendering
- [x] Update Student.tsx: Fetch grade config on grade change using getGradeConfig.api.ts
- [x] Update Student.tsx: Use fetched config to set dynamic BUS_COUNT and ROOMS_PER_GENDER
- [x] Update Student.tsx: Render rooms dynamically based on config

## Backend Requirements (Informational)
- [ ] Submission schema: Add comments array [{ admin: string, comment: string, timestamp: Date }]
- [ ] Endpoint: POST /api/add-comment { submissionId, comment } -> Add comment, send email
- [ ] Endpoint: POST /api/create-grade-config { grade, maleRooms: [count per bus], femaleRooms: [count per bus] }
- [ ] Endpoint: GET /api/get-grade-config?grade=X -> Return config
- [ ] Update sendEmail to handle 'comment' type notifications

## Testing
- [ ] Test comment submission and email notifications
- [ ] Test grade config creation and dynamic form rendering
