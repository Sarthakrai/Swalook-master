import React, { useState } from 'react';
import '../Styles/AddStaffModal.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import config from '../../config';

const AddStaffModal = ({ onClose, onAddStaff }) => {
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffSalary, setStaffSalary] = useState('');
  const [base, setBase] = useState('');
  const [houseRentAllowance, setHouseRentAllowance] = useState('');
  const [incentivePay, setIncentivePay] = useState('');
  const [mealAllowance, setMealAllowance] = useState('');
  const [providentFund, setProvidentFund] = useState('');
  const [professionalTax, setProfessionalTax] = useState('');
  const [staffSlab, setStaffSlab] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [staffMobile, setStaffMobile] = useState('');
  const [date, setDate] = useState('');

  const handleAddStaff = async () => {
    if (!staffName || !staffRole || !staffSalary || !base) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const newStaff = {
    staff_name: staffName,
    staff_role: staffRole,
    mobile_no: staffMobile || '',
    staff_salary_monthly: staffSalary,
    base: base ? Number(base) : 0,
    house_rent_allownance: houseRentAllowance ? Number(houseRentAllowance) : 0,
    incentive_pay: incentivePay ? Number(incentivePay) : 0,
    meal_allowance: mealAllowance ? parseFloat(mealAllowance) : 0,
    staff_provident_fund: providentFund ? parseFloat(providentFund) : 0,
    staff_professional_tax: professionalTax ? parseFloat(professionalTax) : 0,
    staff_slab: staffSlab || 0,
    // date: date || 2024-12-20,
    staff_joining_date: joiningDate,
    };
    try{
      const token = localStorage.getItem('token');
      const bid = localStorage.getItem('branch_id');
      const res = {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await axios.post(`${config.apiUrl}/api/swalook/staff/?branch_name=${bid}`,
        newStaff,
        res
      )
      console.log("staff added successfully", response.data);
      toast.success("staff added successfully");
      onAddStaff(newStaff);
      onClose();
    } catch(error){
      console.error("Error adding staff", error);
      toast.error('Failed to add staff');
    }

   
  };

  return (
    <div className="add-staff-modal-overlay">
      <Toaster/>
      <div className="add-staff-modal-container">
        <h2 className="add-staff-modal-title">Add Staff</h2>
        <form className="add-staff-form">
          <label>
            Staff Name <span className="required">*</span>
            <input
              type="text"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              required
            />
          </label>
          <label>
            Staff Role <span className="required">*</span>
            <input
              type="text"
              value={staffRole}
              onChange={(e) => setStaffRole(e.target.value)}
              required
            />
          </label>
          <label>
            Staff Mobile No. <span className="required">*</span>
            <input
              type="number"
              value={staffMobile}
              onChange={(e) => setStaffMobile(e.target.value)}
              required
            />
          </label>
          <label>
            Staff Salary <span className="required">*</span>
            <input
              type="text"
              value={staffSalary}
              onChange={(e) => setStaffSalary(e.target.value)}
              required
            />
          </label>

          <h3 className="section-title">Earnings</h3>
          <label>
            Basic Salary (%) <span className="required">*</span>
            <input
              type="number"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              required
            />
          </label>
          <label>
            House Rent Allowance (HRA) (%)
            <input
              type="number"
              value={houseRentAllowance}
              onChange={(e) => setHouseRentAllowance(e.target.value)}
            />
          </label>
          <label>
            Incentive Pay (%)
            <input
              type="number"
              value={incentivePay}
              onChange={(e) => setIncentivePay(e.target.value)}
            />
          </label>
          <label>
            Meal Allowance (Decimal)
            <input
              type="number"
              step="0.01"
              value={mealAllowance}
              onChange={(e) => setMealAllowance(e.target.value)}
            />
          </label>

          {/* Deductions Section */}
          <h3 className="section-title">Deductions</h3>
          <label>
            Provident Fund (Decimal)
            <input
              type="number"
              step="0.01"
              value={providentFund}
              onChange={(e) => setProvidentFund(e.target.value)}
            />
          </label>
          <label>
            Professional Tax (Decimal)
            <input
              type="number"
              step="0.01"
              value={professionalTax}
              onChange={(e) => setProfessionalTax(e.target.value)}
            />
          </label>
          {/* <label>
            Staff Commission Slab <span className="required"></span>
            <input
              type="number"
              value={staffSlab}
              onChange={(e) => setStaffSlab(e.target.value)}
            />
          </label> */}

          <label>
            Joining Date <span className="required">*</span>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              required
            />
          </label>

          <div className="add-staff-button-group">
            <button
              type="button"
              className="add-staff-submit-button"
              onClick={handleAddStaff}
            >
              Add Staff
            </button>
            <button
              type="button"
              className="add-staff-cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
