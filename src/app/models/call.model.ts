import { User } from "./user";
interface Call {
  callerInfo: User;
  id: string;
  receiverInfo: User;
  accepted?: boolean;
  timestamp?: any;
}
export interface OutgoingCall extends Call {}
export interface IncomingCall extends Call {}
