
import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { SavingTip, TipCategory, TipDifficulty } from '../types';
import { LightBulbIcon, RefrigeratorIcon, TvIcon, ThermostatIcon, WaterDropIcon, WindIcon, Squares2X2Icon, WrenchScrewdriverIcon } from '../components/icons';

const mockTips: SavingTip[] = [
    {
        id: 1,
        title: 'Mude para Lâmpadas LED',
        description: 'Troque lâmpadas incandescentes por LEDs. Elas usam até 75% menos energia e duram 25 vezes mais.',
        category: 'Lighting',
        difficulty: 'Easy',
        savings: 15,
        icon: LightBulbIcon,
        householdPerformance: 7,
        typicalPerformance: 0
    },
    {
        id: 2,
        title: 'Otimize o Uso da Geladeira',
        description: 'Mantenha sua geladeira bem abastecida, mas não superlotada, para manter a temperatura de forma eficiente.',
        category: 'Refrigeration',
        difficulty: 'Easy',
        savings: 10,
        icon: RefrigeratorIcon,
        householdPerformance: -2,
        typicalPerformance: 0
    },
    {
        id: 3,
        title: 'Desconecte Eletrônicos',
        description: 'O consumo fantasma de eletrônicos pode representar 5-10% da sua conta. Desconecte-os quando não estiverem em uso.',
        category: 'Electronics',
        difficulty: 'Medium',
        savings: 8,
        icon: TvIcon,
        householdPerformance: 15,
        typicalPerformance: 0
    },
    {
        id: 4,
        title: 'Instale um Termostato Inteligente',
        description: 'Automatize seu aquecimento e resfriamento para reduzir o desperdício de energia quando você estiver fora ou dormindo.',
        category: 'HVAC',
        difficulty: 'Hard',
        savings: 20,
        icon: ThermostatIcon,
        householdPerformance: -5,
        typicalPerformance: 0
    },
    {
        id: 5,
        title: 'Lave Roupas com Água Fria',
        description: 'Cerca de 90% da energia usada por uma máquina de lavar é para aquecer a água. Use água fria para economizar.',
        category: 'Appliances',
        difficulty: 'Easy',
        savings: 5,
        icon: WaterDropIcon,
        householdPerformance: 0,
        typicalPerformance: 0
    },
    {
        id: 6,
        title: 'Vede Vazamentos de Ar',
        description: 'Vede frestas em janelas e portas para evitar perda de climatização e manter a temperatura interna.',
        category: 'Home Improvement',
        difficulty: 'Medium',
        savings: 12,
        icon: WindIcon,
        householdPerformance: 9,
        typicalPerformance: 0
    },
];

const categoryTranslations: Record<string, string> = {
    'Lighting': 'Iluminação',
    'Refrigeration': 'Refrigeração',
    'Electronics': 'Eletrônicos',
    'HVAC': 'Climatização',
    'Appliances': 'Eletrodomésticos',
    'Home Improvement': 'Melhorias',
    'All': 'Todas'
};

const difficultyTranslations: Record<string, string> = {
    'Easy': 'Fácil',
    'Medium': 'Médio',
    'Hard': 'Difícil',
    'All': 'Todos'
};

const categoryFilters: { label: string, category: TipCategory | 'All', icon: React.FC<{className?: string}> }[] = [
    { label: 'Todas', category: 'All', icon: Squares2X2Icon },
    { label: 'Iluminação', category: 'Lighting', icon: LightBulbIcon },
    { label: 'Refrigeração', category: 'Refrigeration', icon: RefrigeratorIcon },
    { label: 'Eletrônicos', category: 'Electronics', icon: TvIcon },
];

const difficultyFilters: { label: string, difficulty: TipDifficulty | 'All' }[] = [
    { label: 'Todos', difficulty: 'All' },
    { label: 'Fácil', difficulty: 'Easy' },
    { label: 'Médio', difficulty: 'Medium' },
    { label: 'Difícil', difficulty: 'Hard' },
];

const difficultyColors: Record<TipDifficulty, string> = {
    'Easy': 'bg-green-500/20 text-green-300',
    'Medium': 'bg-yellow-500/20 text-yellow-300',
    'Hard': 'bg-red-500/20 text-red-300',
};

const performanceColors = (perf: number) => {
    if (perf > 5) return 'bg-red-500'; // Over typical
    if (perf < -5) return 'bg-green-500'; // Under typical
    return 'bg-yellow-500'; // Matches typical
};

const FilterButton: React.FC<{
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
            isActive
                ? 'bg-primary-100 text-primary-700 shadow'
                : 'bg-surface hover:bg-gray-700 text-text-secondary'
        }`}
    >
        {children}
    </button>
);

const TipCard: React.FC<{ tip: SavingTip }> = ({ tip }) => {
    const performanceText = 
        tip.householdPerformance > 0 ? `${tip.householdPerformance}% acima da média` :
        tip.householdPerformance < 0 ? `${Math.abs(tip.householdPerformance)}% abaixo da média` :
        'Na média';

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <div className="p-3 rounded-full bg-primary-500/10">
                    <tip.icon className="h-6 w-6 text-primary-300" />
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyColors[tip.difficulty]}`}>
                        {difficultyTranslations[tip.difficulty]}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/20 text-primary-300">
                        {tip.savings}% economia
                    </span>
                </div>
            </div>
            <div className="mt-4 flex-grow">
                <h3 className="text-lg font-bold text-text-primary">{tip.title}</h3>
                <p className="text-sm text-text-secondary mt-1">{tip.description}</p>
            </div>
            <div className="mt-6">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Sua Residência</span>
                    <span>{performanceText}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${performanceColors(tip.householdPerformance)}`}
                        style={{ width: `${Math.min(100, 50 + tip.householdPerformance * 2.5)}%` }}
                    />
                </div>
                <p className="text-right text-xs text-text-secondary mt-2">Categoria: {categoryTranslations[tip.category]}</p>
            </div>
        </Card>
    );
};

const SavingTips: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<TipCategory | 'All'>('All');
    const [activeDifficulty, setActiveDifficulty] = useState<TipDifficulty | 'All'>('All');

    const filteredTips = useMemo(() => {
        return mockTips.filter(tip => {
            const categoryMatch = activeCategory === 'All' || tip.category === activeCategory;
            const difficultyMatch = activeDifficulty === 'All' || tip.difficulty === activeDifficulty;
            return categoryMatch && difficultyMatch;
        });
    }, [activeCategory, activeDifficulty]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Dicas de Economia</h1>
            <p className="text-text-secondary mt-1 mb-8">Descubra maneiras personalizadas de reduzir seu consumo e economizar dinheiro.</p>

            <Card className="mb-8">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div>
                        <h3 className="text-md font-semibold text-text-primary mb-2">Categoria</h3>
                        <div className="flex flex-wrap gap-2">
                            {categoryFilters.map(filter => (
                                <FilterButton
                                    key={filter.category}
                                    onClick={() => setActiveCategory(filter.category)}
                                    isActive={activeCategory === filter.category}
                                >
                                    <filter.icon className="h-4 w-4" />
                                    {filter.label}
                                </FilterButton>
                            ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-md font-semibold text-text-primary mb-2">Nível de Dificuldade</h3>
                        <div className="flex flex-wrap gap-2">
                             {difficultyFilters.map(filter => (
                                <FilterButton
                                    key={filter.difficulty}
                                    onClick={() => setActiveDifficulty(filter.difficulty)}
                                    isActive={activeDifficulty === filter.difficulty}
                                >
                                    {filter.label}
                                </FilterButton>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTips.map(tip => (
                    <TipCard key={tip.id} tip={tip} />
                ))}
            </div>
        </div>
    );
};

export default SavingTips;
