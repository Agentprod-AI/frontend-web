export const parseActionDraft = (actionDraft: string) => {
  if (!actionDraft)
    return { subject: "No subject", body: "No details provided" };

  actionDraft = actionDraft
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    const parsedData = JSON.parse(actionDraft);
    const { subject, body } = parsedData;
    return { subject, body };
  } catch (e) {
    const subjectMarker = "Subject: ";
    const splitIndex = actionDraft.indexOf("\n\n");

    let subject = "No subject";
    let body = "No details provided";

    if (splitIndex !== -1) {
      subject = actionDraft.substring(subjectMarker.length, splitIndex);
      body = actionDraft.substring(splitIndex + 2);
    } else {
      body = actionDraft.substring(subjectMarker.length);
    }

    return { subject, body };
  }
};
