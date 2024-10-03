export type AddtrcPayloadType = {
  pickLocation: string,
  putLocation: string,
  comment: string,
  remark: string[],
  issue: string[][],
  device: string[],
}

export type AddtrcResponse = {
  success: boolean,
  message: string
}

export type AddTrcState = {
addTrcLoading: boolean,
}