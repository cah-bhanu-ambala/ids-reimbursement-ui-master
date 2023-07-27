import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateCustomParserFormatter } from "./ngbDateCustomParserFormatter";

describe('NgbDateCustomParserFormatter', () => {
    let formatter: NgbDateCustomParserFormatter;
    let date: NgbDateStruct;

    beforeEach(() => {
        formatter = new NgbDateCustomParserFormatter();
    });

    afterEach(() => {
        formatter = null;
    })
    
    
    it('should create an Instance', () => {
        expect(new NgbDateCustomParserFormatter()).toBeTruthy();
    });

    it('parse value case 1: with right day format', () => {
        let value = '03/01/2022';
        formatter.parse(value);
        expect(formatter.parse).toBeTruthy;
    });

    it('parse value case 2: with wrong day format', () => {
        let value = '03-01-2022';
        formatter.parse(value);
        expect(formatter.parse).toBeFalsy;
    });

    it('parse value case 3: with null day format', () => {
        let value = null;
        formatter.parse(value);
        expect(formatter.parse).toBeFalsy;
    });

    it('parse value case 4: with right day and month only format', () => {
        let value = '03/01';
        formatter.parse(value);
        expect(formatter.parse).toBeTruthy;
    });

    it('format date value case 1: with right day format', () => {
        date = {month:10,day:12, year:2020}
        formatter.format(date);
        expect(formatter.format).toBeTruthy();
    });

    it('format date value case 1: with right day format', () => {
        date = {month:null, day: null, year:null};
        formatter.format(date);
        expect(formatter.format).toBeTruthy();
    })
});