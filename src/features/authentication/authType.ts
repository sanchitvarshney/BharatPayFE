export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export type PasswordChangePayload = {
    userId: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  
  export   type LoginResponse = {
    data: {
      token: string;
      department: string;
      crn_mobile: string;
      crn_email: string;
      crn_id: string;
      company_id: string;
      username: string;
      fav_pages: {
        page_id: string;
        page_name: string;
        url: string;
      }[];
      settings: {
        name: string;
        code: string;
        value: string;
      }[];
      crn_type: string;
      successPath: string;
      validity: number;
      other: {
        m_v: string;
        e_v: string;
        c_p: string;
      };
    };
    message: string;
    status: string;
    success: boolean;
    code: number;
  };
  
  export interface AuthState {
    user: LoginResponse | null;
    loading: boolean;
    token: string | null;
    changepasswordloading: boolean;
    emailOtpLoading: boolean
    updateEmailLoading: boolean
    verifyMailLoading: boolean
  }