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
  updateWorkerDataLoading: boolean;
  workingDataLoading: boolean;
  workingData: any[];
  fromLocationLoading: boolean;
  fromLocationList: any[];
  partCodeLoading: boolean;
  partCodeList: any[];

  totalQty: number | any;
  toLocationLoading: boolean;
  toLocationList: any[];
  fieldLoading: boolean;
  workerReports: any[];
  isReportLoading: boolean;
}