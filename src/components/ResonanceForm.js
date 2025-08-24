import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import pb from '../lib/pocketbase';
import styles from './TechXperience.module.css';


const ResonanceForm = ({ onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('student');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Check for duplicate email in PocketBase
      const existing = await pb.collection('iecReg').getList(1, 1, { filter: `email="${data.email}"` });
      if (existing.items.length > 0) {
        alert("This email is already registered.");
        setLoading(false);
        return;
      }

      // Generate unique token
      const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 16);

      // Prepare form data for PocketBase, including token and mailSent: false
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "idCard" && value && value[0]) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });
      formData.append('qr_token', token);
      formData.append('mailSent', 'false');
      const record = await pb.collection('iecReg').create(formData);

      const verificationUrl = `https://yourdomain.com/verify?token=${token}`;

      // Use BACKEND_URL from environment variables
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
      let emailSuccess = false;
      try {
        const res = await fetch(`${backendUrl}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: data.email, name: data.name, token })
        });
        if (res.ok) {
          emailSuccess = true;
        }
      } catch (emailErr) {
        console.error("Email error:", emailErr);
      }

      // If email sent successfully, update mailSent to true
      if (emailSuccess && record && record.id) {
        await pb.collection('iecReg').update(record.id, { mailSent: true });
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      alert("Error submitting registration: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formModal}>
  <button className={styles.formClose} onClick={onClose} aria-label="Close">&times;</button>
  <h2 className="text-2xl font-extrabold mb-4 text-center text-[#4b2aad] tracking-tight">Registration</h2>
        {submitted ? (
          <div className={styles.formSuccess}>Thank you for registering!</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            {/* User Type Radio */}
            <div className="flex gap-6 mb-2">
              <label className={styles.formLabel} style={{marginBottom:0}}>
                <input
                  type="radio"
                  value="student"
                  checked={userType === 'student'}
                  onChange={() => setUserType('student')}
                  {...register("userType")}
                  style={{marginRight:'0.5em'}}
                /> Student
              </label>
              <label className={styles.formLabel} style={{marginBottom:0}}>
                <input
                  type="radio"
                  value="faculty"
                  checked={userType === 'faculty'}
                  onChange={() => setUserType('faculty')}
                  {...register("userType")}
                  style={{marginRight:'0.5em'}}
                /> Faculty
              </label>
            </div>

            {/* Common fields */}
            <label className={styles.formLabel} htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              {...register("name", { required: true })}
              placeholder="Full Name"
              className={styles.formInput}
            />
            {errors.name && <span className="text-red-500 text-xs">Name is required</span>}

            <label className={styles.formLabel} htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", { required: true })}
              placeholder="Email"
              className={styles.formInput}
            />
            {errors.email && <span className="text-red-500 text-xs">Email is required</span>}

            <label className={styles.formLabel} htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              {...register("phone", { required: true })}
              placeholder="Phone Number"
              className={styles.formInput}
            />
            {errors.phone && <span className="text-red-500 text-xs">Phone Number is required</span>}

            <label className={styles.formLabel} htmlFor="idCard">Upload Image/College ID</label>
            <input
              type="file"
              id="idCard"
              accept="image/*,.pdf"
              {...register("idCard", { required: true })}
              className={styles.formInput}
            />
            {errors.idCard && <span className="text-red-500 text-xs">ID/College Image is required</span>}

            {/* Campus dropdown */}
            <label className={styles.formLabel} htmlFor="campus">Campus</label>
            <select
              id="campus"
              {...register("campus", { required: true })}
              className={styles.formInput}
            >
              <option value="">Select Campus</option>
              <option value="SOA Campus 2">SOA Campus 2</option>
              <option value="SOA Campus 4">SOA Campus 4</option>
            </select>
            {errors.campus && <span className="text-red-500 text-xs">Campus is required</span>}

            {/* Student-only fields */}
            {userType === 'student' && <>
              <label className={styles.formLabel} htmlFor="course">Course/Branch</label>
              <input
                type="text"
                id="course"
                {...register("course", { required: userType === 'student' })}
                placeholder="Course/Branch"
                className={styles.formInput}
              />
              {errors.course && <span className="text-red-500 text-xs">Course/Branch is required</span>}

              <label className={styles.formLabel} htmlFor="regNo">Registration/Application Number</label>
              <input
                type="text"
                id="regNo"
                {...register("regNo", { required: userType === 'student' })}
                placeholder="Reg/Application No."
                className={styles.formInput}
              />
              {errors.regNo && <span className="text-red-500 text-xs">Reg/Application No. is required</span>}

              
            </>}

            <button type="submit" className={styles.formButton} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResonanceForm;
