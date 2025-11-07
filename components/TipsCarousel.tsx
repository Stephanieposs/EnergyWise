
import React, { useState, useEffect, useCallback } from 'react';
import { MonthlyData, Tip } from '../types';
import { fetchPersonalizedTips } from '../services/geminiService';
import Card from './Card';
import { LightBulbIcon } from './icons';

interface TipsCarouselProps {
    consumptionData: MonthlyData[];
}

const TipsCarousel: React.FC<TipsCarouselProps> = ({ consumptionData }) => {
    const [tips, setTips] = useState<Tip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const getTips = useCallback(async () => {
        if (!consumptionData || consumptionData.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            const tipsJsonString = await fetchPersonalizedTips(consumptionData);
            const parsedTips = JSON.parse(tipsJsonString);
            if (Array.isArray(parsedTips)) {
                setTips(parsedTips);
            } else {
                throw new Error("Invalid tips format received.");
            }
        } catch (e) {
            console.error("Failed to parse tips:", e);
            setError("Could not load personalized tips.");
            setTips([]);
        } finally {
            setLoading(false);
        }
    }, [consumptionData]);

    useEffect(() => {
        getTips();
    }, [getTips]);

    useEffect(() => {
        if (tips.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % tips.length);
            }, 7000); // Change tip every 7 seconds
            return () => clearInterval(interval);
        }
    }, [tips.length]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    <p className="ml-3 text-text-secondary">Generating personalized tips...</p>
                </div>
            );
        }

        if (error) {
            return <p className="text-red-400">{error}</p>;
        }
        
        if (tips.length === 0) {
            return <p className="text-text-secondary">No tips available at the moment.</p>;
        }

        const currentTip = tips[currentIndex];

        return (
            <div className="flex flex-col h-full">
                 <div className="flex-grow">
                    <h4 className="font-bold text-accent mb-2">{currentTip.title}</h4>
                    <p className="text-text-secondary text-sm">{currentTip.description}</p>
                 </div>
                 {tips.length > 1 && (
                    <div className="flex justify-center space-x-2 pt-4">
                        {tips.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    currentIndex === index ? 'bg-accent' : 'bg-gray-600 hover:bg-gray-500'
                                }`}
                            />
                        ))}
                    </div>
                 )}
            </div>
        );
    };

    return (
        <Card className="flex flex-col h-full">
            <div className="flex items-center mb-4">
                <LightBulbIcon className="h-6 w-6 text-accent mr-3" />
                <h3 className="text-xl font-semibold text-text-primary">Personalized Tips</h3>
            </div>
            <div className="flex-grow min-h-[100px]">
                {renderContent()}
            </div>
        </Card>
    );
};

export default TipsCarousel;
