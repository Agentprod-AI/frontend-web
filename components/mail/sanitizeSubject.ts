export const sanitizeSubject = (subject: string) => {
  // Remove any leading "RE: ", "Re: ", or "Following Up:" from the subject, regardless of case
  const cleanSubject = subject
    .replace(/^(RE: |Re: |Following Up: )+/i, "")
    .trim();

  // If the cleaned subject is empty, return a default subject
  if (!cleanSubject) {
    return "No Subject";
  }

  // Add a single "Re: " to the beginning
  return `Re: ${cleanSubject}`;
};
