import axios from 'axios';

const DEFAULT_NOCODB_BASE_URL = 'https://nocodb.maiyaoqiang.fun/api/v2';
const DEFAULT_LIST_LIMIT = 1000;
const DEFAULT_SORT = 'createdAt,Id';

export const NOCODB_TABLES = Object.freeze({
  equipdetail: {
    tableId: 'mxmu6y8ooz33xob',
    viewId: 'vwwdt88v6mh9klm8',
  },
  HeroBasicAttr: {
    tableId: 'm2o1bwbt918ev4l',
    viewId: 'vwni7lg7nsc8vnix',
  },
  Soldier: {
    tableId: 'mn0uvhec4jhzkt4',
    viewId: 'vwjmkzsdgh86zj6c',
  },
  SoldierTechnology: {
    tableId: 'mkbra0i7og6e1oh',
    viewId: 'vw8syp9h7lz1x8e0',
  },
});

/** 获取 NocoDB 的 xc-token（优先 localStorage，其次 env） */
function getNocoDbToken() {
  return import.meta.env.VITE_NOCODB_XC_TOKEN || ''
}

/** 解析不同返回结构中的 records list */
function extractRecordsList(payload) {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data?.list)) return payload.data.list;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

/** 解析不同返回结构中的 pageInfo */
function extractPageInfo(payload) {
  if (!payload) return null;
  if (payload?.pageInfo) return payload.pageInfo;
  if (payload?.data?.pageInfo) return payload.data.pageInfo;
  return null;
}

/** 根据传入 tableKey 找到 tableId/viewId（支持别名） */
function resolveTableConfig(tableKey, tableConfigs) {
  if (!tableKey) {
    throw new Error('NocoDB tableKey 不能为空');
  }

  const normalizedKey = String(tableKey);
  const direct = tableConfigs?.[normalizedKey];
  if (direct) return direct;

  const lower = normalizedKey.toLowerCase();
  const lowerMatchKey = Object.keys(tableConfigs || {}).find((k) => String(k).toLowerCase() === lower);
  if (lowerMatchKey) return tableConfigs[lowerMatchKey];

  throw new Error(`未找到 NocoDB 表配置：${normalizedKey}`);
}

/** 获取某个表最终要用的默认排序 */
function resolveDefaultSort(tableKey, tableConfigs, fallbackSort) {
  const cfg = resolveTableConfig(tableKey, tableConfigs);
  return cfg?.defaultSort || fallbackSort;
}

export class NocoDbClient {
  /** 创建 NocoDB 客户端（封装 tableId/viewId 与分页拉全量数据） */
  constructor({
    baseURL = DEFAULT_NOCODB_BASE_URL,
    tokenProvider = getNocoDbToken,
    tableConfigs = NOCODB_TABLES,
    defaultSort = DEFAULT_SORT,
    defaultLimit = DEFAULT_LIST_LIMIT,
  } = {}) {
    this.baseURL = baseURL;
    this.tokenProvider = tokenProvider;
    this.tableConfigs = tableConfigs;
    this.defaultSort = defaultSort;
    this.defaultLimit = defaultLimit;
    this.http = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
    });
  }

  /** 拉取单页 records（通常不直接使用，给 get/all 使用） */
  async getPage(tableKey, { offset = 0, limit = this.defaultLimit, where = '', viewId, sort } = {}) {
    const { tableId, viewId: defaultViewId } = resolveTableConfig(tableKey, this.tableConfigs);
    const token = this.tokenProvider?.() || '';
    if (!token) {
      throw new Error('未配置 NocoDB xc-token（localStorage.nocodb_xc_token 或 VITE_NOCODB_XC_TOKEN）');
    }

    const resolvedSort = sort || resolveDefaultSort(tableKey, this.tableConfigs, this.defaultSort);
    const params = {
      offset: String(offset),
      limit: String(limit),
      where: where ?? '',
      viewId: viewId || defaultViewId,
      sort: resolvedSort,
    };

    const res = await this.http.request({
      method: 'GET',
      url: `/tables/${tableId}/records`,
      params,
      headers: {
        'xc-token': token,
      },
    });

    const payload = res?.data;
    return {
      list: extractRecordsList(payload),
      pageInfo: extractPageInfo(payload),
      raw: payload,
    };
  }

  /** 拉取全量 records（自动分页，默认按时间倒序） */
  async get(tableKey, options = {}) {
    const limit = options?.limit ?? this.defaultLimit;
    const maxRecords = options?.maxRecords ?? Infinity;

    let offset = options?.offset ?? 0;
    const all = [];

    while (all.length < maxRecords) {
      const page = await this.getPage(tableKey, { ...options, offset, limit });
      const batch = Array.isArray(page?.list) ? page.list : [];
      all.push(...batch);

      if (batch.length < limit) break;
      offset += limit;
    }

    return all.slice(0, maxRecords);
  }
}

/** 默认 NocoDB 客户端实例 */
export const nocodb = new NocoDbClient();
