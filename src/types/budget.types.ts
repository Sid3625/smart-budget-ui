export interface Category {
    id: string;
    name: string;
    limitAmount: number;
    budgetId: string;
}

export interface CreateCategoryDto {
    name: string;
    limitAmount: number;
    budgetId: string;
}

export interface Budget {
    id: string;
    name: string;
    month: number;
    year: number;
    totalAllocation: number;
    userId: string;
    categories: Category[];
    createdAt: string;
}

export interface CreateBudgetDto {
    name: string;
    month: number;
    year: number;
    totalAllocation: number;
}
