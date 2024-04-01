export class RequestDto {
  employeeName: string;
  startDate: Date;
  endDate: Date;
  status: string;

  constructor(model: any) {
    this.employeeName = model.employee.name;
    this.startDate = model.startDate;
    this.endDate = model.endDate;
    this.status = model.status;
  }
}