export enum Page {
    DASHBOARD = 'DASHBOARD',
    NEW_TRIP = 'NEW_TRIP',
    INVOICE = 'INVOICE',
    UPDATE_TRIP = 'UPDATE_TRIP',
    ADD_CUSTOMER = 'ADD_CUSTOMER',
    VIEW_ALL_SERVICES = 'VIEW_ALL_SERVICES',
    MANAGE_AREAS = 'MANAGE_AREAS',
    MANAGE_CALCULATIONS = 'MANAGE_CALCULATIONS',
}

export interface Trip {
    trips_memo_no: string;
    trips_date: string;
    customers_name: string;
    customers_address1: string;
    customers_address2: string;
    products_item: string;
    trips_from: string;
    trips_to: string;
    trips_start_km: number;
    trips_end_km: number;
    trips_total_km: number;
    trips_start_time: string;
    trips_end_time: string;
    trips_total_time: string;
    trips_vehicle_no: string;
    trips_driver_name: string;
    minimum_charges: number;
    additional_charges: number;
    total_charges: number;
    advance_paid: number;
    balance_due: number;
}

export interface CustomerAddress {
    address1: string;
    address2: string;
}

export interface Rates {
    minimumHours: number;
    minimumCharges: number;
    additionalHourRate: number;
}

export interface InvoiceData {
    trips_memo_no: string;
    trip_operated_date1: string;
    trip_upto_operated_date2: string;
    trips_vehicle_no: string;
    customers_name: string;
    customers_address1: string;
    customers_address2: string;
    
    trips_starting_time1: string;
    trips_closing_time1: string;
    trips_starting_time2: string;
    trips_closing_time2: string;
    trips_total_hours: string;
    
    trips_startingKm1: string;
    trips_closingKm1: string;
    trips_startingKm2: string;
    trips_closingKm2: string;
    trips_totalKm: string;
    
    products_item: string;
    trips_minimum_hours1: string;
    trips_minimum_charges1: string;
    
    products_item2: string;
    trips_minimum_hours2: string;
    trips_minimum_charges2: string;

    trips_extra_hours: string;
    trips_for_additional_hour_rate: string;
    trips_for_additional_hour_amt: string;

    trips_fixed_amt_desc: string;
    trips_fixed_amt: string;

    trips_km: string;
    trips_km_rate: string;
    trips_Km_amt: string;

    trips_discount_percentage: string;
    trips_discount: string;

    trips_driver_bata_qty: string;
    trips_driver_bata_rate: string;
    trips_driver_bata_amt: string;

    trips_toll_amt: string;
    trips_permit_amt: string;
    trips_night_hault_amt: string;

    trips_total_amt: string;
    trips_less_advance: string;
    trips_balance: string;
    trips_total_amt_in_words: string;
}
