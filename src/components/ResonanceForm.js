
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import pb from '../lib/pocketbase';
import { sendResendEmail } from '../api/sendResendEmail';
import styles from './TechXperience.module.css';


const ResonanceForm = ({ onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare form data for PocketBase
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "idCard" && value && value[0]) {
          formData.append(key, value[0]);
        } else {
          formData.append(key, value);
        }
      });
  await pb.collection('iecReg').create(formData);

      // Send email using Resend API
      try {
        await sendResendEmail({ to: data.email, name: data.name });
      } catch (emailErr) {
        // Optionally log or show error, but don't block registration
        console.error("Resend email error:", emailErr);
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
        <button className={styles.formClose} onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-[#a259ff]">Resonance Registration</h2>
        {submitted ? (
          <div className={styles.formSuccess}>Thank you for registering!</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
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

            <label className={styles.formLabel} htmlFor="course">Course/Branch</label>
            <input
              type="text"
              id="course"
              {...register("course", { required: true })}
              placeholder="Course/Branch"
              className={styles.formInput}
            />
            {errors.course && <span className="text-red-500 text-xs">Course/Branch is required</span>}

            <label className={styles.formLabel} htmlFor="regNo">Registration/Application Number</label>
            <input
              type="text"
              id="regNo"
              {...register("regNo", { required: true })}
              placeholder="Reg/Application No."
              className={styles.formInput}
            />
            {errors.regNo && <span className="text-red-500 text-xs">Reg/Application No. is required</span>}

            <label className={styles.formLabel} htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              {...register("phone", { required: true })}
              placeholder="Phone Number"
              className={styles.formInput}
            />
            {errors.phone && <span className="text-red-500 text-xs">Phone Number is required</span>}


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

            <label className={styles.formLabel} htmlFor="idCard">Upload Image/College ID</label>
            <input
              type="file"
              id="idCard"
              accept="image/*,.pdf"
              {...register("idCard", { required: true })}
              className={styles.formInput}
            />
            {errors.idCard && <span className="text-red-500 text-xs">ID/College Image is required</span>}

            <label className={styles.formLabel} htmlFor="message">Message (optional)</label>
            <textarea
              id="message"
              {...register("message")}
              placeholder="Message (optional)"
              className={styles.formInput}
              rows={3}
            />
            <button type="submit" className={styles.formButton} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResonanceForm;
