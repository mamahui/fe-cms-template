export const DEFAULT_PAGE_CONFIG = {
  page: 1,
  page_size: 10,
};
export const Size = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

export const GlobalStatus = {
  ENABLE: 1,
  DISABLE: 2,
  DELETE: 3,
};
export const GlobalStatusText = {
  [GlobalStatus.ENABLE]: '启用',
  [GlobalStatus.DISABLE]: '禁用',
  [GlobalStatus.DELETE]: '删除',
};
