export class RequestUpdateDto {
  startDate: Date;
  endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
