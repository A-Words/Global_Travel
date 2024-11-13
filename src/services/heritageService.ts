import {Heritage} from '../types/heritage';
import heritagesData from '../data/heritages.json';

class HeritageService {
    private static instance: HeritageService;
    private baseUrl: string;
    private fallbackData: Heritage[];

    private constructor() {
        this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        this.fallbackData = heritagesData.heritages;
    }

    public static getInstance(): HeritageService {
        if (!HeritageService.instance) {
            HeritageService.instance = new HeritageService();
        }
        return HeritageService.instance;
    }

    async getAllHeritages(): Promise<Heritage[]> {
        try {
            if (!import.meta.env.VITE_API_BASE_URL) {
                // 如果没有配置API地址，直接使用本地数据
                return this.fallbackData;
            }

            const response = await fetch(`${this.baseUrl}/heritages`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.heritages || data;
        } catch (error) {
            console.error('获取遗产数据失败，使用本地数据:', error);
            return this.fallbackData;
        }
    }

    async getHeritageById(id: string): Promise<Heritage | null> {
        try {
            if (!import.meta.env.VITE_API_BASE_URL) {
                return this.fallbackData.find(h => h.id === id) || null;
            }

            const response = await fetch(`${this.baseUrl}/heritages/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`获取遗产数据失败，使用本地数据 (ID: ${id}):`, error);
            return this.fallbackData.find(h => h.id === id) || null;
        }
    }
}

export const heritageService = HeritageService.getInstance(); 