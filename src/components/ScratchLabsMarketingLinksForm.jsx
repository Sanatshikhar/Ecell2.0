import React, { useState } from 'react';
import pb from '../lib/pocketbase';

const TEAM_COLLECTION = 'scratchlabs_teams';
const PRODUCT_COLLECTION = 'products';
const MARKETING_LINKS_COLLECTION =
  process.env.REACT_APP_PB_MARKETING_LINKS_COLLECTION || 'ScratcLabURL';
const MAX_URLS = 4;

function escapeFilterValue(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function chunkUrls(urlList, size = 4) {
  const chunks = [];
  for (let i = 0; i < urlList.length; i += size) {
    chunks.push(urlList.slice(i, i + size));
  }
  return chunks;
}

function getPocketBaseErrorMessage(error, fallback) {
  const fieldErrors = error?.response?.data || error?.data;
  if (fieldErrors && typeof fieldErrors === 'object') {
    const firstKey = Object.keys(fieldErrors)[0];
    const firstMessage = fieldErrors[firstKey]?.message;
    if (typeof firstMessage === 'string' && firstMessage.trim()) {
      return `${firstKey}: ${firstMessage}`;
    }
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

async function findProductByName(inputName) {
  const safeName = escapeFilterValue(inputName.trim());
  const page = await pb.collection(PRODUCT_COLLECTION).getList(1, 20, {
    filter: `name~"${safeName}"`,
    sort: 'name',
  });

  if (!page.items.length) return null;

  const normalized = inputName.trim().toLowerCase();
  const exact = page.items.find(
    (item) => String(item?.name || '').trim().toLowerCase() === normalized
  );

  return exact || page.items[0];
}

async function findTeamForVerification(productId, regNo) {
  try {
    const rows = await pb.collection(TEAM_COLLECTION).getList(1, 200, {
      filter: `product="${escapeFilterValue(productId)}"`,
    });

    const normalizedRegNo = String(regNo || '').trim().toLowerCase();
    if (!normalizedRegNo) return null;

    return rows.items.find((team) => {
      const candidates = [
        team?.m1_regNo,
        team?.ml_regNo,
        team?.mI_regNo,
        team?.m2_regNo,
      ]
        .map((value) => String(value || '').trim().toLowerCase())
        .filter(Boolean);

      return candidates.includes(normalizedRegNo);
    }) || null;
  } catch (error) {
    if (error?.status === 404 || error?.status === 400) return null;
    throw error;
  }
}

export default function ScratchLabsMarketingLinksForm() {
  const [urls, setUrls] = useState(['']);
  const [productName, setProductName] = useState('');
  const [registrationNo, setRegistrationNo] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedProductId, setVerifiedProductId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlChange = (index, value) => {
    setUrls((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const addUrlField = () => {
    setUrls((prev) => {
      if (prev.length >= MAX_URLS) return prev;
      return [...prev, ''];
    });
  };

  const removeUrlField = (index) => {
    setUrls((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    const trimmedProductName = productName.trim();
    const normalizedRegNo = registrationNo.trim();

    if (!trimmedProductName) {
      setError('Please enter your product name.');
      return;
    }

    if (!normalizedRegNo) {
      setError('Please enter your registration number password.');
      return;
    }

    setIsVerifying(true);

    try {
      const productRecord = await findProductByName(trimmedProductName);
      if (!productRecord) {
        setError('Verification failed. Check product name and registration number.');
        return;
      }

      let teamRecord = await findTeamForVerification(productRecord.id, normalizedRegNo);
      if (!teamRecord) {
        teamRecord = await findTeamForVerification(productRecord.id, normalizedRegNo.toUpperCase());
      }

      if (!teamRecord) {
        setError('Verification failed. Check product name and registration number.');
        return;
      }

      setIsVerified(true);
      setVerifiedProductId(productRecord.id);
      setStatus('Verification successful. You can now upload your URLs.');
    } catch {
      setError('Unable to verify right now. Please try again in a moment.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    if (!isVerified || !verifiedProductId) {
      setError('Please complete verification first.');
      return;
    }

    const cleanedUrls = urls
      .map((url) => url.trim())
      .filter(Boolean);

    if (!cleanedUrls.length) {
      setError('Please provide at least one social media post URL.');
      return;
    }

    const invalidUrl = cleanedUrls.find((url) => !isValidHttpUrl(url));
    if (invalidUrl) {
      setError(`Invalid URL detected: ${invalidUrl}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const urlChunks = chunkUrls(cleanedUrls, 4);

      for (const chunk of urlChunks) {
        const payload = {
          product_name: verifiedProductId,
        };

        if (chunk[0]) payload.url1 = chunk[0];
        if (chunk[1]) payload.url2 = chunk[1];
        if (chunk[2]) payload.url3 = chunk[2];
        if (chunk[3]) payload.url4 = chunk[3];

        await pb.collection(MARKETING_LINKS_COLLECTION).create(payload);
      }

      setStatus(`Submitted ${cleanedUrls.length} URL(s) successfully.`);
      setUrls(['']);
    } catch (submitError) {
      setError(getPocketBaseErrorMessage(submitError, 'Unable to submit links right now. Please try again in a moment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetVerification = () => {
    setIsVerified(false);
    setVerifiedProductId('');
    setRegistrationNo('');
    setUrls(['']);
    setStatus('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c8ff00]">ScratchLabs</p>
          <h1 className="mt-2 text-2xl font-bold md:text-3xl">Marketing Video Post Links</h1>
          <p className="mt-2 text-sm text-[#a1a1aa]">
            Submit the social media links where your team posted the marketing video.
            Enter your product name and registration number password for verification.
          </p>
        </div>

        {!isVerified ? (
          <form
            onSubmit={handleVerify}
            className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 text-white"
          >
            <h2 className="mb-4 text-lg font-semibold">Login To Continue</h2>
            <div className="mb-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#a1a1aa]">
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(event) => setProductName(event.target.value)}
                  placeholder="e.g., EcoBox"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#c8ff00]"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#a1a1aa]">
                  Registration No. (as Password)
                </label>
                <input
                  type="password"
                  value={registrationNo}
                  onChange={(event) => setRegistrationNo(event.target.value)}
                  placeholder="Enter your registration number"
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#c8ff00]"
                  required
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isVerifying}
                className="rounded-lg border border-transparent bg-[#c8ff00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#b7ea00] disabled:cursor-not-allowed disabled:bg-[#7a8746]"
              >
                {isVerifying ? 'Verifying...' : 'Login'}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 text-white"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-sm text-[#d4d4d8]">
              <p>
                Logged in with product: <span className="font-semibold text-[#c8ff00]">{productName}</span>
              </p>
              <button
                type="button"
                onClick={resetVerification}
                className="rounded-lg border border-[#3d3d3d] px-3 py-1 text-xs text-[#d4d4d8] transition-colors hover:border-[#ff6b00] hover:text-[#ff6b00]"
              >
                Change Login
              </button>
            </div>

            <div className="space-y-4">
              {urls.map((url, index) => (
                <div key={`url-${index}`} className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4">
                  <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#a1a1aa]">
                    Post URL {index + 1}
                  </label>
                  <div className="flex flex-col gap-3 md:flex-row">
                    <input
                      type="url"
                      value={url}
                      onChange={(event) => handleUrlChange(index, event.target.value)}
                      placeholder="https://www.instagram.com/..."
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#c8ff00]"
                      required={index === 0}
                    />
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      disabled={urls.length === 1}
                      className="rounded-lg border border-[#3d3d3d] px-4 py-2 text-sm text-[#d4d4d8] transition-colors hover:border-[#ff6b00] hover:text-[#ff6b00] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addUrlField}
                disabled={urls.length >= MAX_URLS}
                className="rounded-lg border border-[#c8ff00] px-4 py-2 text-sm font-semibold text-[#c8ff00] transition-colors hover:bg-[#c8ff00] hover:text-black"
              >
                + Add Another URL
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg border border-transparent bg-[#c8ff00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#b7ea00] disabled:cursor-not-allowed disabled:bg-[#7a8746]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Links'}
              </button>
            </div>

            <p className="mt-3 text-xs text-[#8a8a8a]">You can add up to 4 URLs.</p>
          </form>
        )}

        {(status || error) && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              error
                ? 'border-red-800 bg-red-950/40 text-red-300'
                : 'border-[#7a9b1a] bg-[#1d2b08] text-[#d9ff66]'
            }`}
          >
            {error || status}
          </div>
        )}
      </div>
    </div>
  );
}
