export interface CellFormatting {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontColor?: string;
  backgroundColor?: string;
  fontSize?: number;
  fontFamily?: string;
  // Additional properties used in the UI
  textColor?: string;
  bgColor?: string;
  textAlign?: 'left' | 'center' | 'right';
}
