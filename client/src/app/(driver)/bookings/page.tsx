'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchBookings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

      // Add this after other useEffect hooks
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (activeDropdown && !event.target.closest('.dropdown-container')) {
            setActiveDropdown(null);
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, [activeDropdown]);
  


  const handleBookingStatus =async (bookingId, status) => {
    const response =await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/booking/${bookingId}/status`, {status})
    if(response.statusText == 'OK'){
        fetchBookings()
    }
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff9e6'
      }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  }
    // Add this with other state declarations



  return (
    <div style={{ 
      backgroundColor: '#fff9e6', 
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '40px'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem',
          fontWeight: 'bold',
          color: '#1a1a1a',
          marginBottom: '30px',
          textTransform: 'uppercase',
          letterSpacing: '3px'
        }}>
          BOOKINGS
        </h1>
        
        {/* Search Bar */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative'
        }}>
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 25px',
              fontSize: '1.1rem',
              border: '2px solid #FFD700',
              borderRadius: '30px',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Bookings Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
        gap: '25px',
        padding: '20px'
      }}>
  {bookings.map((booking) => (
  <div
    key={booking._id}
    style={{
      border: 'none',
      borderRadius: '15px',
      padding: '25px',
      backgroundColor: 'white',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
      ':hover': {
        transform: 'translateY(-5px)'
      }
    }}
  >
    {/* Status Badge */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
     
      <div style={{ display: 'flex', gap: '8px' }}>
  

        {/* Status Badge */}
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
}}>
  <h2 style={{ 
    fontSize: '1.2rem', 
    fontWeight: 'bold',
    color: '#1a1a1a'
  }}>
    Booking #{booking._id.slice(-6)}
  </h2>
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <span style={{
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      backgroundColor: booking.status === 'confirmed' ? '#e6ffe6' : '#ffe6e6',
      color: booking.status === 'confirmed' ? '#006600' : '#cc0000'
    }}>
      {booking.status}
    </span>
    <span style={{
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      backgroundColor: booking.paymentStatus === 'paid' ? '#e6ffe6' : '#fff3e6',
      color: booking.paymentStatus === 'paid' ? '#006600' : '#cc7700'
    }}>
      {booking.paymentStatus}
    </span>
    
    {/* Dropdown Menu */}
    <div className="dropdown-container" style={{ position: 'relative' }}>
      <button
        onClick={() => setActiveDropdown(activeDropdown === booking._id ? null : booking._id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '5px',
          fontSize: '24px',
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '8px'
        }}
      >
        ⋮
      </button>
      
      {activeDropdown === booking._id && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '150px'
          }}
        >
          <button
            onClick={() => {
            handleBookingStatus(booking._id, 'confirmed');
              setActiveDropdown(null);
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 15px',
              textAlign: 'left',
              border: 'none',
              borderBottom: '1px solid #eee',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#006600',
              fontSize: '0.9rem'
            }}
          >
            ✓ Accept
          </button>
          <button
            onClick={() => {
              handleBookingStatus(booking._id, 'cancelled');
              setActiveDropdown(null);
            }}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 15px',
              textAlign: 'left',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#cc0000',
              fontSize: '0.9rem'
            }}
          >
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  </div>
</div>
      </div>
    </div>

    User : {booking.userId?.email || 'N/A'} <br />

    {/* Booking Details */}
    <div style={{ 
      display: 'grid', 
      gap: '12px',
      color: '#4a4a4a'
    }}>
      <DetailRow 
        label="From" 
        value={booking.pickupStop?.stopName} 
        icon="🚏" 
      />
      <DetailRow 
        label="To" 
        value={booking.dropStop?.stopName} 
        icon="🏁" 
      />
      <DetailRow 
        label="Seats" 
        value={booking.seats?.length ? booking.seats.join(', ') : 'No seats selected'} 
        icon="💺" 
      />
      <DetailRow 
        label="Created" 
        value={new Date(booking.createdAt).toLocaleDateString()} 
        icon="📅" 
      />
      <DetailRow 
        label="Updated" 
        value={new Date(booking.updatedAt).toLocaleDateString()} 
        icon="🕒" 
      />
    </div>
  </div>
))}
      </div>
    </div>
  );
};

// Helper component for consistent detail rows
const DetailRow = ({ label, value, icon, highlight }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem'
  }}>
    <span>{icon}</span>
    <span style={{ fontWeight: '500' }}>{label}:</span>
    <span style={{
      marginLeft: 'auto',
      color: highlight ? '#FFD700' : 'inherit',
      fontWeight: highlight ? 'bold' : 'normal'
    }}>
      {value || 'N/A'}
    </span>
  </div>
);

export default BookingsPage;