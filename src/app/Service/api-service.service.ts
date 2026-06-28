import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIResposnemodel } from './cars';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getAllCars(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/getAllCars');
  }

  getCarsByBrandId(brandId: number) {
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/getCarsByBrandId/' + brandId);
  }

  getCarsByModelId(modelId: number) {
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/getCarsByBrandId/' + modelId);
  }

  getAllCarsByLocation(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/getCarsByLocation/' + X);
  }

  searchCarByLocation(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/searchCarsByLocation/' + X);
  }

  getCarById(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/getCarById/' + X);
  }

  addNewCar(X :any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/addCar' ,X);
  }

  updateCar(X :any){
    return this.http.put<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/updateCar' ,X);
  }

  deleteCarById(X:number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/cars/deleteCar/' + X);
  }

  addBulkLocations(X:any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/location/addBulkLocations' ,X)
  }

  deleteLocationById(X:number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/location/deleteLocationById/' + X);
  }

  getAllUsers(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/users/getAllUsers');
  }

  getUserByUserId(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/users/getUser/' +X);
  }

  login(X:any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/users/login' ,X)
  }

  addNewUser(X:any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/users/register' ,X)
  }

  updateUser(X :any){
    return this.http.put<APIResposnemodel>('http://localhost:3000/api/car-rent/users/update' ,X);
  }

  deleteUserByUserId(X :number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/users/delete/' +X);
  }

  getAllBookings(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/getAllBookings');
  }

  getAllBookingsByCarId(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/getAllBookingsByCarId/' +X);
  }

  getAllBookingsByCustomerId(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/getBookingsByCustomerId/' +X);
  }

  getBookingById(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/getBookingById/' +X);
  }

  createNewBooking(X :any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/createNewBooking' ,X);
  }

  updateBooking(X :any){
    return this.http.put<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/updateBooking' ,X);
  }

  deleteBookingById(X:number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/booking/deleteBookingById/' + X);
  }

  addCarModel(X :any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/car-model/addModel' ,X);
  }

  getAllCarModels(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/car-model/getAllModels');
  }

  getModelByModelId(X:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/car-model/getModelById/' +X);
  }  

  getModelsByBrandId(brandId:number){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/car-model/getModelsByBrand/' +brandId);
  }  

  deleteCarModelById(X:number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/car-model/deleteModel/' + X);
  }

  addCarBrand(X :any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/brands/addBrand' ,X);
  }

  getAllBrands(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/brands/getAllBrands');
  }
  
  deleteBrandById(X:number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/brands/deleteBrand/' + X);
  }

  getBrandByBrandId(X:number){
    return this.http.delete<APIResposnemodel>('http://localhost:3000/api/car-rent/brands/getbrandsBybrandId/' + X);
  }
  
  getAllCarTypes(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/cartypes/getAllTypes');
  }

  createOrder(amount: any) {
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/razorpay/create-order' , { amount });
  }

  verifyPayment(data: { order_id: string; payment_id: string; signature: string,email:string }) {
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/razorpay/verify-payment' , data);
  }

  getUserByEmail(email: string){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/users/email/' +email)
  }
  
  sendOtp(email: string){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/forgot/send-otp',{ email });
  }

  verifyOtp(email: string, otp: string){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/forgot/verify-otp',{ email, otp });
  }

  resetPassword(email: string, newPassword: string){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/forgot/reset-password',{ email, newPassword });
  }

  createEnquiry(data:any){
    return this.http.post<APIResposnemodel>('http://localhost:3000/api/car-rent/enquiries/createEnquiry', data)
  }

  getEnquiries(){
    return this.http.get<APIResposnemodel>('http://localhost:3000/api/car-rent/enquiries/getallEnquiries');
  }
}