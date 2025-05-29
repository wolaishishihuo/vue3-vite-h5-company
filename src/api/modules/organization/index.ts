import request from '@/http';
import type { Organization, Personnel } from '@/api/interface/organization';

// 获取组织架构接口
export const getOrganizations = () => {
  return request.get<Organization[]>('/personBySfzt/dept/topNodes');
};

// 获取人员列表接口
export const getPersonnelList = (params) => {
  return request.get<{ list: Personnel[]; total: number }>('/personBySfzt/dept/user/list', params);
};

// 获取组织架构子节点接口
export const getOrganizationsSubNodes = (params: { dwh: string }) => {
  return request.get<Organization[]>(`/personBySfzt/dept/subNodes`, params);
};
