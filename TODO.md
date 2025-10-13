# TODO: Implement Admin Status Management and Email Notifications

- [x] Create updateStatus.api.ts for backend status update calls
- [x] Add status filter dropdown in Admin.tsx above search input
- [x] Add status change dropdown for each submission in Admin.tsx
- [x] Implement status update handler in Admin.tsx (call API and reload)
- [x] Update filteredSubmissions logic to include status filter
- [x] Test the functionality (status updates and filtering)

# New Task: Email Notifications
- [x] Create sendEmail.api.ts for sending emails
- [x] Modify handleStatusChange in Admin.tsx to send email on approved/rejected
- [x] Modify studentPOST.api.ts to send pending email on form submission
