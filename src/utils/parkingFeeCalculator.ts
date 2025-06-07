/**
 * Airport Parking Fee Calculator
 * Based on Murtala Muhammed Airport Two parking tariff
 */

export const VEHICLE_TYPES = {
    SUV_BUS: 'suv_bus',
    REGULAR: 'regular',
    LARGE_BUS: 'large_bus'
} as const;

export type VehicleType = keyof typeof VEHICLE_TYPES;

export function calculateParkingFee(vehicleType: string, timeInMinutes: number): number {
    // Convert minutes to hours for easier calculation
    const totalHours = Math.ceil(timeInMinutes / 60);
    
    // Validate inputs
    if (!vehicleType || timeInMinutes <= 0) {
        throw new Error('Invalid vehicle type or time');
    }
    
    let totalFee = 0;
    
    // Check for overnight parking (after 12 midnight)
    if (totalHours > 12) {
        return 5000; // Flat overnight rate
    }
    
    switch (vehicleType.toLowerCase()) {
        case VEHICLE_TYPES.SUV_BUS:
            totalFee = calculateSUVBusFee(timeInMinutes);
            break;
            
        case VEHICLE_TYPES.REGULAR:
            totalFee = calculateRegularVehicleFee(timeInMinutes);
            break;
            
        case VEHICLE_TYPES.LARGE_BUS:
            return 5000; // Flat rate for large buses (18+ seater)
            
        default:
            throw new Error('Invalid vehicle type. Use: suv_bus, regular, or large_bus');
    }
    
    return totalFee;
}

function calculateSUVBusFee(timeInMinutes: number): number {
    let fee = 0;
    
    // First hour: ₦1,500
    if (timeInMinutes <= 60) {
        return 1500;
    }
    
    fee += 1500; // First hour
    let remainingMinutes = timeInMinutes - 60;
    
    // Subsequent 30-minute periods until 4th hour: ₦100 per 30 minutes
    const thirtyMinutePeriods = Math.min(Math.ceil(remainingMinutes / 30), 6);
    
    if (remainingMinutes <= 180) { // Within hours 2-4
        fee += thirtyMinutePeriods * 100;
        return fee;
    }
    
    fee += 6 * 100; // Full charge for hours 2-4
    remainingMinutes -= 180;
    
    // 5th hour onwards: ₦500 per hour
    const additionalHours = Math.ceil(remainingMinutes / 60);
    fee += additionalHours * 500;
    
    return fee;
}

function calculateRegularVehicleFee(timeInMinutes: number): number {
    let fee = 0;
    
    // First 60 minutes: ₦1,000
    if (timeInMinutes <= 60) {
        return 1000;
    }
    
    fee += 1000; // First hour
    let remainingMinutes = timeInMinutes - 60;
    
    // Subsequent 30-minute periods until 4th hour: ₦100 per 30 minutes
    const thirtyMinutePeriods = Math.min(Math.ceil(remainingMinutes / 30), 6);
    
    if (remainingMinutes <= 180) { // Within hours 2-4
        fee += thirtyMinutePeriods * 100;
        return fee;
    }
    
    fee += 6 * 100; // Full charge for hours 2-4
    remainingMinutes -= 180;
    
    // 5th hour onwards: ₦500 per hour
    const additionalHours = Math.ceil(remainingMinutes / 60);
    fee += additionalHours * 500;
    
    return fee;
}

/**
 * Calculate the duration in minutes between two dates
 * @param startDate Start date
 * @param endDate End date (defaults to current time)
 * @returns Duration in minutes
 */
export function calculateDurationInMinutes(startDate: Date | string, endDate: Date = new Date()): number {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    return Math.max(0, Math.floor((endDate.getTime() - start.getTime()) / (1000 * 60)));
}

/**
 * Calculate parking fee for a time period
 * @param vehicleType Type of vehicle
 * @param startDate Start date of parking
 * @param endDate End date (optional, defaults to current time)
 * @returns Total parking fee
 */
export function calculateParkingFeeForPeriod(
    vehicleType: VehicleType | string,
    startDate: Date | string,
    endDate?: Date
): number {
    const durationInMinutes = calculateDurationInMinutes(startDate, endDate);
    return calculateParkingFee(vehicleType, durationInMinutes);
}

export function formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
}
