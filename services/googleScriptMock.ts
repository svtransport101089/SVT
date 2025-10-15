
import { Trip, CustomerAddress, Rates, InvoiceData } from '../types';
import { VEHICLE_TYPES } from '../constants';

// This is a mock to simulate calls to a Google Apps Script backend.
// In a real application, this would be replaced with actual API calls.

const MOCK_DELAY = 500;

// --- Mock Data ---
let trips: Trip[] = [
    {
        trips_memo_no: 'SVS-001',
        trips_date: '2023-10-26',
        customers_name: 'John Doe',
        customers_address1: '123 Main St',
        customers_address2: 'Anytown',
        products_item: 'TATA ACE',
        trips_from: 'Warehouse A',
        trips_to: 'Customer Site',
        trips_start_km: 1000,
        trips_end_km: 1050,
        trips_total_km: 50,
        trips_start_time: '09:00',
        trips_end_time: '11:00',
        trips_total_time: '2.00',
        trips_vehicle_no: 'TN-01-A-1234',
        trips_driver_name: 'Ramesh',
        minimum_charges: 1000,
        additional_charges: 0,
        total_charges: 1000,
        advance_paid: 500,
        balance_due: 500,
    }
];
let invoices: InvoiceData[] = [];
let customers: { customers_name: string; customers_address1: string; customers_address2: string; }[] = [
    { customers_name: 'John Doe', customers_address1: '123 Main St', customers_address2: 'Anytown' },
    { customers_name: 'Jane Smith', customers_address1: '456 Oak Ave', customers_address2: 'Otherville' }
];
const products = ['TATA ACE', 'DOST', '407', 'DCM Toyota', '17 Feet', '20 Feet'];
const rates: { [key: string]: Rates } = {
    'TATA ACE': { minimumHours: 4, minimumCharges: 1000, additionalHourRate: 200 },
    'DOST': { minimumHours: 4, minimumCharges: 1200, additionalHourRate: 250 },
    '407': { minimumHours: 5, minimumCharges: 2000, additionalHourRate: 300 },
    'DCM Toyota': { minimumHours: 5, minimumCharges: 2500, additionalHourRate: 350 },
    '17 Feet': { minimumHours: 6, minimumCharges: 3000, additionalHourRate: 400 },
    '20 Feet': { minimumHours: 6, minimumCharges: 3500, additionalHourRate: 450 },
};

let mockAreas: string[][] = [
    ["Local Trip", "Area 1"], ["Appolo Hospital", "Area 1"], ["Arumbakkam Bus Stand", "Area 1"],
    ["Guindy", "Area 1"], ["ICF", "Area 1"], ["Pambuputhu Koil", "Area 1"], ["Tandiarpet", "Area 1"],
    ["Vadapalani Bus Stand", "Area 1"], ["Velachery Pambu Puthu Koil", "Area 1"], ["Agaram", "Area 2"],
    ["Ambattur", "Area 2"], ["Erukanchery", "Area 2"], ["I.D Hospital", "Area 2"], ["Kandanchavadi", "Area 2"],
    ["Keelkattalai", "Area 2"], ["Kodungaiyur", "Area 2"], ["Kolapakkam", "Area 2"], ["Kolathur", "Area 2"],
    ["Kottivakkam", "Area 2"], ["M.K.B Nagar", "Area 2"], ["Madhavaram", "Area 2"], ["Madipakkam", "Area 2"],
    ["Maduvangarai", "Area 2"], ["Mettukuppam", "Area 2"], ["Moolakadai", "Area 2"], ["Nandambakkam", "Area 2"],
    ["Nerkundram", "Area 2"], ["Padi", "Area 2"], ["Palavakkam", "Area 2"], ["Pallavaram", "Area 2"],
    ["Peravallur", "Area 2"], ["Perungudi", "Area 2"], ["Porur", "Area 2"], ["Sembiam", "Area 2"],
    ["Thiruvanmiyur", "Area 2"], ["Thiruvotriyur", "Area 2"], ["Thoraipakkam", "Area 2"], ["Valasaravakkam", "Area 2"],
    ["Velachery", "Area 2"], ["Vijayanagaram", "Area 2"], ["Virugambakkam", "Area 2"], ["Akkarai", "Area 3"],
    ["Annanoore", "Area 3"], ["Athipedu", "Area 3"], ["Avadi", "Area 3"], ["Ayambekkam", "Area 3"],
    ["Ayappakkam", "Area 3"], ["Chitlapakkam", "Area 3"], ["Chrompet", "Area 3"], ["Ennore", "Area 3"],
    ["Girugambakkam", "Area 3"], ["Golden Beach (VGP)", "Area 3"], ["Injambakkam", "Area 3"], ["Kallikuppam", "Area 3"],
    ["Karapakkam", "Area 3"], ["Kattupakkam", "Area 3"], ["Manali", "Area 3"], ["Medavakkam", "Area 3"],
    ["Muthukaranchavadi", "Area 3"], ["Numbal", "Area 3"], ["Pallikaranai", "Area 3"], ["Pammal", "Area 3"],
    ["Perumbbakkam", "Area 3"], ["Poonamallee", "Area 3"], ["Puzhal", "Area 3"], ["Red Hills", "Area 3"],
    ["Solinganallur", "Area 3"], ["Sothupakkam", "Area 3"], ["Tambaram", "Area 3"], ["Vadaperumbakkam", "Area 3"],
    ["Vanagaram", "Area 3"], ["Vengaivasal", "Area 3"], ["Alamathi", "Area 4"], ["AvadiHVF", "Area 4"],
    ["Chembarambakkam", "Area 4"], ["Chemmanchery", "Area 4"], ["Cholavaram", "Area 4"], ["Kanathur", "Area 4"],
    ["Karanodai", "Area 4"], ["Kovur", "Area 4"], ["Kundrathur", "Area 4"], ["Meenjore", "Area 4"],
    ["Molavarpakkam", "Area 4"], ["Navalur", "Area 4"], ["Panchetty", "Area 4"], ["Pattabiram", "Area 4"],
    ["Ponmar", "Area 4"], ["Thirumazhisai", "Area 4"], ["Thiruvallur-1", "Area 4"], ["Urapakkam", "Area 4"],
    ["Uthandi", "Area 4"], ["Vallamedu", "Area 4"], ["Vandalur", "Area 4"], ["Vaniyanchavadi", "Area 4"],
    ["Vengal Kuttu Road", "Area 4"], ["Athipattu", "Area 5"], ["Azhingivakkam", "Area 5"], ["Guduvanchery", "Area 5"],
    ["Kakalur", "Area 5"], ["Kandigai", "Area 5"], ["Kelambakkam", "Area 5"], ["Kovalam", "Area 5"],
    ["Manimangalam", "Area 5"], ["Muttukadu", "Area 5"], ["Nemilichery", "Area 5"], ["Padappai", "Area 5"],
    ["Padur", "Area 5"], ["Paruthipattu", "Area 5"], ["Ponneri", "Area 5"], ["Poochi Athipedu", "Area 5"],
    ["Shevapet", "Area 5"], ["Urakkadu", "Area 5"], ["Vengal", "Area 5"], ["Alathur", "Area 6"],
    ["Gummidipoondi", "Area 6"], ["Kavarapet", "Area 6"], ["Maraimalai Nagar", "Area 6"], ["Periyapalayam", "Area 6"],
    ["Puduvoyal", "Area 6"], ["Sengadu", "Area 6"], ["Singaperumal Koil", "Area 6"], ["Sriperumbathur", "Area 6"],
    ["Thiruporur", "Area 6"], ["Thiruvallur", "Area 6"], ["Vadanemili", "Area 6"], ["Vallam", "Area 6"],
    ["Chengalpet", "Area 7"], ["Elaavur", "Area 7"], ["Madharpakkam", "Area 7"], ["Mahabalipuram", "Area 7"],
    ["Oragadam", "Area 7"], ["Pazhaverkadu", "Area 7"], ["Poondi", "Area 7"], ["Sunguvachathiram", "Area 7"],
    ["Ulandai", "Area 7"], ["Arambakkam", "Area 8"], ["Kalpakkam", "Area 8"], ["Kancheepuram", "Area 8"],
    ["Poonur", "Area 8"], ["Pukkathurai", "Area 8"], ["Thiruvelangadu", "Area 8"], ["Uthukottai", "Area 8"],
    ["Arakkonam", "Area 9"], ["Maduranthagam", "Area 9"], ["Serampalayam", "Area 9"], ["Thiruthani", "Area 9"],
    ["Manjampakkam", "Area 3"], ["Alandur", "Area 2"], ["Thirumudivakkam", "Area 4"], ["Anakaputhur", "Area 3"],
    ["Walajabad", "Area 7"]
];

let mockCalculations: string[][] = [
    ["products_type_category", "products_minimum_hours", "products_minimum_km", "products_minimum_charges", "products_additional_hours_charges", "products_running_hours", "products_driver_bata"],
    ["17 Feet_Area 1", "2", "20", "1350", "300", "0", "25"],
    ["17 Feet_Area 2", "2", "30", "1550", "300", "1", "25"],
    ["17 Feet_Area 3", "2", "50", "1750", "300", "1.25", "25"],
    ["17 Feet_Area 4", "3.5", "70", "2400", "300", "1.5", "25"],
    ["17 Feet_Area 5", "4.5", "80", "2800", "300", "1.75", "25"],
    ["17 Feet_Area 6", "5", "90", "3000", "300", "2", "25"],
    ["17 Feet_Area 7", "5.5", "110", "3500", "300", "2.5", "25"],
    ["17 Feet_Area 8", "6", "150", "4200", "300", "3", "25"],
    ["17 Feet_Area 9", "8", "200", "5200", "300", "3.5", "25"],
    ["20 Feet_Area 1", "2", "20", "1450", "320", "0", "25"],
    ["20 Feet_Area 2", "2", "30", "1650", "320", "1", "25"],
    ["20 Feet_Area 3", "2", "50", "1850", "320", "1.25", "25"],
    ["20 Feet_Area 4", "3.5", "70", "2600", "320", "1.5", "25"],
    ["20 Feet_Area 5", "4.5", "80", "3000", "320", "1.75", "25"],
    ["20 Feet_Area 6", "5", "90", "3200", "320", "2", "25"],
    ["20 Feet_Area 7", "5.5", "110", "3700", "320", "2.5", "25"],
    ["20 Feet_Area 8", "6", "150", "4400", "320", "3", "25"],
    ["20 Feet_Area 9", "8", "200", "5400", "320", "3.5", "25"],
    ["407_Area 1", "2", "20", "1000", "220", "0", "25"],
    ["407_Area 2", "2", "30", "1100", "220", "1", "25"],
    ["407_Area 3", "2", "50", "1400", "220", "1.25", "25"],
    ["407_Area 4", "3.5", "70", "1900", "220", "1.5", "25"],
    ["407_Area 5", "4.5", "80", "2200", "220", "1.75", "25"],
    ["407_Area 6", "5", "90", "2400", "220", "2", "25"],
    ["407_Area 7", "5.5", "110", "2750", "220", "2.5", "25"],
    ["407_Area 8", "6", "150", "3200", "220", "3", "25"],
    ["407_Area 9", "8", "200", "4100", "220", "3.5", "25"],
    ["DCM Toyota_Area 1", "2", "20", "1200", "260", "0", "25"],
    ["DCM Toyota_Area 2", "2", "30", "1350", "260", "1", "25"],
    ["DCM Toyota_Area 3", "2", "50", "1500", "260", "1.25", "25"],
    ["DCM Toyota_Area 4", "3.5", "70", "2200", "260", "1.5", "25"],
    ["DCM Toyota_Area 5", "4.5", "80", "2500", "260", "1.75", "25"],
    ["DCM Toyota_Area 6", "5", "90", "2700", "260", "2", "25"],
    ["DCM Toyota_Area 7", "5.5", "110", "3200", "260", "2.5", "25"],
    ["DCM Toyota_Area 8", "6", "150", "3600", "260", "3", "25"],
    ["DCM Toyota_Area 9", "8", "200", "4500", "260", "3.5", "25"],
    ["DOST_Area 1", "2", "20", "900", "200", "0", "25"],
    ["DOST_Area 2", "2", "30", "1000", "200", "1", "25"],
    ["DOST_Area 3", "2", "50", "1300", "200", "1.25", "25"],
    ["DOST_Area 4", "3.5", "70", "1700", "200", "1.5", "25"],
    ["DOST_Area 5", "4.5", "80", "2000", "200", "1.75", "25"],
    ["DOST_Area 6", "5", "90", "2200", "200", "2", "25"],
    ["DOST_Area 7", "5.5", "110", "2500", "200", "2.5", "25"],
    ["DOST_Area 8", "6", "150", "2900", "200", "3", "25"],
    ["DOST_Area 9", "8", "200", "3700", "200", "3.5", "25"],
    ["TATA ACE_Area 1", "2", "20", "600", "180", "0", "25"],
    ["TATA ACE_Area 2", "2", "30", "800", "180", "1", "25"],
    ["TATA ACE_Area 3", "2", "50", "1000", "180", "1.25", "25"],
    ["TATA ACE_Area 4", "3.5", "70", "1300", "180", "1.5", "25"],
    ["TATA ACE_Area 5", "4.5", "80", "1500", "180", "1.75", "25"],
    ["TATA ACE_Area 6", "5", "90", "1700", "180", "2", "25"],
    ["TATA ACE_Area 7", "5.5", "110", "1900", "180", "2.5", "25"],
    ["TATA ACE_Area 8", "6", "150", "2300", "180", "3", "25"],
    ["TATA ACE_Area 9", "8", "200", "2800", "180", "3.5", "25"]
];

// FIX: Added mock data for LookupCRUD component.
let mockLookupData: string[][] = [
    ["driver_name", "license_number", "phone"],
    ["Ramesh", "TN-01-A-1234", "9876543210"],
    ["Kumar", "TN-02-B-5678", "9876543211"],
];

let memoCounter = trips.length + 2;
let invoiceCounter = invoices.length + 1;

// --- Mock Functions ---

const run = <T,>(functionName: string, ...args: any[]): Promise<T> => {
    console.log(`Mocking function ${functionName} with args:`, args);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let result;
                switch (functionName) {
                    case 'generateNewMemoNumber':
                        result = `SVS-${String(memoCounter).padStart(3, '0')}`;
                        break;
                    case 'populateProductList':
                        result = products;
                        break;
                    case 'saveData':
                        const newTrip = args[0] as Trip;
                        trips.push(newTrip);
                        memoCounter++;
                        result = 'SUCCESS: Trip saved';
                        break;
                    case 'fetchRatesFromSheet':
                        const productName = args[0] as string;
                        result = rates[productName] || { minimumHours: 0, minimumCharges: 0, additionalHourRate: 0 };
                        break;
                    case 'updateCustomerAddresses':
                        const customerName = args[0] as string;
                        result = customers
                            .filter(c => c.customers_name.toLowerCase().includes(customerName.toLowerCase()))
                            .map(c => ({ address1: c.customers_address1, address2: c.customers_address2 }));
                        break;
                    case 'addCustomer':
                         const newCustomer = args[0];
                         customers.push(newCustomer);
                         result = "Customer added successfully.";
                         break;
                    case 'searchTripByMemoNo':
                        const memoNoToSearch = args[0] as string;
                        result = trips.find(t => t.trips_memo_no === memoNoToSearch) || null;
                        break;
                    case 'updateTripRecord':
                        const tripToUpdate = args[0] as Trip;
                        const index = trips.findIndex(t => t.trips_memo_no === tripToUpdate.trips_memo_no);
                        if (index !== -1) {
                            trips[index] = tripToUpdate;
                            result = 'SUCCESS: Trip updated successfully';
                        } else {
                            result = 'ERROR: Trip not found';
                        }
                        break;
                    case 'saveInvoiceData':
                        const newInvoice = args[0] as InvoiceData;
                        invoices.push(newInvoice);
                        invoiceCounter++;
                         result = 'SUCCESS: Invoice saved';
                        break;
                    case 'searchInvoiceByMemoNo':
                         const invoiceMemoNo = args[0] as string;
                         result = invoices.find(i => i.trips_memo_no === invoiceMemoNo) || null;
                         break;
                    // Areas
                    case 'getAreas':
                        result = mockAreas;
                        break;
                    case 'addArea':
                        mockAreas.push(args[0]);
                        result = 'Area added successfully';
                        break;
                    case 'updateArea':
                        const [areaRowIdx, newAreaData] = args;
                        mockAreas[areaRowIdx] = newAreaData;
                        result = 'Area updated successfully';
                        break;
                    case 'deleteArea':
                        const deleteAreaIdx = args[0];
                        mockAreas.splice(deleteAreaIdx, 1);
                        result = 'Area deleted successfully';
                        break;
                    // Calculations
                    case 'getCalculations':
                        result = mockCalculations;
                        break;
                    case 'addCalculationRecord':
                        mockCalculations.push(args[0]);
                        result = "Record added";
                        break;
                    case 'updateCalculationRecord':
                        const [calcRecord, calcIdx] = args;
                        mockCalculations[calcIdx] = calcRecord;
                        result = "Record updated";
                        break;
                    case 'deleteCalculationRecord':
                        mockCalculations.splice(args[0], 1);
                        result = "Record deleted";
                        break;
                    // FIX: Added mock functions for LookupCRUD component.
                    case 'getLookupData':
                        result = mockLookupData;
                        break;
                    case 'addLookupRecord':
                        mockLookupData.push(args[0]);
                        result = "Record added";
                        break;
                    case 'updateLookupRecord':
                        const [lookupRecord, lookupIdx] = args;
                        mockLookupData[lookupIdx] = lookupRecord;
                        result = "Record updated";
                        break;
                    case 'deleteLookupRecord':
                        mockLookupData.splice(args[0], 1);
                        result = "Record deleted";
                        break;
                    case 'getViewAllServicesData':
                         const generatedData: string[][] = [];
                         const calculationMap = new Map<string, string[]>();
                         
                         for (let i = 1; i < mockCalculations.length; i++) {
                             const row = mockCalculations[i];
                             calculationMap.set(row[0], row.slice(1)); 
                         }
         
                         for (const areaRow of mockAreas) {
                             const locationArea = areaRow[0];
                             const locationCategory = areaRow[1];
         
                             for (const vehicleType of VEHICLE_TYPES) {
                                 const lookupKey = `${vehicleType}_${locationCategory}`;
                                 const calcData = calculationMap.get(lookupKey);
         
                                 if (calcData) {
                                      const productItem = `${locationCategory}_${locationArea}_${vehicleType}`.replace(/ /g, '_');
                                      generatedData.push([
                                          locationArea,
                                          locationCategory,
                                          vehicleType,
                                          productItem,
                                          ...calcData.slice(0, 5) 
                                      ]);
                                 }
                             }
                         }
                         result = generatedData;
                        break;
                    default:
                        reject(new Error(`Mock function not found: ${functionName}`));
                        return;
                }
                resolve(result as T);
            } catch (error) {
                reject(error);
            }
        }, MOCK_DELAY);
    });
};

// --- Exported Functions ---

export const generateNewMemoNumber = (): Promise<string> => run('generateNewMemoNumber');
export const populateProductList = (): Promise<string[]> => run('populateProductList');
export const saveData = (trip: Trip): Promise<string> => run('saveData', trip);
export const fetchRatesFromSheet = (productName: string): Promise<Rates> => run('fetchRatesFromSheet', productName);
export const updateCustomerAddresses = (customerName: string): Promise<CustomerAddress[]> => run('updateCustomerAddresses', customerName);
export const addCustomer = (customer: { customers_name: string, customers_address1: string, customers_address2: string }): Promise<string> => run('addCustomer', customer);
export const searchTripByMemoNo = (memoNo: string): Promise<Trip | null> => run('searchTripByMemoNo', memoNo);
export const updateTripRecord = (trip: Trip): Promise<string> => run('updateTripRecord', trip);
export const saveInvoiceData = (invoice: InvoiceData): Promise<string> => run('saveInvoiceData', invoice);
export const searchInvoiceByMemoNo = (memoNo: string): Promise<InvoiceData | null> => run('searchInvoiceByMemoNo', memoNo);
export const getViewAllServicesData = (): Promise<string[][]> => run('getViewAllServicesData');


// Areas
export const getAreas = (): Promise<string[][]> => run('getAreas');
export const addArea = (area: string[]): Promise<string> => run('addArea', area);
export const updateArea = (rowIndex: number, data: string[]): Promise<string> => run('updateArea', rowIndex, data);
export const deleteArea = (rowIndex: number): Promise<string> => run('deleteArea', rowIndex);

// Calculations
export const getCalculations = (): Promise<string[][]> => run('getCalculations');
export const addCalculationRecord = (record: string[]): Promise<string> => run('addCalculationRecord', record);
export const updateCalculationRecord = (record: string[], rowIndex: number): Promise<string> => run('updateCalculationRecord', record, rowIndex);
export const deleteCalculationRecord = (rowIndex: number): Promise<string> => run('deleteCalculationRecord', rowIndex);

// FIX: Added exports for LookupCRUD component functions.
export const getLookupData = (): Promise<string[][]> => run('getLookupData');
export const addLookupRecord = (record: string[]): Promise<string> => run('addLookupRecord', record);
export const updateLookupRecord = (record: string[], rowIndex: number): Promise<string> => run('updateLookupRecord', record, rowIndex);
export const deleteLookupRecord = (rowIndex: number): Promise<string> => run('deleteLookupRecord', rowIndex);
