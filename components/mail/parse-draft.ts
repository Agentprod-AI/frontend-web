export const parseActionDraft = (actionDraft: any) => {
  if (!actionDraft)
    return { subject: "No subject", body: "No details provided" };

  try {
    // Attempt to parse the string as JSON
    const draft = JSON.parse(actionDraft);
    const subject = draft.subject || "No subject";
    const body = draft.body || "No details provided";
    return { subject, body };
  } catch (error) {
    // If JSON parsing fails, fallback to string parsing
    const subjectMarker = '"subject": ';
    const bodyMarker = '"body": ';

    const subjectStartIndex = actionDraft.indexOf(subjectMarker);
    const bodyStartIndex = actionDraft.indexOf(bodyMarker);

    let subject = "No subject";
    let body = "No details provided";

    if (subjectStartIndex !== -1 && bodyStartIndex !== -1) {
      const subjectEndIndex = actionDraft.indexOf(",", subjectStartIndex);
      subject = actionDraft
        .substring(subjectStartIndex + subjectMarker.length, subjectEndIndex)
        .replace(/"/g, "")
        .trim();

      body = actionDraft
        .substring(bodyStartIndex + bodyMarker.length)
        .replace(/"}`/g, "")
        .trim();
    }

    return { subject, body };
  }
};
