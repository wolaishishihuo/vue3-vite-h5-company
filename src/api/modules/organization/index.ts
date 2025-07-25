import type { Organization, Personnel } from '@/api/interface/organization';
import request from '@/http';

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

// 测试
// 获取区域树
export const getAreaTree = () => {
  return request.get('/school/area/tree');
};
