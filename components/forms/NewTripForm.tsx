
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useToast } from '../../hooks/useToast';
import { generateNewMemoNumber, populateProductList, saveData, fetchRatesFromSheet, updateCustomerAddresses } from '../../services/googleScriptMock';
import { Trip, Rates, CustomerAddress } from '../../types';

const initialTripState: Trip = {
    trips_memo_no: '',
    trips_date: new Date().toISOString().split('T')[0],
    customers_name: '',
    customers_address1: '',
    customers_address2: '',
    products_item: '',
    trips_from: '',
    trips_to: '',
    trips_start_km: 0,
    trips_end_km: 0,
    trips_total_km: 0,
    trips_start_time: '',
    trips_end_time: '',
    trips_total_time: '0',
    trips_vehicle_no: '',
    trips_driver_name: '',
    minimum_charges: 0,
    additional_charges: 0,
    total_charges: 0,
    advance_paid: 0,
    balance_due: 0,
};

const NewTripForm: React.FC = () => {
    const [trip, setTrip] = useState<Trip>(initialTripState);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<string[]>([]);
    const [rates, setRates] = useState<Partial<Rates>>({});
    const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([]);
    const { addToast } = useToast();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [memoNo, productList] = await Promise.all([
                    generateNewMemoNumber(),
                    populateProductList(),
                ]);
                setTrip(prev => ({ ...prev, trips_memo_no: memoNo }));
                setProducts(productList);
                if (productList.length > 0) {
                    setTrip(prev => ({ ...prev, products_item: productList[0] }));
                }
            } catch (error) {
                addToast("Failed to load initial data.", "error");
            }
        };
        loadInitialData();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setTrip(prev => ({ ...prev, [id]: value }));
    };

    const handleCustomerNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setTrip(prev => ({ ...prev, customers_name: name }));
        if (name.length > 2) {
            const addresses = await updateCustomerAddresses(name);
            setCustomerAddresses(addresses);
        } else {
            setCustomerAddresses([]);
        }
    };

    const handleAddressSelect = (address: CustomerAddress) => {
        setTrip(prev => ({
            ...prev,
            customers_address1: address.address1,
            customers_address2: address.address2,
        }));
        setCustomerAddresses([]);
    };
    
    useEffect(() => {
        const fetchRate = async () => {
            if (trip.products_item) {
                const fetchedRates = await fetchRatesFromSheet(trip.products_item);
                setRates(fetchedRates);
                setTrip(prev => ({ ...prev, minimum_charges: fetchedRates.minimumCharges || 0 }));
            }
        };
        fetchRate();
    }, [trip.products_item]);

    const calculateTotals = useCallback(() => {
        const startKm = Number(trip.trips_start_km) || 0;
        const endKm = Number(trip.trips_end_km) || 0;
        const totalKm = endKm > startKm ? endKm - startKm : 0;

        let totalHours = 0;
        if (trip.trips_start_time && trip.trips_end_time) {
            const start = new Date(`1970-01-01T${trip.trips_start_time}`);
            let end = new Date(`1970-01-01T${trip.trips_end_time}`);
            if (end < start) {
                end = new Date(`1970-01-02T${trip.trips_end_time}`);
            }
            totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }
        
        const minHours = rates.minimumHours || 0;
        const additionalHourRate = rates.additionalHourRate || 0;
        const additionalHours = totalHours > minHours ? totalHours - minHours : 0;
        const additionalCharges = Math.ceil(additionalHours) * additionalHourRate;
        
        const minCharges = trip.minimum_charges || 0;
        const totalCharges = minCharges + additionalCharges;
        const balanceDue = totalCharges - (trip.advance_paid || 0);

        setTrip(prev => ({
            ...prev,
            trips_total_km: totalKm,
            trips_total_time: totalHours.toFixed(2),
            additional_charges: additionalCharges,
            total_charges: totalCharges,
            balance_due: balanceDue,
        }));
    }, [trip.trips_start_km, trip.trips_end_km, trip.trips_start_time, trip.trips_end_time, trip.minimum_charges, trip.advance_paid, rates]);

    useEffect(() => {
        calculateTotals();
    }, [calculateTotals]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await saveData(trip);
            addToast("Trip saved successfully!", "success");
            const newMemoNo = await generateNewMemoNumber();
            setTrip({ ...initialTripState, trips_memo_no: newMemoNo, trips_date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            addToast("Failed to save trip.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card title="Create New Trip">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Input id="trips_memo_no" label="Memo No" value={trip.trips_memo_no} readOnly />
                    <Input id="trips_date" label="Date" type="date" value={trip.trips_date} onChange={handleInputChange} />
                    
                    <div className="relative">
                        <Input id="customers_name" label="Customer Name" value={trip.customers_name} onChange={handleCustomerNameChange} />
                         {customerAddresses.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {customerAddresses.map((addr, index) => (
                                    <li key={index} onClick={() => handleAddressSelect(addr)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                                        {addr.address1}, {addr.address2}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Input id="customers_address1" label="Address 1" value={trip.customers_address1} onChange={handleInputChange} />
                    <Input id="customers_address2" label="Address 2" value={trip.customers_address2} onChange={handleInputChange} />
                    <Select id="products_item" label="Service/Vehicle" value={trip.products_item} onChange={handleInputChange} options={products.map(p => ({ value: p, label: p }))} />
                    <Input id="trips_from" label="From" value={trip.trips_from} onChange={handleInputChange} />
                    <Input id="trips_to" label="To" value={trip.trips_to} onChange={handleInputChange} />
                    
                    <Input id="trips_start_km" label="Start KM" type="number" value={trip.trips_start_km} onChange={handleInputChange} />
                    <Input id="trips_end_km" label="End KM" type="number" value={trip.trips_end_km} onChange={handleInputChange} />
                    <Input id="trips_total_km" label="Total KM" type="number" value={trip.trips_total_km} readOnly />
                    
                    <Input id="trips_start_time" label="Start Time" type="time" value={trip.trips_start_time} onChange={handleInputChange} />
                    <Input id="trips_end_time" label="End Time" type="time" value={trip.trips_end_time} onChange={handleInputChange} />
                    <Input id="trips_total_time" label="Total Time (Hrs)" value={trip.trips_total_time} readOnly />
                    
                    <Input id="trips_vehicle_no" label="Vehicle No" value={trip.trips_vehicle_no} onChange={handleInputChange} />
                    <Input id="trips_driver_name" label="Driver Name" value={trip.trips_driver_name} onChange={handleInputChange} />
                    
                    <Input id="minimum_charges" label="Minimum Charges" type="number" value={trip.minimum_charges} onChange={handleInputChange} />
                    <Input id="additional_charges" label="Additional Charges" type="number" value={trip.additional_charges} readOnly />
                    <Input id="total_charges" label="Total Charges" type="number" value={trip.total_charges} readOnly />

                    <Input id="advance_paid" label="Advance Paid" type="number" value={trip.advance_paid} onChange={handleInputChange} />
                    <Input id="balance_due" label="Balance Due" type="number" value={trip.balance_due} readOnly />
                </div>
                <div className="mt-8 flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Save Trip'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default NewTripForm;
