'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Target = {
	id: number;
	name: string;
	quantity: number;
	rewardPercentage: number;
	progress: number;
};

const CircularProgress = ({ value }: { value: number }) => {
	const radius = 35;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset =
		circumference - (Math.min(value, 100) / 100) * circumference;
	const isCompleted = value >= 100;

	return (
		<div className="relative inline-flex items-center justify-center">
			<svg className="transform -rotate-90 w-20 h-20">
				<circle
					className="text-slate-200 dark:text-slate-800"
					strokeWidth="5"
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx="40"
					cy="40"
				/>
				<circle
					className={`${
						isCompleted ? 'text-emerald-500' : 'text-red-700'
					} transition-all duration-300`}
					strokeWidth="5"
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
					stroke="currentColor"
					fill="transparent"
					r={radius}
					cx="40"
					cy="40"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<span className="text-lg font-semibold">
					{Math.min(value, 100).toFixed(0)}%
				</span>
			</div>
		</div>
	);
};

export default function TargetView() {
	const [targets, setTargets] = useState<Target[]>([
		{
			id: 1,
			name: 'Discount Companies',
			quantity: 10,
			rewardPercentage: 10,
			progress: 8,
		},
		{
			id: 2,
			name: 'EMI Merchants',
			quantity: 5,
			rewardPercentage: 10,
			progress: 5,
		},
		{
			id: 3,
			name: 'Shop Visits',
			quantity: 10,
			rewardPercentage: 10,
			progress: 12,
		},
		{
			id: 4,
			name: 'Deposit Collection',
			quantity: 50000,
			rewardPercentage: 10,
			progress: 40000,
		},
		{
			id: 5,
			name: 'Credit Card Sales',
			quantity: 3,
			rewardPercentage: 10,
			progress: 2,
		},
		{
			id: 6,
			name: 'Commission Collection',
			quantity: 500000,
			rewardPercentage: 20,
			progress: 600000,
		},
	]);

	const calculateScore = (target: Target) => {
		const progressPercentage = Math.min(
			(target.progress / target.quantity) * 100,
			100
		);
		return (progressPercentage / 100) * target.rewardPercentage;
	};

	const totalScore = targets.reduce(
		(sum, target) => sum + calculateScore(target),
		0
	);

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pb-2">
			{targets.map((target) => {
				const progressPercentage = (target.progress / target.quantity) * 100;
				return (
					<div key={target.id} className="flex flex-col items-center space-y-3">
						<CircularProgress value={progressPercentage} />
						<div className="text-center space-y-1.5">
							<h3 className="text-sm font-medium">{target.name}</h3>
							<p className="text-sm text-muted-foreground">
								{target.progress.toLocaleString()}/
								{target.quantity.toLocaleString()}
							</p>
						</div>
					</div>
				);
			})}
		</div>
	);
}
