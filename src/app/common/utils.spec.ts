import { AbstractControl, FormControl, Validators } from '@angular/forms';
import * as utils from './utils'; 

describe('Utils', () => {
  it('[onPhoneFormat] should return undefined when phonenum is null/empty', () => {
     const res = utils.onPhoneFormat('');
    expect(res).toBeUndefined(); 
    
    expect(utils.onPhoneFormat(null)).toBeUndefined();
  });

  it('[onPhoneFormat] should format when phonenum length is 3', () => {
    const res = utils.onPhoneFormat('123');
    expect(res).toEqual('123-'); 
 });

 it('[onPhoneFormat] should format when phonenum length is 7', () => {
    const res = utils.onPhoneFormat('1234567');
    expect(res).toEqual('1234567-'); 
 });

 it('[onPhoneFormat] should format when phonenum length is not 7', () => {
   const res = utils.onPhoneFormat('12345678');
   expect(res).not.toEqual('1234567-'); 
});

it('[onPhoneFormat] should format when phonenum length is not 3', () => {
   const res = utils.onPhoneFormat('12345');
   expect(res).not.toEqual('123'); 
});

 it('[numbersOnly] should check if a give string is a number', () => {
    const res = utils.numbersOnly('1234567');
   expect(res).toBeTrue();  
 });
 
 it('[numbersOnly] should be false when input is not a number', () => {
    const res = utils.numbersOnly('123abc');
   expect(res).toBeFalse();  
 });
 
 it('[numbersOnly] should return true if the input is null/empty', () => {
    expect(utils.numbersOnly('')).toBeTrue(); 
 });

 it('[isLetter] should check if a give char is a letter', () => {
    const res = utils.isLetter('a');
   expect(res).toBeTrue();  
 });
 
 it('[isLetter] should be false when char is not a letter', () => {
    const res = utils.isLetter('1');
   expect(res).toBeFalse();  
 });
 
 it('[isLetter] should return undefined if the input is null/empty', () => {
    expect(utils.isLetter    ('')).toBeUndefined(); 
 });

  it('showNotesOnAppointment - return true when the  user role is not external user ', () => {
    spyOn(localStorage, 'getItem').and.returnValue("superuser");
    expect(utils.getAdvocacyPerms    ()).toBeTrue();
  });

  it('showNotesOnAppointment - return false when the  user role is external user ', () => {
    spyOn(localStorage, 'getItem').and.returnValue("External User");
    expect(utils.getAdvocacyPerms    ()).toBeFalse();
  });

  it('should get date range of current month', () => {
   let range = utils.getDateRange();
   const date = new Date();
   expect(date.getUTCFullYear()).toEqual(range["monthStart"].getUTCFullYear());
   expect(date.getUTCFullYear()).toEqual(range["monthEnd"].getUTCFullYear());
   expect(date.getUTCMonth()).toEqual(range["monthStart"].getUTCMonth());
   expect(date.getUTCMonth()).toEqual(range["monthEnd"].getUTCMonth());
  });

  it('should create date validator', () => {
   //January 1st to 31st
   const startDate = new Date(2023, 0, 1);
   const endDate = new Date(2023, 0, 31);

   let control : AbstractControl = new FormControl(null, [utils.createDateValidator(startDate, endDate)]);

   //Empty Field
   control.updateValueAndValidity();
   expect(control.hasError('date')).toBeFalsy();

   //Date within range
   control.patchValue({year: 2023, month: 1, day: 1});
   control.markAsDirty();
   control.updateValueAndValidity();
   expect(control.hasError('date')).toBeFalsy();

   //Date out of range
   control.patchValue({year: 2023, month: 10, day: 10});
   control.markAsDirty();
   control.updateValueAndValidity();
   expect(control.hasError('date')).toBeTruthy();
  });
});
