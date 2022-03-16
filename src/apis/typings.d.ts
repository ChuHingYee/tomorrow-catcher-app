interface LogItemCode {
  code: string;
  highlight: boolean;
  number: number;
}

declare namespace API {
  interface PageQuery {
    page: number;
    size: number;
  }

  interface PageResponse<T> {
    total: number;
    data: T[];
  }

  interface LoginParams {
    account: string;
    password: string;
  }
  interface LoginResponse {
    id: string;
    name: string;
    avatar: string;
    token: string;
    refreshToken: string;
  }
  interface RefreshTokenParams {
    _id: string;
    token: string;
  }
  interface RefreshTokenResponse {
    refreshToken: string;
    token: string;
  }
  interface UpdatePasswordParams {
    oldPassword: string;
    newPassword: string;
  }
  interface AppItem {
    createdAt: number;
    appKey: string;
    name: string;
    status: AppStatus;
    updatedAt: number;
    _id: string;
  }
  interface UpdateAppItemParams {
    _id: string;
    name?: string;
    status: AppStatus;
  }

  type AppStatus = 0 | 1;

  interface UserItem {
    account: string;
    lastLoginTime: number;
    name: string;
    roles: string[];
    status: UserStatus;
    _id: string;
    createdAt: number;
    updatedAt: number;
  }

  interface UpdateUserStatusParams {
    ids: string[];
    status: UserStatus;
  }

  type UserStatus = 0 | 1;

  interface LogItem {
    _id: string;
    time: number;
    createdAt: number;
    appInfo: AppItem;
    systemInfo: {
      baseVersion: string;
      language: string;
      platform: string;
      sdkVersion: string;
      userAgent: string;
    };
    customInfo: string;
  }

  interface LogItemDetailParams {
    _id: string;
  }

  interface LogItemDetailResponse extends LogItem {
    result: {
      column: number;
      line: number;
      name: null | string;
      source: string;
    };
    codes: LogItemCode[];
    name: string;
    message: string;
  }

  interface ChartReportInfo {
    id: string;
    name: string;
    list: {label: string; count: number}[];
  }

  type ChartReportInfoResponse = ChartReportInfo[];

  interface TypesReport {
    count: number;
    name: string;
    id: string;
  }

  type TypesReportResponse = TypesReport[];
}
