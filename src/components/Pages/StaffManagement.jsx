import React, { useEffect, useState } from 'react';
// import AddStaffModal from './AddStaffModal';
import AttendancePopup from './AttendancePopup';
// import SalarySlipPopup from './SalarySlipPopup';
import "../Styles/StaffManagement.css";
import config from '../../config';
import toast, { Toaster } from 'react-hot-toast';
import VertNav from './VertNav';
import Header from './Header';

const StaffManagement = () => {
  const [showAttendance, setShowAttendance] = useState(false);
  const [showSalarySlip, setShowSalarySlip] = useState(false);
  const [currentStaffId, setCurrentStaffId] = useState(null);
  const [staffData, setStaffData] = useState([]);

  const getDaysInMonth = (month, year) => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  
    if (isLeapYear && month === 1) {
      return 29;
    }
  
    return daysInMonth[month];
  };
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const bid = localStorage.getItem('branch_id');
        try {
          const response = await fetch(`${config.apiUrl}/api/swalook/staff/?branch_name=${bid}`, {
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          console.log("API Response:", data); 

          const attendanceResponse = await fetch(`${config.apiUrl}/api/swalook/staff/attendance/?branch_name=${bid}`,{
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if(!attendanceResponse.ok) throw new Error('Failed to fetch attendance');
          const attendanceData = await attendanceResponse.json();
          console.log("Attendance Response:", attendanceData);
      
          const staffArray = Array.isArray(data.table_data) ? data.table_data : [];
          const attendanceTable = attendanceData.table_data || {};
      
          if (staffArray.length === 0) {
            console.warn("No staff data found in table_date.");
          }
          const formattedData = staffArray.map(staff => ({
            id: staff.id || staff.staff_id || null,
            name: staff.staff_name || 'N/A',
            role: staff.staff_role || 'N/A',
            mobile: staff.mobile_no || 'N/A', 
            salary: parseFloat(staff.staff_salary_monthly) || 0,
            commission: parseFloat(staff.staff_commision_cap) || 0, 
            joiningDate: staff.staff_joining_date || 'N/A',  
            attendance: {
              present: attendanceTable[staff.mobile_no] || 0,
              total: getDaysInMonth(currentMonth,currentYear),
            },
            business: parseFloat(staff.business_of_the_current_month) || 0 
          }));
      
          console.log("Formatted Staff Data:", attendanceTable); 
          setStaffData(formattedData);
        } catch (error) {
          console.error('Error:', error);
          setStaffData([]);
        }
      };
      
    fetchData();
  }, []); 

  
  // const handleAttendanceMarked = (staffId) => {
  //   setStaffData((prevData) =>
  //     prevData.map((staff) => {
  //       if (staff.id === staffId) {
  //         if (staff.attendanceMarkedToday) {
  //           toast.custom(<div className='toaster_icon'>Attendence already marked!</div>);
  //           return staff;
  //         }
  //         const newAttendance = {
  //           ...staff.attendance,
  //           present: staff.attendance.present + 1
  //         };
  //         return { ...staff, attendance: newAttendance, attendanceMarkedToday: true };
  //       }
  //       return staff;
  //     })
  //   );
  // };
  const handleAttendanceMarked = async (staffId) => {
    setStaffData((prevData) =>
      prevData.map((staff) => {
        if (staff.id === staffId) {
          // Check if attendance is already marked today
          if (staff.attendanceMarkedToday) {
            toast.custom(<div className='toaster_icon'>Attendance already marked!</div>);
            return staff;
          }
          // Set attendanceMarkedToday to true
          return { ...staff, attendanceMarkedToday: true };
        }
        return staff;
      })
    );
  };
  

    
    
  

    return (
      <>
      <Header />
                <div className="update">

          <VertNav />
        <div className="staff-management-container">
          <Toaster />
          <h1 className="staff-title">Staff Attendance:</h1>
         
          <div className="table_responsive">
          <table className="staff-table">
            <thead>
              <tr>
                <th>SNo.</th>
                <th>Staff Name</th>
                <th>Staff Role</th>
                <th>Attendance MTD</th>
                <th>Joining Date</th>
                <th>Mark Attendance</th>
                {/* <th>Salary Slip</th> */}
              </tr>
            </thead>
            <tbody className='salary'>
              {staffData.map((staff, index) => (
                <tr key={staff.id}>
                  <td>{index + 1}</td>
                  <td>{staff.name}</td>
                  <td>{staff.role}</td>
                  <td>{`${staff.attendance.present.number_of_days_present}/${staff.attendance.total}`}</td>
                  <td>{staff.joiningDate}</td>
                  <td className='button-container'>
                    <button
                      className="attendance-button"
                      onClick={() => {
                        setShowAttendance(true);
                        setCurrentStaffId(staff.id); 
                      }}
                    >
                      Mark 
                    </button>
                  </td>
                  {/* <td className='button-container'>
                    <button
                      className="salary-slip-button"
                      onClick={() => setShowSalarySlip(true)}
                    >
                      View 
                    </button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          {showAttendance && (
            <AttendancePopup 
              onClose={() => setShowAttendance(false)} 
              onAttendanceMarked={handleAttendanceMarked}
              staffId={currentStaffId} 
            />
          )}
          {/* {showSalarySlip && <SalarySlipPopup onClose={() => setShowSalarySlip(false)} />} */}
          </div>
        </div>
      </>
    );
  };

export default StaffManagement;
