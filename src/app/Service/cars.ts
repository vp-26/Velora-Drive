export interface APIResposnemodel {
  message: string;
  result: boolean;
  data: any;
}


export interface Car {
  carId: number;
  brandId: number;
  modelId: number;
  name: string;
  carNumber?: string;
  doors?: number;
  passengers?: number;
  transmission?: string;
  airCondition?: boolean;
  petrolVehicle?: boolean;
  sunroof?: boolean;
  hasInsurance?: boolean;
  rentalPricing?: { rentalCost: number };
  brandName?: string;
  modelName?: string;
}
