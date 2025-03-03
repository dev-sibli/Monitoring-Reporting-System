'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

type MerchantType = 'discount' | 'emi' | 'BOGO';
type CardType = 'credit' | 'prepaid' | 'hajj' | 'medical';

type Merchant = {
	type: MerchantType;
	name: string;
	area: string;
	phoneNumber?: string;
};

type UserVisit = {
	merchantName: string;
	area: string;
	phoneNumber: string;
};

type Card = {
	type: CardType;
	cardholderName: string;
	phoneNumber?: string;
};

type FormData = {
	merchants: Merchant[];
	userVisits: UserVisit[];
	checkCollection: string;
	visitDate: Date;
	cards: Card[];
};

export default function MerchantRegistrationForm() {
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			merchants: [{ type: 'discount', name: '', area: '' }],
			userVisits: [{ merchantName: '', area: '', phoneNumber: '' }],
			checkCollection: '',
			visitDate: new Date(),
			cards: [{ type: 'credit', cardholderName: '', phoneNumber: '' }],
		},
	});

	const {
		fields: merchantFields,
		append: appendMerchant,
		remove: removeMerchant,
	} = useFieldArray({
		control,
		name: 'merchants',
	});

	const {
		fields: userVisitFields,
		append: appendUserVisit,
		remove: removeUserVisit,
	} = useFieldArray({
		control,
		name: 'userVisits',
	});

	const {
		fields: cardFields,
		append: appendCard,
		remove: removeCard,
	} = useFieldArray({
		control,
		name: 'cards',
	});

	const onSubmit = (data: FormData) => {
		try {
			console.log(data);
			setShowSuccessModal(true);
			setTimeout(() => {
				reset();
				setShowSuccessModal(false);
			}, 2000);
		} catch (error) {
			setErrorMessage('Something went wrong. Please try again.');
			setShowErrorModal(true);
			setTimeout(() => {
				setShowErrorModal(false);
			}, 2000);
		}
	};

	const onError = () => {
		setErrorMessage('Please fill in all required fields.');
		setShowErrorModal(true);
		setTimeout(() => {
			setShowErrorModal(false);
		}, 2000);
	};

	return (
		<>
			<form
				onSubmit={handleSubmit(onSubmit, onError)}
				className="container mx-auto p-4 max-w-4xl"
			>
				<Card className="shadow-lg">
					<CardHeader className="border-b bg-muted/40 pb-4">
						<CardTitle className="text-2xl">Merchant Registration</CardTitle>
						<CardDescription>
							Register new merchants and collect card information
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-8 pt-6">
						{/* Merchant Details Section */}
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Merchant Details</h3>
								<Button
									type="button"
									onClick={() =>
										appendMerchant({
											type: 'discount',
											name: '',
											area: '',
										})
									}
									size="sm"
									variant="outline"
								>
									<Plus className="h-4 w-4 mr-2" /> Add Merchant
								</Button>
							</div>
							<div className="grid gap-6">
								{merchantFields.map((field, index) => (
									<Card key={field.id} className="p-4 relative">
										{merchantFields.length > 1 && (
											<Button
												type="button"
												onClick={() => removeMerchant(index)}
												size="icon"
												variant="ghost"
												className="absolute right-2 top-2"
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										)}
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
											<div className="sm:col-span-2 lg:col-span-1">
												<Label>Merchant Type</Label>
												<Controller
													control={control}
													name={`merchants.${index}.type`}
													rules={{ required: true }}
													render={({ field: { onChange, value } }) => (
														<Select onValueChange={onChange} value={value}>
															<SelectTrigger>
																<SelectValue placeholder="Select type" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="discount">
																	Discount
																</SelectItem>
																<SelectItem value="emi">EMI</SelectItem>
																<SelectItem value="BOGO">BOGO</SelectItem>
															</SelectContent>
														</Select>
													)}
												/>
											</div>
											<div className="sm:col-span-2 lg:col-span-1">
												<Label>Merchant Name</Label>
												<Input
													{...register(`merchants.${index}.name`, {
														required: true,
													})}
													placeholder="Enter name"
												/>
											</div>
											<div className="sm:col-span-1">
												<Label>Area</Label>
												<Input
													{...register(`merchants.${index}.area`, {
														required: true,
													})}
													placeholder="Enter area"
												/>
											</div>
											<div className="sm:col-span-1">
												<Label>Phone Number</Label>
												<Input
													{...register(`merchants.${index}.phoneNumber`)}
													placeholder="Phone Number"
												/>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						{/* Card Collection Section */}
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Card Collection</h3>
								<Button
									type="button"
									onClick={() =>
										appendCard({
											type: 'credit',
											cardholderName: '',
											phoneNumber: '',
										})
									}
									size="sm"
									variant="outline"
								>
									<Plus className="h-4 w-4 mr-2" /> Add Card
								</Button>
							</div>
							<div className="grid gap-6">
								{cardFields.map((field, index) => (
									<Card key={field.id} className="p-4 relative">
										{cardFields.length > 1 && (
											<Button
												type="button"
												onClick={() => removeCard(index)}
												size="icon"
												variant="ghost"
												className="absolute right-2 top-2"
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										)}
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="sm:col-span-2 lg:col-span-1">
												<Label>Card Type</Label>
												<Controller
													control={control}
													name={`cards.${index}.type`}
													rules={{ required: true }}
													render={({ field: { onChange, value } }) => (
														<Select onValueChange={onChange} value={value}>
															<SelectTrigger>
																<SelectValue placeholder="Select card type" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="credit">
																	Credit Card
																</SelectItem>
																<SelectItem value="prepaid">
																	Prepaid Card
																</SelectItem>
																<SelectItem value="hajj">Hajj Card</SelectItem>
																<SelectItem value="medical">
																	Medical Card
																</SelectItem>
															</SelectContent>
														</Select>
													)}
												/>
											</div>
											<div className="sm:col-span-2 lg:col-span-1">
												<Label>Cardholder Name</Label>
												<Input
													{...register(`cards.${index}.cardholderName`, {
														required: true,
													})}
													placeholder="Cardholder Name"
												/>
											</div>
											<div className="sm:col-span-2 lg:col-span-1">
												<Label>Phone Number</Label>
												<Input
													{...register(`cards.${index}.phoneNumber`)}
													placeholder="Phone Number"
												/>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						{/* Fresh Merchant Visit Section */}
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold">Fresh Merchant Visit</h3>
								<Button
									type="button"
									onClick={() =>
										appendUserVisit({
											merchantName: '',
											area: '',
											phoneNumber: '',
										})
									}
									size="sm"
									variant="outline"
								>
									<Plus className="h-4 w-4 mr-2" /> Add Visit
								</Button>
							</div>
							<div className="grid gap-6">
								{userVisitFields.map((field, index) => (
									<Card key={field.id} className="p-4 relative">
										{userVisitFields.length > 1 && (
											<Button
												type="button"
												onClick={() => removeUserVisit(index)}
												size="icon"
												variant="ghost"
												className="absolute right-2 top-2"
											>
												<Trash2 className="h-4 w-4 text-destructive" />
											</Button>
										)}
										<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
											<div className="sm:col-span-2 lg:col-span-1">
												<Label>Merchant Name</Label>
												<Input
													{...register(`userVisits.${index}.merchantName`, {
														required: true,
													})}
													placeholder="Merchant Name"
												/>
											</div>
											<div className="sm:col-span-1">
												<Label>Area</Label>
												<Input
													{...register(`userVisits.${index}.area`, {
														required: true,
													})}
													placeholder="Area"
												/>
											</div>
											<div className="sm:col-span-1">
												<Label>Phone Number</Label>
												<Input
													{...register(`userVisits.${index}.phoneNumber`, {
														required: true,
													})}
													placeholder="Phone Number"
												/>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						{/* Deposit Collection Section */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold">Deposit Collection</h3>
							<Card className="p-4">
								<div className="grid gap-6 sm:grid-cols-2">
									<div>
										<Label>Amount</Label>
										<Input
											type="number"
											{...register('checkCollection', { required: true })}
											placeholder="Enter deposit amount"
										/>
									</div>
									<div>
										<Label>Visit Date</Label>
										<Input
											value={format(new Date(), 'EEEE, MMM dd, yyyy')}
											readOnly
											className="bg-muted"
										/>
									</div>
								</div>
							</Card>
						</div>
					</CardContent>
				</Card>
				<Button
					type="submit"
					className="w-full mt-6 py-6 text-lg font-semibold"
				>
					Submit Registration
				</Button>
			</form>

			{/* Success Modal */}
			<Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
				<DialogContent className="sm:max-w-md text-center">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-center gap-2 text-green-600">
							<CheckCircle2 className="h-8 w-8" />
							Success
						</DialogTitle>
						<DialogDescription className="text-center py-4 text-lg">
							Your submission has been successful!
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{/* Error Modal */}
			<Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
				<DialogContent className="sm:max-w-md text-center">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-center gap-2 text-red-600">
							<XCircle className="h-8 w-8" />
							Error
						</DialogTitle>
						<DialogDescription className="text-center py-4 text-lg">
							{errorMessage}
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</>
	);
}
