export type userData = {
    id: string;
    text: string;
}

export type UserApiResponse={
    status:string
    message:string
    success:boolean
    data:userData[]
}
export type Commonstate = {
    getUserLoading: boolean;
    userData: userData[] | null;
    isueeList: userData[] | null;
    isueeListLoading: boolean;
}