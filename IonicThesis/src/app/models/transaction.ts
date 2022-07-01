import { Timestamp } from "firebase/firestore";

export interface Transaction {
    id?: string;
    description?: string;
    value?: number;
    createdAt?: Date;
    currency?: string;
    category?: string;
    icon?: string;
}
