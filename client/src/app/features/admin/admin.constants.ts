export interface UserFilterOption {
    name: string;
    code: string | null;
  }
  
  export const ROLE_OPTIONS = [
    { name: 'General User', code: 'General User' },
    { name: 'Admin', code: 'Admin' },
  ];
  
  export const STATUS_OPTIONS = [
    { name: 'Active', code: 'Active' },
    { name: 'Pending', code: 'Pending' },
    { name: 'InProgress', code: 'InProgress' },
    { name: 'Completed', code: 'Completed' },
    { name: 'Archived', code: 'Archived' },
  ];
  
  export const PRIORITY_OPTIONS = [
    { name: 'Low', code: 'Low' },
    { name: 'Medium', code: 'Medium' },
    { name: 'High', code: 'High' },
    { name: 'Critical', code: 'Critical' },
  ];
  
  export const CATEGORY_OPTIONS = [
    { name: 'Frontend', code: 'Frontend' },
    { name: 'Backend', code: 'Backend' },
    { name: 'Design', code: 'Design' },
    { name: 'DevOps', code: 'DevOps' },
    { name: 'QA', code: 'QA' },
  ];