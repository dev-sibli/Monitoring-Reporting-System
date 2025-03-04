'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Plus, X, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CollectionData, YearMonth } from '@/types/types';
import { mockMerchants } from '@/utils/mockData';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { Textarea } from '@/components/ui/textarea';
import { searchBanks, searchBranches } from '@/utils/searchUtils';

type Props = {
	onSubmit: (data: CollectionData) => void;
};

export default function CollectionForm({ onSubmit }: Props) {
	const { user } = useAuth();
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const currentYear = new Date().getFullYear();
	const [yearMonths, setYearMonths] = useState<YearMonth[]>([
		{ year: currentYear.toString(), month: '', billAmount: '' },
	]);
	const [filteredMerchants, setFilteredMerchants] = useState<string[]>([]);
	const [filteredBanks, setFilteredBanks] = useState<string[]>([]);
	const [filteredBranches, setFilteredBranches] = useState<string[]>([]);
	const [collectedAmount, setCollectedAmount] = useState(0);
	const [file, setFile] = useState<File | null>(null);

	const {
		register,
		handleSubmit,
		control,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<CollectionData>({
		defaultValues: {
			collectionDate: new Date(),
			checkSubmissionDate: new Date(),
			collectionOfficer: user?.name || '',
			region: user?.region || '',
			bankName: '',
			clearingBranch: '',
			memo: '',
		},
	});

	const years = Array.from({ length: currentYear - 2013 + 1 }, (_, i) =>
		(currentYear - i).toString()
	);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	useEffect(() => {
		const totalAmount = yearMonths.reduce(
			(sum, ym) => sum + (parseFloat(ym.billAmount) || 0),
			0
		);
		setCollectedAmount(totalAmount);
	}, [yearMonths]);

	const handleFormSubmit = async (data: CollectionData) => {
		try {
			const fileUrl = file ? URL.createObjectURL(file) : '';
			const submissionData = {
				...data,
				yearMonth: yearMonths.filter(
					(ym) => ym.year && ym.month && ym.billAmount
				),
				collectedAmount,
				collectionOfficer: user?.name || '',
				region: user?.region || '',
				fileAttachment: fileUrl,
			};

			await onSubmit(submissionData);
			setShowSuccessModal(true);
			setTimeout(() => {
				reset();
				setYearMonths([
					{ year: currentYear.toString(), month: '', billAmount: '' },
				]);
				setFilteredMerchants([]);
				setFilteredBanks([]);
				setFilteredBranches([]);
				setCollectedAmount(0);
				setFile(null);
				setShowSuccessModal(false);
			}, 2000);
		} catch (error) {
			setErrorMessage('Something went wrong. Please try again.');
			setShowErrorModal(true);
			setTimeout(() => setShowErrorModal(false), 2000);
		}
	};

	const handleSearch = (
		searchTerm: string,
		type: 'merchant' | 'bank' | 'branch'
	) => {
		if (searchTerm.length < 2) {
			type === 'merchant' && setFilteredMerchants([]);
			type === 'bank' && setFilteredBanks([]);
			type === 'branch' && setFilteredBranches([]);
			return;
		}

		switch (type) {
			case 'merchant':
				setFilteredMerchants(
					mockMerchants.filter((m) =>
						m.toLowerCase().includes(searchTerm.toLowerCase())
					)
				);
				break;
			case 'bank':
				searchBanks(searchTerm).then(setFilteredBanks);
				break;
			case 'branch':
				searchBranches(searchTerm).then(setFilteredBranches);
				break;
		}
	};

	const updateYearMonth = (
		index: number,
		field: keyof YearMonth,
		value: string
	) => {
		setYearMonths((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			return updated;
		});
	};

	return (
		<form
			onSubmit={handleSubmit(handleFormSubmit)}
			className="space-y-4 bg-white p-4 rounded-lg shadow max-w-4xl mx-auto"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="merchantSearch">Search Merchant</Label>
					<Input
						id="merchantSearch"
						placeholder="Type to search merchants..."
						onChange={(e) => handleSearch(e.target.value, 'merchant')}
					/>
					{filteredMerchants.length > 0 && (
						<ul className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
							{filteredMerchants.map((merchant, index) => (
								<li
									key={index}
									className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
									onClick={() => {
										setValue('merchantName', merchant);
										setFilteredMerchants([]);
									}}
								>
									{merchant}
								</li>
							))}
						</ul>
					)}
				</div>
				<div>
					<Label htmlFor="merchantName">Merchant Name</Label>
					<Input
						id="merchantName"
						{...register('merchantName', {
							required: 'Merchant name is required',
						})}
						className={errors.merchantName ? 'border-red-500' : ''}
					/>
					{errors.merchantName && (
						<span className="text-sm text-red-500">
							{errors.merchantName.message}
						</span>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="invoiceNumber">Invoice Number</Label>
				<Input
					id="invoiceNumber"
					{...register('invoiceNumber', {
						required: 'Invoice number is required',
					})}
					className={errors.invoiceNumber ? 'border-red-500' : ''}
				/>
				{errors.invoiceNumber && (
					<span className="text-sm text-red-500">
						{errors.invoiceNumber.message}
					</span>
				)}
			</div>

			<div className="space-y-2">
				<Label>Year and Month</Label>
				{yearMonths.map((ym, index) => (
					<div key={index} className="flex items-center space-x-2">
						<Select
							value={ym.year}
							onValueChange={(value) => updateYearMonth(index, 'year', value)}
						>
							<SelectTrigger className="w-[100px]">
								<SelectValue placeholder="Year" />
							</SelectTrigger>
							<SelectContent>
								{years.map((year) => (
									<SelectItem key={year} value={year}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Select
							value={ym.month}
							onValueChange={(value) => updateYearMonth(index, 'month', value)}
							disabled={!ym.year}
						>
							<SelectTrigger className="w-[120px]">
								<SelectValue placeholder="Month" />
							</SelectTrigger>
							<SelectContent>
								{months.map((month) => (
									<SelectItem key={month} value={month}>
										{month}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Input
							type="number"
							placeholder="Bill Amount (৳)"
							value={ym.billAmount}
							onChange={(e) =>
								updateYearMonth(index, 'billAmount', e.target.value)
							}
							className="w-[120px]"
							disabled={!ym.year || !ym.month}
						/>
						{index > 0 && (
							<Button
								type="button"
								onClick={() =>
									setYearMonths((prev) => prev.filter((_, i) => i !== index))
								}
								size="icon"
								variant="ghost"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
					</div>
				))}
				<Button
					type="button"
					onClick={() =>
						setYearMonths((prev) => [
							...prev,
							{ year: '', month: '', billAmount: '' },
						])
					}
					size="sm"
					className="mt-2"
				>
					<Plus className="h-4 w-4 mr-2" /> Add More
				</Button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="bankName">Bank Name</Label>
					<Input
						id="bankName"
						{...register('bankName', { required: 'Bank name is required' })}
						onChange={(e) => {
							register('bankName').onChange(e);
							handleSearch(e.target.value, 'bank');
						}}
						className={errors.bankName ? 'border-red-500' : ''}
					/>
					{errors.bankName && (
						<span className="text-sm text-red-500">
							{errors.bankName.message}
						</span>
					)}
					{filteredBanks.length > 0 && (
						<ul className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
							{filteredBanks.map((bank, index) => (
								<li
									key={index}
									className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
									onClick={() => {
										setValue('bankName', bank);
										setFilteredBanks([]);
									}}
								>
									{bank}
								</li>
							))}
						</ul>
					)}
				</div>
				<div>
					<Label htmlFor="checkNumber">Check Number</Label>
					<Input id="checkNumber" {...register('checkNumber')} />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="clearingBranch">Clearing Branch</Label>
					<Input
						id="clearingBranch"
						{...register('clearingBranch', {
							required: 'Clearing branch is required',
						})}
						onChange={(e) => {
							register('clearingBranch').onChange(e);
							handleSearch(e.target.value, 'branch');
						}}
						className={errors.clearingBranch ? 'border-red-500' : ''}
					/>
					{errors.clearingBranch && (
						<span className="text-sm text-red-500">
							{errors.clearingBranch.message}
						</span>
					)}
					{filteredBranches.length > 0 && (
						<ul className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
							{filteredBranches.map((branch, index) => (
								<li
									key={index}
									className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
									onClick={() => {
										setValue('clearingBranch', branch);
										setFilteredBranches([]);
									}}
								>
									{branch}
								</li>
							))}
						</ul>
					)}
				</div>
				<div>
					<Label htmlFor="collectedAmount">Collected Amount (৳)</Label>
					<Input
						id="collectedAmount"
						type="number"
						value={collectedAmount}
						readOnly
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="collectionDate">Collection Date</Label>
					<Controller
						name="collectionDate"
						control={control}
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full justify-start text-left font-normal',
											!field.value && 'text-muted-foreground'
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.value ? (
											format(field.value, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						)}
					/>
				</div>
				<div>
					<Label htmlFor="checkSubmissionDate">Check Submission Date</Label>
					<Controller
						name="checkSubmissionDate"
						control={control}
						render={({ field }) => (
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										className={cn(
											'w-full justify-start text-left font-normal',
											!field.value && 'text-muted-foreground'
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.value ? (
											format(field.value, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										selected={field.value}
										onSelect={field.onChange}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="collectionOfficer">Collection Officer</Label>
					<Input
						id="collectionOfficer"
						value={watch('collectionOfficer')}
						readOnly
						disabled
					/>
				</div>
				<div>
					<Label htmlFor="region">Region</Label>
					<Input id="region" value={watch('region')} readOnly disabled />
				</div>
			</div>

			<div>
				<Label htmlFor="memo">Memo</Label>
				<Textarea
					id="memo"
					{...register('memo')}
					placeholder="Enter any additional notes or details here"
				/>
			</div>

			<div>
				<Label htmlFor="fileAttachment">File Attachment</Label>
				<Input
					id="fileAttachment"
					type="file"
					onChange={(e) => e.target.files && setFile(e.target.files[0])}
					accept=".jpg,.jpeg,.png,.pdf"
				/>
			</div>

			<Button type="submit" className="w-full">
				Submit Collection
			</Button>

			{/* Success Modal */}
			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
				<DialogContent className="sm:max-w-md text-center">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-center gap-2 text-green-600">
							<CheckCircle2 className="h-8 w-8" />
							Success
						</DialogTitle>
						<DialogDescription className="text-center py-4 text-lg">
							Your collection has been submitted successfully!
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{/* Error Modal */}
			<Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
				<DialogContent className="sm:max-w-md text-center">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-center gap-2 text-red-600">
							<XCircle className="h-8 w-4" />
							Error
						</DialogTitle>
						<DialogDescription className="text-center py-4 text-lg">
							{errorMessage || 'Please fill in all required fields.'}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</form>
	);
}
