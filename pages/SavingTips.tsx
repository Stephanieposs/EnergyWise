import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { SavingTip, TipCategory, TipDifficulty } from '../types';
import { LightBulbIcon, RefrigeratorIcon, TvIcon, ThermostatIcon, WaterDropIcon, WindIcon, Squares2X2Icon, WrenchScrewdriverIcon } from '../components/icons';

const mockTips: SavingTip[] = [
    {
        id: 1,
        title: 'Switch to LED Bulbs',
        description: 'Replace incandescent bulbs with LEDs. They use up to 75% less energy and last 25 times longer.',
        category: 'Lighting',
        difficulty: 'Easy',
        savings: 15,
        icon: LightBulbIcon,
        householdPerformance: 7,
        typicalPerformance: 0
    },
    {
        id: 2,
        title: 'Optimize Refrigerator Use',
        description: 'Keep your fridge well-stocked but not overfilled to maintain its temperature efficiently.',
        category: 'Refrigeration',
        difficulty: 'Easy',
        savings: 10,
        icon: RefrigeratorIcon,
        householdPerformance: -2,
        typicalPerformance: 0
    },
    {
        id: 3,
        title: 'Unplug Electronics',
        description: 'Phantom load from electronics can account for 5-10% of your energy bill. Unplug them when not in use.',
        category: 'Electronics',
        difficulty: 'Medium',
        savings: 8,
        icon: TvIcon,
        householdPerformance: 15,
        typicalPerformance: 0
    },
    {
        id: 4,
        title: 'Install a Smart Thermostat',
        description: 'Automate your heating and cooling schedule to reduce energy waste when you\'re away or asleep.',
        category: 'HVAC',
        difficulty: 'Hard',
        savings: 20,
        icon: ThermostatIcon,
        householdPerformance: -5,
        typicalPerformance: 0
    },
    {
        id: 5,
        title: 'Wash Clothes in Cold Water',
        description: 'About 90% of the energy used by a washing machine is for heating water. Use cold water to save.',
        category: 'Appliances',
        difficulty: 'Easy',
        savings: 5,
        icon: WaterDropIcon,
        householdPerformance: 0,
        typicalPerformance: 0
    },
    {
        id: 6,
        title: 'Seal Air Leaks',
        description: 'Use caulk or weatherstripping to seal leaks around windows and doors to prevent heat loss.',
        category: 'Home Improvement',
        difficulty: 'Medium',
        savings: 12,
        icon: WindIcon,
        householdPerformance: 9,
        typicalPerformance: 0
    },
];

const categoryFilters: { label: string, category: TipCategory | 'All', icon: React.FC<{className?: string}> }[] = [
    { label: 'All Categories', category: 'All', icon: Squares2X2Icon },
    { label: 'Lighting', category: 'Lighting', icon: LightBulbIcon },
    { label: 'Refrigeration', category: 'Refrigeration', icon: RefrigeratorIcon },
    { label: 'Electronics', category: 'Electronics', icon: TvIcon },
];

const difficultyFilters: { label: string, difficulty: TipDifficulty | 'All' }[] = [
    { label: 'All Levels', difficulty: 'All' },
    { label: 'Easy', difficulty: 'Easy' },
    { label: 'Medium', difficulty: 'Medium' },
    { label: 'Hard', difficulty: 'Hard' },
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
        tip.householdPerformance > 0 ? `${tip.householdPerformance}% over typical` :
        tip.householdPerformance < 0 ? `${Math.abs(tip.householdPerformance)}% under typical` :
        'Matches typical';

    return (
        <Card className="flex flex-col">
            <div className="flex justify-between items-start">
                <div className="p-3 rounded-full bg-primary-500/10">
                    <tip.icon className="h-6 w-6 text-primary-300" />
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${difficultyColors[tip.difficulty]}`}>
                        {tip.difficulty}
                    </span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-500/20 text-primary-300">
                        {tip.savings}% savings
                    </span>
                </div>
            </div>
            <div className="mt-4 flex-grow">
                <h3 className="text-lg font-bold text-text-primary">{tip.title}</h3>
                <p className="text-sm text-text-secondary mt-1">{tip.description}</p>
            </div>
            <div className="mt-6">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Your Household</span>
                    <span>{performanceText}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${performanceColors(tip.householdPerformance)}`}
                        style={{ width: `${Math.min(100, 50 + tip.householdPerformance * 2.5)}%` }}
                    />
                </div>
                <p className="text-right text-xs text-text-secondary mt-2">Category: {tip.category}</p>
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
            <h1 className="text-3xl font-bold text-text-primary">Energy Saving Tips</h1>
            <p className="text-text-secondary mt-1 mb-8">Discover personalized ways to reduce your consumption and save money.</p>

            <Card className="mb-8">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div>
                        <h3 className="text-md font-semibold text-text-primary mb-2">Category</h3>
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
                        <h3 className="text-md font-semibold text-text-primary mb-2">Difficulty Level</h3>
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