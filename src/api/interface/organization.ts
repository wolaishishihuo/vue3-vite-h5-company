export interface AreaItem {
  id: number;
  name: string;
  parentId: string | number;
  children: AreaItem[];
}

export interface InspectionPersonItem {
  areaId: string[];
  areaIds: string;
  areaNames: string;
  id: string;
  name: string;
  type: string;
  userId: string;
}
