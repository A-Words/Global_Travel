import create from 'zustand';
import {Heritage} from '../types/heritage';
import {heritageService} from '../services/heritageService';

interface HeritageState {
    heritages: Heritage[];
    loading: boolean;
    error: string | null;
    filters: {
        categories: string[];
        searchText: string;
    };
    filteredHeritages: Heritage[];
    selectedHeritage: Heritage | null;
    fetchHeritages: () => Promise<void>;
    setFilters: (filters: Partial<HeritageState['filters']>) => void;
    selectHeritage: (id: string) => Promise<void>;
}

export const useHeritageStore = create<HeritageState>((set, get) => ({
    heritages: [],
    loading: false,
    error: null,
    filters: {
        categories: [],
        searchText: '',
    },
    filteredHeritages: [],
    selectedHeritage: null,
    fetchHeritages: async () => {
        set({loading: true});
        try {
            const data = await heritageService.getAllHeritages();
            set({
                heritages: data,
                filteredHeritages: data,
                loading: false,
                error: null
            });
        } catch (error) {
            set({error: '加载数据失败', loading: false});
        }
    },
    setFilters: (newFilters) => {
        const state = get();
        const updatedFilters = {...state.filters, ...newFilters};
        set({filters: updatedFilters});

        // 应用过滤逻辑
        let filtered = state.heritages;

        // 按分类过滤
        if (updatedFilters.categories.length > 0) {
            filtered = filtered.filter(heritage =>
                heritage.category.some(cat => updatedFilters.categories.includes(cat))
            );
        }

        // 按搜索文本过滤
        if (updatedFilters.searchText) {
            const searchLower = updatedFilters.searchText.toLowerCase();
            filtered = filtered.filter(heritage =>
                heritage.name.toLowerCase().includes(searchLower) ||
                heritage.location.toLowerCase().includes(searchLower) ||
                heritage.description.toLowerCase().includes(searchLower)
            );
        }

        set({filteredHeritages: filtered});
    },
    selectHeritage: async (id: string) => {
        set({loading: true});
        try {
            const heritage = await heritageService.getHeritageById(id);
            set({
                selectedHeritage: heritage,
                loading: false,
                error: null
            });
        } catch (error) {
            set({
                error: '加载遗产详情失败',
                loading: false
            });
        }
    }
})); 