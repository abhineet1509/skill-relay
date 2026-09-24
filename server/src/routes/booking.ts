import { Router } from 'express';
import { Booking } from '../models/Booking';
import { sendBookingConfirmationEmail } from '../services/emailService';
import { authenticate } from '../middleware/auth';

const router = Router();

// Create new booking
router.post('/book', async (req, res) => {
  try {
    const { customerEmail, customerName, technicianEmail, technicianName, skill, cost, distance } = req.body;
    
    const bookingId = 'SKR-' + Date.now().toString().slice(-6);
    const techEmail = technicianEmail;

    // Save to database
    const booking = new Booking({
      bookingId,
      customerEmail,
      customerName,
      technicianEmail: techEmail,
      technicianName,
      skill: skill || 'General Service',
      cost: cost || 'To be quoted',
      status: 'PENDING'
    });
    await booking.save();

    // Send emails
    const success = await sendBookingConfirmationEmail(
      customerEmail,
      techEmail,
      { customerName, technicianName, skill, cost, distance, bookingId }
    );

    res.status(200).json({ success: true, bookingId, message: 'Booking confirmed and saved.' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get bookings for customer
router.get('/customer/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get bookings for technician
router.get('/technician/:email', async (req, res) => {
  try {
    const bookings = await Booking.find({ technicianEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
