import { set } from "date-fns";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export interface EmailMessage {
  id: string;
  conversation_id: string;
  received_datetime: Date | null;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  is_reply: boolean;
  send_datetime: Date | null;
  open_datetime: Date | null;
  click_datetime: Date | null;
  response_datetime: Date | null;
  status: string;
  sentiment: string | null;
  category: string | null;
  action_draft: string | null;
  message_id: string;
}

export interface Mailbox {
  conversationId: string;
  setConversationId: (id: string) => void;
  thread: EmailMessage[];
  setThread: (thread: EmailMessage[]) => void;
  recipientEmail: string;
  setRecipientEmail: (email: string) => void;
}

const defaultState: Mailbox = {
  conversationId: "",
  setConversationId: () => {},
  thread: [],
  setThread: () => {},
  recipientEmail: "",
  setRecipientEmail: () => {},
};

// Creating the context
const MailboxContext = createContext<Mailbox>(defaultState);

interface MailboxProviderProps {
  children: ReactNode;
}

// Context provider component
export const MailboxProvider: React.FC<MailboxProviderProps> = ({
  children,
}) => {
  const [conversationId, setConversationId] = useState<string>(
    defaultState.conversationId
  );
  const [thread, setThread] = useState<EmailMessage[]>(defaultState.thread);
  const [recipientEmail, setRecipientEmail] = useState<string>(
    defaultState.recipientEmail
  );

  const contextValue = useMemo(
    () => ({
      conversationId,
      setConversationId,
      thread,
      setThread,
      recipientEmail,
      setRecipientEmail,
    }),
    [conversationId, thread]
  );

  return (
    <MailboxContext.Provider value={contextValue}>
      {children}
    </MailboxContext.Provider>
  );
};

// Custom hook to use the leads context
export const useMailbox = () => useContext(MailboxContext);