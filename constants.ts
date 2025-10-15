export const VEHICLE_TYPES: string[] = ["TATA ACE", "DOST", "407", "DCM Toyota", "17 Feet", "20 Feet"];
export const LOCATION_CATEGORIES: string[] = ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5", "Area 6", "Area 7", "Area 8", "Area 9"];

export const TRIP_FORM_FIELDS = [
    { id: "trips_memo_no", label: "Memo No", type: "text", readOnly: true },
    { id: "trips_date", label: "Date", type: "date" },
    { id: "customers_name", label: "Customer Name", type: "text" },
    { id: "customers_address1", label: "Address 1", type: "text" },
    { id: "customers_address2", label: "Address 2", type: "text" },
    { id: "products_item", label: "Service/Vehicle", type: "select", options: [] },
    { id: "trips_from", label: "From", type: "text" },
    { id: "trips_to", label: "To", type: "text" },
    { id: "trips_start_km", label: "Start KM", type: "number" },
    { id: "trips_end_km", label: "End KM", type: "number" },
    { id: "trips_total_km", label: "Total KM", type: "number", readOnly: true },
    { id: "trips_start_time", label: "Start Time", type: "time" },
    { id: "trips_end_time", label: "End Time", type: "time" },
    { id: "trips_total_time", label: "Total Time (Hrs)", type: "text", readOnly: true },
    { id: "trips_vehicle_no", label: "Vehicle No", type: "text" },
    { id: "trips_driver_name", label: "Driver Name", type: "text" },
    { id: "minimum_charges", label: "Minimum Charges", type: "number" },
    { id: "additional_charges", label: "Additional Charges", type: "number", readOnly: true },
    { id: "total_charges", label: "Total Charges", type: "number", readOnly: true },
    { id: "advance_paid", label: "Advance Paid", type: "number" },
    { id: "balance_due", label: "Balance Due", type: "number", readOnly: true },
];