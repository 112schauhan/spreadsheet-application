export type AddDeleteOperation = 'addRow' | 'deleteRow' | 'addColumn' | 'deleteColumn';

export interface SortOperation {
  column: string;
  ascending: boolean;
}
