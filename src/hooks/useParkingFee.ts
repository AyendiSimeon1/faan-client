import { useState, useEffect } from 'react';
import { calculateParkingFeeForPeriod, formatCurrency, VehicleType } from '../utils/parkingFeeCalculator';

interface ParkingFeeState {
    fee: number;
    formattedFee: string;
    durationInMinutes: number;
}

/**
 * Hook to calculate and update parking fees in real-time
 * @param vehicleType The type of vehicle
 * @param startDate The start date of the parking session
 * @param updateInterval How often to update the fee (in milliseconds)
 * @returns Current parking fee state
 */
export function useParkingFee(
    vehicleType: VehicleType | string,
    startDate: Date | string,
    updateInterval: number = 60000 // Default to 1 minute updates
): ParkingFeeState {
    const [feeState, setFeeState] = useState<ParkingFeeState>({
        fee: 0,
        formattedFee: '₦0',
        durationInMinutes: 0,
    });

    useEffect(() => {
        function updateFee() {
            try {
                const fee = calculateParkingFeeForPeriod(vehicleType, startDate);
                const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
                const durationInMinutes = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60));

                setFeeState({
                    fee,
                    formattedFee: formatCurrency(fee),
                    durationInMinutes,
                });
            } catch (error) {
                console.error('Error calculating parking fee:', error);
            }
        }

        // Initial calculation
        updateFee();

        // Set up interval for live updates
        const intervalId = setInterval(updateFee, updateInterval);

        // Cleanup
        return () => clearInterval(intervalId);
    }, [vehicleType, startDate, updateInterval]);

    return feeState;
}
