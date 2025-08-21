import React, { useState } from 'react';
import styles from './TechXperience.module.css';

const ResonanceForm = ({ onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    campus: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Add actual submission logic here
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formModal}>
        <button className={styles.formClose} onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-[#a259ff]">Resonance Registration</h2>
        {submitted ? (
          <div className="text-green-600 font-semibold text-center py-8">Thank you for registering!</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className={styles.formLabel} htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
            <label className={styles.formLabel} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
            <label className={styles.formLabel} htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
            <label className={styles.formLabel} htmlFor="campus">Campus</label>
            <select
              id="campus"
              name="campus"
              value={form.campus}
              onChange={handleChange}
              required
              className={styles.formInput}
            >
              <option value="">Select Campus</option>
              <option value="SOA Campus 2">SOA Campus 2</option>
              <option value="SOA Campus 4">SOA Campus 4</option>
            </select>
            <label className={styles.formLabel} htmlFor="message">Message (optional)</label>
            <textarea
              id="message"
              name="message"
              placeholder="Message (optional)"
              value={form.message}
              onChange={handleChange}
              className={styles.formInput}
              rows={3}
            />
            <button type="submit" className={styles.formButton}>Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResonanceForm;
