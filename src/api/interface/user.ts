export interface UserInfo {
  xgh: string;
  xm: string;
  avatar: string;
  roles: any[];
  permissions: string[];
  identityType: IdentityType[];
}

export interface IdentityType {
  name: string;
  value: any;
}
