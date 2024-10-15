// src/components/EmployeeList.js
import React, { useState } from "react";
import SalarySlipPopup from "./SalarySlipPopup"; // Adjust the import path based on your project structure

const EmployeeList = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Sample employee data
  const employees = [
    {
      id: 1,
      salonName: "Your Salon Name",
      branchName: "Branch A",
      joiningDate: "01/01/2023",
      employeeName: "X",
      designation: "Stylist",
      totalWorkedDays: 30,
      basicSalary: "50,000",
      hra: "10,000",
      mealAllowance: "2,000",
      totalEarnings: "62,000",
      pfAmount: "2,500",
      ptAmount: "500",
      totalDeductions: "3,000",
      netPay: "59,000",
    },
    {
      id: 2,
      salonName: "Your Salon Name",
      branchName: "Branch B",
      joiningDate: "01/02/2023",
      employeeName: "Y",
      designation: "Hairdresser",
      totalWorkedDays: 30,
      basicSalary: "55,000",
      hra: "12,000",
      mealAllowance: "3,000",
      totalEarnings: "70,000",
      pfAmount: "3,000",
      ptAmount: "600",
      totalDeductions: "3,600",
      netPay: "66,400",
    },
    {
      id: 3,
      salonName: "Your Salon Name",
      branchName: "Branch C",
      joiningDate: "01/03/2023",
      employeeName: "Z",
      designation: "Colorist",
      totalWorkedDays: 30,
      basicSalary: "52,000",
      hra: "11,000",
      mealAllowance: "2,500",
      totalEarnings: "65,500",
      pfAmount: "2,800",
      ptAmount: "550",
      totalDeductions: "3,350",
      netPay: "62,150",
    },
  ];

  const openPopup = (employee) => {
    setSelectedEmployee(employee);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <h1>Employee List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employeeName}</td>
              <td>
                <button onClick={() => openPopup(employee)}>Generate Slip</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && (
        <SalarySlipPopup employee={selectedEmployee} onClose={closePopup} />
      )}
    </div>
  );
};

export default EmployeeList;
