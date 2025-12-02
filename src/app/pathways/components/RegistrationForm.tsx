"use client";

import { useState } from "react";

interface Props {
  onSuccess?: () => void;
}

export default function RegistrationForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formEl = e.target as HTMLFormElement;
    const formData = Object.fromEntries(new FormData(formEl).entries());

    try {
      const res = await fetch("/api/pathways/apply", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Submission failed");

      setSuccess(true);
      setLoading(false);

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center text-green-400 py-6">
        <h3 className="text-xl font-semibold">Application Submitted!</h3>
        <p className="text-sm opacity-80 mt-2">
          Check your email for confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <input
        name="fullName"
        placeholder="Full name"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      />

      <input
        name="email"
        placeholder="Email"
        type="email"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      />

      <input
        name="phone"
        placeholder="Phone"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      />

      <select
        name="phase"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      >
        <option value="">Select Phase</option>
        <option value="restore">Phase 1: Restore</option>
        <option value="root">Phase 2: Root</option>
        <option value="rise">Phase 3: Rise</option>
        <option value="release">Phase 4: Release</option>
        <option value="unsure">Not sure — help me decide</option>
      </select>

      <select
        name="preferredMeetingTime"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      >
        <option value="">Preferred meeting time</option>
        <option value="weeknights">Weeknights</option>
        <option value="saturday">Saturday mornings</option>
        <option value="sunday">Sunday afternoons</option>
        <option value="any">Flexible</option>
      </select>

      <select
        name="meetingFrequency"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      >
        <option value="">Meeting frequency</option>
        <option value="weekly">Weekly</option>
        <option value="biweekly">Bi-weekly</option>
        <option value="monthly">Monthly</option>
        <option value="unsure">Not sure</option>
      </select>

      <textarea
        name="whyJoin"
        placeholder="Why do you want to join?"
        className="w-full bg-[#0b0e1d] p-3 rounded h-28"
      />

      <div className="flex items-center gap-2">
        <input type="checkbox" name="agreement" required />
        <label>I agree to commit to the Pathways journey.</label>
      </div>

      <input
        name="signature"
        placeholder="Type your full name as signature"
        required
        className="w-full bg-[#0b0e1d] p-3 rounded"
      />

      <button
        disabled={loading}
        className="w-full bg-[#a4bf3b] text-black p-3 rounded font-semibold"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </form>
  );
}
