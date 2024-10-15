import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import '../Styles/Attendance.css'; 
import config from "../../config";

const AttendancePopup = ({ onClose, onAttendanceMarked, staffId }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Fetch attendance data
  const fetchAttendance = async () => {
    const token = localStorage.getItem('token');
    const bid = localStorage.getItem('branch_id');
  
    try {
      const response = await fetch(`${config.apiUrl}/api/swalook/staff/attendance/?branch_name=${bid}&staff_id=${staffId}&month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
  
      if (response.ok) {
        const attendanceResponse = await response.json();
        console.log("Fetched attendance data:", attendanceResponse);
  
        const attendanceData = attendanceResponse.table_data;
  
        // Check if table_data contains the staff data keyed by their mobile number
        for (const mobileNumber in attendanceData) {
          const staffData = attendanceData[mobileNumber];
  
          // Match the staff ID with the provided ID
          if (staffData.id === staffId) {
            console.log("Staff ID matched!");
  
            const newMarkedDates = {};
  
            // Mark present dates with "P"
            if (staffData?.present_dates?.length > 0) {
              staffData.present_dates.forEach((entry) => {
                const date = new Date(entry.date).toDateString();
                newMarkedDates[date] = "P"; // Mark as "Present"
              });
            }
  
            // Mark absent/leave dates with "A"
            if (staffData?.leave_dates?.length > 0) {
              staffData.leave_dates.forEach((entry) => {
                const date = new Date(entry.date).toDateString();
                newMarkedDates[date] = "A"; // Mark as "Absent"
              });
            }
  
            // Set marked dates in the state
            setMarkedDates(newMarkedDates);
            setLoading(false); // Stop loading once data is fetched
            break;
          } else {
            console.log("Staff ID did not match for this mobile number.");
          }
        }
      } else {
        setError('Failed to fetch attendance.');
        setLoading(false);
      }
    } catch (error) {
      setError('Error while fetching attendance.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAttendance(); // Fetch attendance when the component mounts
  }, []);

  // Handle date click (mark or unmark attendance)
  const handleDateClick = (date) => {
    const dateString = date.toDateString();
    
    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear && date <= today) {
      setMarkedDates((prev) => ({
        ...prev,
        [dateString]: prev[dateString] === "P" ? "A" : "P",
      }));
    } else {
      console.log("Cannot modify past attendance.");
    }
  };

  // Save attendance data
  const saveAttendance = async () => {
    const attendanceData = Object.keys(markedDates).map((dateString) => ({
      of_month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      attend: markedDates[dateString] === "P",
      leave: markedDates[dateString] === "A",
      date: dateString,
      id: staffId,
    }));

    const token = localStorage.getItem('token');
    const bid = localStorage.getItem('branch_id');

    try {
      const response = await fetch(`${config.apiUrl}/api/swalook/staff/attendance/?branch_name=${bid}&staff_id=${staffId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ json_data: attendanceData }),
      });

      if (response.ok) {
        console.log('Attendance marked successfully');
        onAttendanceMarked(staffId, attendanceData);
        onClose();
      } else {
        console.error('Failed to mark attendance:', response.statusText);
      }
    } catch (error) {
      console.error('Error while marking attendance:', error);
    }
  };

  // Render calendar date content
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const status = markedDates[date.toDateString()];
      return status === "P" ? <span className="attendance-present">✔️</span> :
             status === "A" ? <span className="attendance-absent">❌</span> :
             null;
    }
    return null;
  };

  const tileDisabled = ({ date }) => {
    return date.getMonth() !== currentMonth || date.getFullYear() !== currentYear;
  };

  return (
    <div className="attendance-popup-overlay">
      <div className="attendance-popup-container">
        <h2 className="attendance-popup-title">Attendance</h2>
        {loading ? (
          <p>Loading attendance...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Calendar
            onClickDay={handleDateClick}
            tileContent={tileContent}
            tileDisabled={tileDisabled}
            maxDate={today}
            className="custom-calendar"
          />
        )}
        <div className="attendance-popup-footer">
          <button className="attendance-save-button" onClick={saveAttendance}>
            Save 
          </button>
          <button className="attendance-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePopup;
