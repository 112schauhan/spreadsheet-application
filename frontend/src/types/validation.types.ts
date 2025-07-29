export interface ValidationErrors {
  [cellRef: string]: string; 
}

export interface ValidationState {
  errors: ValidationErrors;
}
