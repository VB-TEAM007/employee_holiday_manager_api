export class EmployeeDto {
  id: any;
  name: string;
  remainingHolidays: number;
  role: string;

  constructor(model: any) {
    this.id = model._id;
    this.name = model.name;
    this.remainingHolidays = model.remainingHolidays;
    this.role = model.role;
  }
}
