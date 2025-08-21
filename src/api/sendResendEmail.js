// Send email using Resend API
// Usage: sendResendEmail({ to, name })

export async function sendResendEmail({ to, name }) {
  // Call local backend endpoint instead of Resend API directly
  const response = await fetch('http://localhost:5000/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, name })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Backend email failed: ' + error);
  }
  return response.json();
}
