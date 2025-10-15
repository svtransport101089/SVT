
import React, { useState, useCallback } from 'react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useToast } from '../../hooks/useToast';
import { searchTripByMemoNo, updateTripRecord } from '../../services/googleScriptMock';
import { Trip } from '../../types';

const UpdateTripForm: React.FC = () => {
    const [memoNo, setMemoNo] = useState('');
    const [tripData, setTripData] = useState<Trip | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const { addToast } = useToast();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!memoNo) return;
        setIsLoading(true);
        setTripData(null);
        try {
            const data = await searchTripByMemoNo(memoNo);
            if (data) {
                setTripData(data);
                addToast("Trip found!", "success");
            } else {
                addToast("Trip not found.", "error");
            }
        } catch (error) {
            addToast("Error searching for trip.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (tripData) {
            setTripData(prev => prev ? { ...prev, [id]: value } : null);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tripData) return;
        setIsUpdating(true);
        try {
            const response = await updateTripRecord(tripData);
            if (response.startsWith("SUCCESS")) {
                addToast("Trip updated successfully!", "success");
            } else {
                addToast(response, "error");
            }
        } catch (error) {
             addToast("Error updating trip.", "error");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="space-y-8">
            <Card title="Search for Trip to Update">
                <form onSubmit={handleSearch} className="flex items-end space-x-4">
                    <Input
                        id="memoNo"
                        label="Enter Memo No."
                        value={memoNo}
                        onChange={(e) => setMemoNo(e.target.value)}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner/> : 'Search'}
                    </Button>
                </form>
            </Card>

            {tripData && (
                 <Card title={`Editing Trip #${tripData.trips_memo_no}`}>
                    <form onSubmit={handleUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Input id="trips_date" label="Date" type="date" value={tripData.trips_date} onChange={handleInputChange} />
                            <Input id="customers_name" label="Customer Name" value={tripData.customers_name} onChange={handleInputChange} />
                            <Input id="customers_address1" label="Address 1" value={tripData.customers_address1} onChange={handleInputChange} />
                            <Input id="customers_address2" label="Address 2" value={tripData.customers_address2} onChange={handleInputChange} />
                            <Input id="products_item" label="Service/Vehicle" value={tripData.products_item} readOnly />
                            <Input id="trips_from" label="From" value={tripData.trips_from} onChange={handleInputChange} />
                            <Input id="trips_to" label="To" value={tripData.trips_to} onChange={handleInputChange} />
                            <Input id="trips_vehicle_no" label="Vehicle No" value={tripData.trips_vehicle_no} onChange={handleInputChange} />
                            <Input id="trips_driver_name" label="Driver Name" value={tripData.trips_driver_name} onChange={handleInputChange} />
                            <Input id="advance_paid" label="Advance Paid" type="number" value={tripData.advance_paid} onChange={handleInputChange} />
                            <Input id="total_charges" label="Total Charges" type="number" value={tripData.total_charges} onChange={handleInputChange} />
                            <Input id="balance_due" label="Balance Due" type="number" value={tripData.total_charges - tripData.advance_paid} readOnly />
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button type="submit" disabled={isUpdating}>
                                {isUpdating ? <Spinner /> : 'Update Trip'}
                            </Button>
                        </div>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default UpdateTripForm;
