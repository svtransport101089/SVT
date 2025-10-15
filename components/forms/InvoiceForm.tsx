
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../hooks/useToast';
import { InvoiceData, CustomerAddress, Rates } from '../../types';
import { generateNewMemoNumber, populateProductList, updateCustomerAddresses, fetchRatesFromSheet, saveInvoiceData, searchInvoiceByMemoNo } from '../../services/googleScriptMock';
import { numberToWords } from '../../utils/numberToWords';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const initialInvoiceState: InvoiceData = {
    trips_memo_no: '', trip_operated_date1: new Date().toISOString().split('T')[0], trip_upto_operated_date2: '',
    trips_vehicle_no: '', customers_name: '', customers_address1: '', customers_address2: '',
    trips_starting_time1: '', trips_closing_time1: '', trips_starting_time2: '', trips_closing_time2: '',
    trips_total_hours: '0.00', trips_startingKm1: '', trips_closingKm1: '', trips_startingKm2: '',
    trips_closingKm2: '', trips_totalKm: '0', products_item: '', trips_minimum_hours1: '',
    trips_minimum_charges1: '', products_item2: '', trips_minimum_hours2: '', trips_minimum_charges2: '',
    trips_extra_hours: '', trips_for_additional_hour_rate: '', trips_for_additional_hour_amt: '',
    trips_fixed_amt_desc: 'Fixed Amount', trips_fixed_amt: '', trips_km: '', trips_km_rate: '',
    trips_Km_amt: '', trips_discount_percentage: '', trips_discount: '', trips_driver_bata_qty: '',
    trips_driver_bata_rate: '', trips_driver_bata_amt: '', trips_toll_amt: '', trips_permit_amt: '',
    trips_night_hault_amt: '', trips_total_amt: '0', trips_less_advance: '', trips_balance: '0',
    trips_total_amt_in_words: 'Zero Rupees Only'
};

const InvoiceForm: React.FC = () => {
    const [data, setData] = useState<InvoiceData>(initialInvoiceState);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<string[]>([]);
    const [customerAddresses, setCustomerAddresses] = useState<CustomerAddress[]>([]);
    const [rates1, setRates1] = useState<Partial<Rates>>({});
    const [rates2, setRates2] = useState<Partial<Rates>>({});
    const { addToast } = useToast();

    useEffect(() => {
        const loadInitialData = async () => {
            const [memoNo, productList] = await Promise.all([generateNewMemoNumber(), populateProductList()]);
            setData(prev => ({ ...prev, trips_memo_no: memoNo }));
            setProducts(productList);
        };
        loadInitialData();
    }, []);

    const resetForm = async () => {
        const newMemoNo = await generateNewMemoNumber();
        setData({ ...initialInvoiceState, trips_memo_no: newMemoNo });
        setRates1({});
        setRates2({});
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleCustomerNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData(prev => ({ ...prev, customers_name: name }));
        if (name.length > 2) {
            const addresses = await updateCustomerAddresses(name);
            setCustomerAddresses(addresses);
        } else {
            setCustomerAddresses([]);
        }
    };
    
    const handleAddressSelect = (address: CustomerAddress) => {
        setData(prev => ({
            ...prev,
            customers_address1: address.address1,
            customers_address2: address.address2,
        }));
        setCustomerAddresses([]);
    };

    const handleSearch = async () => {
        if (!data.trips_memo_no) return;
        setIsLoading(true);
        const result = await searchInvoiceByMemoNo(data.trips_memo_no);
        if (result) {
            setData(result);
            addToast("Invoice found and loaded!", "success");
        } else {
            addToast("Invoice not found.", "error");
        }
        setIsLoading(false);
    }
    
    // Fetch rates for product 1
    useEffect(() => {
        const fetchRate = async () => {
            if (data.products_item) {
                const fetchedRates = await fetchRatesFromSheet(data.products_item);
                setRates1(fetchedRates);
                setData(prev => ({
                    ...prev,
                    trips_minimum_hours1: String(fetchedRates.minimumHours || ''),
                    trips_minimum_charges1: String(fetchedRates.minimumCharges || ''),
                    trips_for_additional_hour_rate: String(fetchedRates.additionalHourRate || '')
                }));
            }
        };
        fetchRate();
    }, [data.products_item]);

    // Fetch rates for product 2
    useEffect(() => {
        const fetchRate = async () => {
            if (data.products_item2) {
                const fetchedRates = await fetchRatesFromSheet(data.products_item2);
                setRates2(fetchedRates);
                setData(prev => ({
                    ...prev,
                    trips_minimum_hours2: String(fetchedRates.minimumHours || ''),
                    trips_minimum_charges2: String(fetchedRates.minimumCharges || ''),
                }));
            }
        };
        fetchRate();
    }, [data.products_item2]);

    // All calculations in one useEffect to ensure correct order
    useEffect(() => {
        // Calculate Total Hours
        const timeToMinutes = (time: string) => {
            if (!time) return 0;
            const [hours, minutes] = time.split(':').map(Number);
            return (hours * 60) + (minutes || 0);
        };
        const start1 = timeToMinutes(data.trips_starting_time1);
        const close1 = timeToMinutes(data.trips_closing_time1);
        const start2 = timeToMinutes(data.trips_starting_time2);
        const close2 = timeToMinutes(data.trips_closing_time2);
        const hours1 = close1 < start1 ? (close1 + 1440) - start1 : close1 - start1;
        const hours2 = close2 < start2 ? (close2 + 1440) - start2 : close2 - start2;
        const totalMinutes = hours1 + hours2;
        const totalHours = totalMinutes / 60;

        // Calculate Total KM
        const startKm1 = parseFloat(data.trips_startingKm1) || 0;
        const closeKm1 = parseFloat(data.trips_closingKm1) || 0;
        const startKm2 = parseFloat(data.trips_startingKm2) || 0;
        const closeKm2 = parseFloat(data.trips_closingKm2) || 0;
        const totalKm = (closeKm1 > startKm1 ? closeKm1 - startKm1 : 0) + (closeKm2 > startKm2 ? closeKm2 - startKm2 : 0);
        
        // Extra Hours
        const minHours1 = parseFloat(data.trips_minimum_hours1) || 0;
        const minHours2 = parseFloat(data.trips_minimum_hours2) || 0;
        let extraHours = totalHours - minHours1 - minHours2;
        extraHours = extraHours < 0 ? 0 : extraHours;
        const addHrRate = parseFloat(data.trips_for_additional_hour_rate) || 0;
        const addHrAmt = Math.ceil(extraHours) * addHrRate;

        // KM Amount
        const kmRate = parseFloat(data.trips_km_rate) || 0;
        const kmAmt = totalKm * kmRate;

        // Discount
        const charge1 = parseFloat(data.trips_minimum_charges1) || 0;
        const charge2 = parseFloat(data.trips_minimum_charges2) || 0;
        const discPerc = parseFloat(data.trips_discount_percentage) || 0;
        const discount = -((charge1 + charge2 + addHrAmt) * discPerc) / 100;

        // Total Amount
        const fields = [charge1, charge2, addHrAmt, kmAmt,
            parseFloat(data.trips_fixed_amt) || 0,
            discount,
            parseFloat(data.trips_driver_bata_amt) || 0,
            parseFloat(data.trips_toll_amt) || 0,
            parseFloat(data.trips_permit_amt) || 0,
            parseFloat(data.trips_night_hault_amt) || 0
        ];
        const totalAmt = fields.reduce((acc, val) => acc + val, 0);
        
        // Balance
        const lessAdvance = parseFloat(data.trips_less_advance) || 0;
        const balance = totalAmt - lessAdvance;

        setData(prev => ({
            ...prev,
            trips_total_hours: totalHours.toFixed(2),
            trips_totalKm: String(totalKm),
            trips_km: String(totalKm),
            trips_extra_hours: extraHours.toFixed(2),
            trips_for_additional_hour_amt: String(addHrAmt.toFixed(0)),
            trips_Km_amt: String(kmAmt.toFixed(0)),
            trips_discount: String(discount.toFixed(0)),
            trips_total_amt: String(totalAmt.toFixed(0)),
            trips_balance: String(balance.toFixed(0)),
            trips_total_amt_in_words: numberToWords(balance)
        }));

    }, [
        data.trips_starting_time1, data.trips_closing_time1, data.trips_starting_time2, data.trips_closing_time2,
        data.trips_startingKm1, data.trips_closingKm1, data.trips_startingKm2, data.trips_closingKm2,
        data.trips_minimum_hours1, data.trips_minimum_hours2, data.trips_for_additional_hour_rate, data.trips_km_rate,
        data.trips_minimum_charges1, data.trips_minimum_charges2, data.trips_discount_percentage,
        data.trips_fixed_amt, data.trips_driver_bata_amt, data.trips_toll_amt, data.trips_permit_amt,
        data.trips_night_hault_amt, data.trips_less_advance
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await saveInvoiceData(data);
            addToast("Invoice saved successfully!", "success");
            await resetForm();
        } catch (error) {
            addToast("Failed to save invoice.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white p-4 shadow-lg rounded-lg font-bold text-sm">
                {/* Header Row */}
                <div className="flex border-2 border-gray-300">
                    <div className="w-9/12 p-2 border-r-2 border-gray-300">
                        <div className="flex items-center">
                            <img src="https://yo.fan/cdn/media-store%2Fpublic%2FOQcIlej0eQWI7C5URGLGQyDjTUk2%2F26033ce2-5d15-421c-bb76-ad85eb7ac7ff%2F794-450.jpg" alt="Logo" className="h-16 mr-4" />
                            <div>
                                <h1 className="text-blue-600 font-extrabold text-2xl">SREE VENKATESWARA TRANSPORT</h1>
                                <p>NO:3/96, Kumaran Kudil Annex 3rd Street, Thuraipakkam, Chennai-97</p>
                                <p>Phone: 87789-92624, 97907-24160 | Email: svtransport.75@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-3/12 p-2 space-y-1">
                         <div className="flex items-center">
                            <span className="w-1/3">Memo No:</span>
                            <input name="trips_memo_no" value={data.trips_memo_no} onChange={handleChange} className="p-1 border border-gray-300 rounded w-2/3" />
                            <button type="button" onClick={handleSearch} className="ml-1 px-2 py-1 bg-blue-500 text-white rounded text-xs">S</button>
                        </div>
                        <div className="flex items-center">
                            <span className="w-1/3">Date:</span>
                            <input type="date" name="trip_operated_date1" value={data.trip_operated_date1} onChange={handleChange} className="p-1 border border-gray-300 rounded w-2/3" />
                        </div>
                        <div className="flex items-center">
                            <span className="w-1/3">Upto:</span>
                            <input type="date" name="trip_upto_operated_date2" value={data.trip_upto_operated_date2} onChange={handleChange} className="p-1 border border-gray-300 rounded w-2/3" />
                        </div>
                         <div className="flex items-center">
                            <span className="w-1/3">Vehicle:</span>
                            <input name="trips_vehicle_no" value={data.trips_vehicle_no} onChange={handleChange} className="p-1 border border-gray-300 rounded w-2/3" />
                        </div>
                    </div>
                </div>

                {/* Customer / Time / KM Row */}
                <div className="flex border-2 border-gray-300 border-t-0">
                    <div className="w-6/12 p-2 border-r-2 border-gray-300 space-y-2 relative">
                        <div className="flex items-center">
                            <span className="w-1/4">Customer:</span>
                            <input name="customers_name" value={data.customers_name} onChange={handleCustomerNameChange} className="p-1 border border-gray-300 rounded w-3/4" />
                        </div>
                         {customerAddresses.length > 0 && (
                            <ul className="absolute z-10 w-3/4 right-2 bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {customerAddresses.map((addr, index) => (
                                    <li key={index} onClick={() => handleAddressSelect(addr)} className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                                        {addr.address1}, {addr.address2}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="flex items-center">
                            <span className="w-1/4">Address 1:</span>
                            <input name="customers_address1" value={data.customers_address1} onChange={handleChange} className="p-1 border border-gray-300 rounded w-3/4 bg-gray-100" readOnly/>
                        </div>
                         <div className="flex items-center">
                            <span className="w-1/4">Address 2:</span>
                            <input name="customers_address2" value={data.customers_address2} onChange={handleChange} className="p-1 border border-gray-300 rounded w-3/4 bg-gray-100" readOnly/>
                        </div>
                    </div>
                     <div className="w-3/12 p-2 border-r-2 border-gray-300 space-y-1">
                        <div className="flex items-center"><span className="w-2/5">T1 Start:</span><input type="time" name="trips_starting_time1" value={data.trips_starting_time1} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">T1 Close:</span><input type="time" name="trips_closing_time1" value={data.trips_closing_time1} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">T2 Start:</span><input type="time" name="trips_starting_time2" value={data.trips_starting_time2} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">T2 Close:</span><input type="time" name="trips_closing_time2" value={data.trips_closing_time2} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">Total Hrs:</span><input name="trips_total_hours" value={data.trips_total_hours} readOnly className="p-1 border w-3/5 bg-gray-100" /></div>
                    </div>
                     <div className="w-3/12 p-2 space-y-1">
                        <div className="flex items-center"><span className="w-2/5">KM Start 1:</span><input type="number" name="trips_startingKm1" value={data.trips_startingKm1} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">KM Close 1:</span><input type="number" name="trips_closingKm1" value={data.trips_closingKm1} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">KM Start 2:</span><input type="number" name="trips_startingKm2" value={data.trips_startingKm2} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">KM Close 2:</span><input type="number" name="trips_closingKm2" value={data.trips_closingKm2} onChange={handleChange} className="p-1 border w-3/5" /></div>
                        <div className="flex items-center"><span className="w-2/5">Total KM:</span><input name="trips_totalKm" value={data.trips_totalKm} readOnly className="p-1 border w-3/5 bg-gray-100" /></div>
                    </div>
                </div>

                {/* Charges Table */}
                 <div className="border-2 border-gray-300 border-t-0">
                    <div className="flex bg-green-200 text-black p-1">
                        <div className="w-6/12 pl-1">Particulars</div>
                        <div className="w-2/12 text-right pr-1">Qty</div>
                        <div className="w-2/12 text-right pr-1">Rate</div>
                        <div className="w-2/12 text-right pr-1">Amount</div>
                    </div>
                    <div className="space-y-1 p-1">
                        {/* Row 1 */}
                        <div className="flex items-center space-x-1">
                            <input name="products_item" value={data.products_item} onChange={handleChange} list="productList" className="p-1 border w-6/12" placeholder="Service 1" />
                            <input name="trips_minimum_hours1" value={data.trips_minimum_hours1} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                            <input className="p-1 border w-2/12 text-right" disabled />
                            <input name="trips_minimum_charges1" value={data.trips_minimum_charges1} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                        {/* Row 2 */}
                        <div className="flex items-center space-x-1">
                             <input name="products_item2" value={data.products_item2} onChange={handleChange} list="productList" className="p-1 border w-6/12" placeholder="Service 2" />
                            <input name="trips_minimum_hours2" value={data.trips_minimum_hours2} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                            <input className="p-1 border w-2/12 text-right" disabled/>
                            <input name="trips_minimum_charges2" value={data.trips_minimum_charges2} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                        {/* Other rows */}
                        <div className="flex items-center space-x-1">
                            <input defaultValue="Extra Hours" className="p-1 border w-6/12 bg-gray-100" readOnly/>
                            <input name="trips_extra_hours" value={data.trips_extra_hours} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                            <input name="trips_for_additional_hour_rate" value={data.trips_for_additional_hour_rate} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                            <input name="trips_for_additional_hour_amt" value={data.trips_for_additional_hour_amt} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <input name="trips_fixed_amt_desc" value={data.trips_fixed_amt_desc} onChange={handleChange} className="p-1 border w-6/12" />
                            <input className="p-1 border w-2/12 text-right" disabled />
                            <input className="p-1 border w-2/12 text-right" disabled />
                            <input name="trips_fixed_amt" value={data.trips_fixed_amt} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <input defaultValue="Total Km Operated" className="p-1 border w-6/12 bg-gray-100" readOnly />
                            <input name="trips_km" value={data.trips_km} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                            <input name="trips_km_rate" value={data.trips_km_rate} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                            <input name="trips_Km_amt" value={data.trips_Km_amt} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                        </div>
                        <div className="flex items-center space-x-1">
                            <input defaultValue="Discount %" className="p-1 border w-6/12 bg-gray-100" readOnly />
                            <input name="trips_discount_percentage" value={data.trips_discount_percentage} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                            <input className="p-1 border w-2/12 text-right" disabled />
                            <input name="trips_discount" value={data.trips_discount} readOnly className="p-1 border w-2/12 text-right bg-gray-100" />
                        </div>
                        <div className="flex items-center space-x-1">
                             <input defaultValue="Driver Bata" className="p-1 border w-6/12 bg-gray-100" readOnly />
                             <input className="p-1 border w-2/12 text-right" disabled/>
                             <input className="p-1 border w-2/12 text-right" disabled/>
                            <input name="trips_driver_bata_amt" value={data.trips_driver_bata_amt} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                         <div className="flex items-center space-x-1">
                             <input defaultValue="Toll Charges" className="p-1 border w-6/12 bg-gray-100" readOnly />
                             <input className="p-1 border w-2/12 text-right" disabled/>
                             <input className="p-1 border w-2/12 text-right" disabled/>
                            <input name="trips_toll_amt" value={data.trips_toll_amt} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                        <div className="flex items-center space-x-1">
                             <input defaultValue="Permit" className="p-1 border w-6/12 bg-gray-100" readOnly />
                             <input className="p-1 border w-2/12 text-right" disabled/>
                             <input className="p-1 border w-2/12 text-right" disabled/>
                            <input name="trips_permit_amt" value={data.trips_permit_amt} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                        <div className="flex items-center space-x-1">
                             <input defaultValue="Night Hault" className="p-1 border w-6/12 bg-gray-100" readOnly />
                             <input className="p-1 border w-2/12 text-right" disabled/>
                             <input className="p-1 border w-2/12 text-right" disabled/>
                            <input name="trips_night_hault_amt" value={data.trips_night_hault_amt} onChange={handleChange} className="p-1 border w-2/12 text-right" />
                        </div>
                    </div>
                </div>
                <datalist id="productList">
                    {products.map(p => <option key={p} value={p} />)}
                </datalist>

                {/* Footer and Totals */}
                <div className="flex border-2 border-gray-300 border-t-0">
                    <div className="w-8/12 p-2 border-r-2 border-gray-300">
                        <input name="trips_total_amt_in_words" value={data.trips_total_amt_in_words} readOnly className="p-1 border w-full h-full bg-gray-100" />
                    </div>
                    <div className="w-2/12 p-2 border-r-2 border-gray-300 text-right space-y-1">
                        <div>Bill Value</div>
                        <div>Less Advance</div>
                        <div>Balance</div>
                    </div>
                    <div className="w-2/12 p-2 space-y-1">
                        <input name="trips_total_amt" value={data.trips_total_amt} readOnly className="p-1 border w-full text-right bg-gray-100" />
                        <input name="trips_less_advance" value={data.trips_less_advance} onChange={handleChange} className="p-1 border w-full text-right" />
                        <input name="trips_balance" value={data.trips_balance} readOnly className="p-1 border w-full text-right bg-gray-100" />
                    </div>
                </div>

                {/* Bank Details and Signature */}
                <div className="flex border-2 border-gray-300 border-t-0">
                     <div className="w-8/12 p-2 border-r-2 border-gray-300">
                        <h5 className="font-extrabold">BANK DETAILS:</h5>
                        <p><strong>Bank Name:</strong> KARUR VYSHYA BANK</p>
                        <p><strong>Branch:</strong> WHITES ROAD</p>
                        <p><strong>A/C No:</strong> 1219115000010252</p>
                        <p><strong>IFSC:</strong> KVBL0001219</p>
                    </div>
                    <div className="w-4/12 p-2 text-center flex flex-col justify-between">
                         <div>For <b>SREE VENKATESWARA TRANSPORT</b></div>
                         <div className="mt-12">Authorized Signatory</div>
                    </div>
                </div>

                 <div className="mt-4 flex justify-end space-x-4">
                    <Button type="button" onClick={resetForm} className="bg-gray-500 hover:bg-gray-600">
                        Clear
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Spinner /> : 'Save Invoice'}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default InvoiceForm;
