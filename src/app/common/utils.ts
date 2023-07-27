import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const phoneNumValidator = /^\d{3}(-)\d{3}(-)\d{4}$/;
export const emailValidator = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$';
export const npiValidator = /^((?!(0))[0-9]{10})$/;
export const zipValidator = /^\d{5}$/;
export const streetValidator = '^[0-9]+\\s[a-zA-Z0-9\\s]+$';
export const cityValidator = '^[a-zA-Z]+$';
export const nameValidator = '^[a-zA-z]+([\\s][a-zA-Z]+)*$';
export const digitValidator = '^\\d+$';
export const addressValidator = '^[A-Za-z0-9.,#(\\s)(\\-)(\\/)(\\\')]+$';
export const alphaNumericValidator = /^[a-zA-Z0-9]*$/;
export const alphaNumericSpaceValidator = /^[a-zA-Z0-9 ]*$/;
export const webSiteValidator='(^http[s]?:\/{2})|(^www)|(^\/{1,2})';
export const currencyValidator = /^\d{0,8}(\.\d{1,2})?$/;
export const faciliyNamesValidator = /^[a-zA-Z0-9_ ]*$/;
// export const amountValidator=/^[0-9]\d{0,9}(\.[0-9]{1,2})?$/;
export const amountValidator=/^\d{0,10}(\.[0-9]{1,2})?$/;
export const percentageValidator=/^100(\.(0){0,2})?$|^([1-9]?[0-9])(\.(\d{0,2}))?$/;
export const numberValidator =/^\d+$/;
export const alphaNumericSpaceDecimalValidator = /^[a-zA-Z0-9. ]*$/;
export const externalUser = 'External User';

export function createDateValidator(fromDate: Date, toDate: Date): ValidatorFn {
    return (control: AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        if (!value) return null;
        if(!control.dirty) return null;
        
        const date: Date = new Date(value.year, value.month - 1, value.day)
        return date < fromDate || date > toDate ? {date: true} : null;
    }
}

export function getDateRange() {
    const curDate = new Date();
    const monthStart = new Date(curDate.getUTCFullYear(), curDate.getUTCMonth(), 1);
    const monthEnd = new Date(curDate.getUTCFullYear(), curDate.getUTCMonth() + 1, 0);
    
    return {monthStart: monthStart, monthEnd: monthEnd};
}

export function onPhoneFormat(phonenumber: string): string {

    if (phonenumber == null || phonenumber.length === 0) {
        return;
    }

    if (phonenumber.length === 3) {
        phonenumber = phonenumber + '-';
    } else if (phonenumber.length === 7) {
        phonenumber = phonenumber + '-';
    }
    return phonenumber;

}

export function numbersOnly(text: string): boolean {

    let result = true;

    if (text == null || text.length === 0 || text == '') {
        return result;
    }

    for (let char of text) {
        if (isLetter(char)) {
            result = false;
        }
    }

    return result;

}

export function isLetter(char): boolean {

    if (char == null || char.length === 0 || char == '') {
        return;
    }

    return char.toLowerCase() != char.toUpperCase();

}


export function getAdvocacyPerms(): boolean {
  return !localStorage.getItem('currentUserRole').includes(externalUser);
}
