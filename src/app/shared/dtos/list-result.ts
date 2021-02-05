import { IListItem } from './list-item';

export interface IListResult {
  count: number;
  next: string;
  previous: string;
  results: IListItem[];
}
