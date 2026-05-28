export interface AssignedTo {
  _id      : string;
  userId   : string;
  name     : string;
  role     : string;
  department: string;
}

export interface Record {
  _id        : string;
  title      : string;
  description: string;
  status     : 'Active' | 'Pending' | 'Archived';
  priority   : 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo : AssignedTo;
  category   : string;
  dueDate    : string;
  tags       : string[];
  progress   : number;
  createdAt  : string;
  updatedAt  : string;
}

export interface CreateRecordRequest {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  category: string;
  dueDate: string;
  progress: number;
}


export interface RecordsResponse {
  success: boolean;
  count  : number;
  data   : Record[];
}