import { BillingInformation, Facility, facilityWbsDetails } from './facility';

describe('Facility', () => {
  it('should create an instance', () => {
    expect(new Facility()).toBeTruthy();
  });

  it('should create an instance for billing information', () => {
    expect(new BillingInformation()).toBeTruthy();
  });

  it('should create an instance for facility wbs details', () => {
    expect(new facilityWbsDetails()).toBeTruthy();
  });
});
