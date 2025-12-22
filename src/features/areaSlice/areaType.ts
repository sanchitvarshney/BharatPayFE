export interface PlaceType {
    id: string;
    text: string;
}
export interface InitialAreaType {
  empLoading: boolean;
  empList: PlaceType[];
  departmentLoading: boolean;
  departmentList: PlaceType[];
   placeLoading: boolean;
  placeList: PlaceType[];
  submitLoading: boolean;
  workingDataLoading: boolean;
  workingData: any[];
}