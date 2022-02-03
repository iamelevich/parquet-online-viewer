import type { makeStyles } from '@material-ui/core';
import type React from 'react';

export type Order = 'asc' | 'desc';

export interface HeadCell {
  id: string;
  label: string;
  numeric: boolean;
}

export interface Data {
  id: number;
  [key: string]: any;
}

export interface EnhancedTableProps {
  classes: ReturnType<ReturnType<typeof makeStyles>>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof Data;
  rowCount: number;
  headCells: HeadCell[];
}

export interface EnhancedTableToolbarProps {
  selected: string[];
  showNulls: boolean;
  onShowNullsChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}
