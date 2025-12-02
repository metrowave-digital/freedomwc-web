"use client";

import { useState } from "react";

type SupportNeed = "virtual" | "accessibility" | "other";

interface FormState {
  // Personal Information
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: "" | "male" | "female" | "nonbinary" | "prefer-not";
  phone: string;
  email: string;
  address: string;

  // Church & Community
  fwcMember: "" | "yes" | "attend" | "interested" | "other-church";
  churchName: string;
  previousPrograms: "" | "yes" | "no";
  previousProgramsDescription: string;

  // Program Interest
  phase: "" | "restore" | "root" | "rise" | "release" | "unsure";
  whyJoin: string;
  spiritualGoals: string;

  // Availability
  preferredMeetingTime: "" | "weeknights" | "saturday" | "sunday" | "any";
  meetingFrequency: "" | "weekly" | "biweekly" | "monthly" | "unsure";

  // Support Needs
  supportNeeds: SupportNeed[];
  otherSupport: string;

  // Commitment
  agreement: boolean;
  signature: string;
  signatureDate: string;
}

const initialState: FormState = {
  fullName: "",
  preferredName: "",
  dateOfBirth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",

  fwcMember: "",
  churchName: "",
  previousPrograms: "",
  previousProgramsDescription: "",

  phase: "",
  whyJoin: "",
  spiritualGoals: "",

  preferredMeetingTime: "",
  meetingFrequency: "",

  supportNeeds: [],
  otherSupport: "",

  agreement: false,
  signature: "",
  signatureDate: new Date().toISOString().slice(0, 10), // today
};

const steps = [
  { id: 0, label: "Personal", description: "Basic info about you" },
  { id: 1, label: "Church", description: "Faith & community story" },
  { id: 2, label: "Interest", description: "Why Pathways, why now" },
  { id: 3, label: "Rhythm", description: "When you can meet" },
  { id: 4, label: "Support", description: "Any accommodations" },
  { id: 5, label: "Commit", description: "Agreement & signature" },
];

interface Props {
  onSuccess?: () => void;
}

export default function RegistrationWizard({ onSuccess }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = steps.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSupportNeed = (value: SupportNeed) => {
    setData((prev) => {
      const exists = prev.supportNeeds.includes(value);
      const next = exists
        ? prev.supportNeeds.filter((v) => v !== value)
        : [...prev.supportNeeds, value];

      // Clear otherSupport if "other" unchecked
      if (!next.includes("other")) {
        return { ...prev, supportNeeds: next, otherSupport: "" };
      }

      return { ...prev, supportNeeds: next };
    });
  };

  const nextStep = () => {
    // basic per-step validation
    if (step === 0) {
      if (!data.fullName || !data.phone || !data.email) {
        setError("Please fill in your name, phone, and email to continue.");
        return;
      }
    }
    if (step === 2) {
      if (!data.phase) {
        setError("Please select a Pathways phase (or choose 'Not sure').");
        return;
      }
    }
    if (step === 3) {
      if (!data.preferredMeetingTime || !data.meetingFrequency) {
        setError("Please tell us your preferred meeting time and rhythm.");
        return;
      }
    }
    if (step === 5) return; // submit handled separately

    setError("");
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  };

  const prevStep = () => {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  };

  const handleSubmit = async () => {
    // final validation
    if (!data.agreement || !data.signature || !data.signatureDate) {
      setError("Please agree, sign, and date your application.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/pathways/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Something went wrong submitting your application.");
      }

      setSubmitting(false);
      setSubmitted(true);

      if (onSuccess) {
        setTimeout(onSuccess, 1800);
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Unable to submit application right now.");
  }
}
  };

  if (submitted) {
    return (
      <div className="mt-4 mb-2 text-center text-slate-100">
        <h3 className="text-xl font-semibold">Application Submitted 🎉</h3>
        <p className="mt-2 text-sm text-slate-300">
          Thank you for trusting us with your journey. A confirmation email has
          been sent to you. Our team will follow up with next steps.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Step {step + 1} of {totalSteps}
            </p>
            <p className="text-sm text-slate-100">
              {steps[step].label} •{" "}
              <span className="text-slate-300">{steps[step].description}</span>
            </p>
          </div>
          <p className="text-xs text-slate-400">{Math.round(progress)}% complete</p>
        </div>

        <div className="w-full h-[6px] rounded-full bg-[#10152a] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background:
                "linear-gradient(90deg, #a4bf3b, #f5ff9b, #a4bf3b)",
            }}
          />
        </div>

        <div className="mt-3 flex gap-1.5">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`flex-1 h-[3px] rounded-full ${
                s.id <= step ? "bg-[#a4bf3b]" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-4 space-y-4 text-slate-100">
        {step === 0 && (
          <StepPersonal data={data} updateField={updateField} />
        )}
        {step === 1 && (
          <StepChurch data={data} updateField={updateField} />
        )}
        {step === 2 && (
          <StepInterest data={data} updateField={updateField} />
        )}
        {step === 3 && (
          <StepAvailability data={data} updateField={updateField} />
        )}
        {step === 4 && (
          <StepSupport
            data={data}
            toggleSupportNeed={toggleSupportNeed}
            updateField={updateField}
          />
        )}
        {step === 5 && (
          <StepCommitment data={data} updateField={updateField} />
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-700/60 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0 || submitting}
          className={`text-sm px-3 py-2 rounded border border-slate-600/80 text-slate-200 hover:bg-slate-900/70 transition ${
            step === 0 || submitting ? "opacity-40 cursor-not-allowed" : ""
          }`}
        >
          Back
        </button>

        {step < totalSteps - 1 && (
          <button
            type="button"
            onClick={nextStep}
            disabled={submitting}
            className="ml-auto text-sm px-4 py-2 rounded bg-[#a4bf3b] text-black font-semibold hover:brightness-110 transition shadow-lg shadow-lime-300/20"
          >
            Continue
          </button>
        )}

        {step === totalSteps - 1 && (
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="ml-auto text-sm px-4 py-2 rounded bg-[#a4bf3b] text-black font-semibold hover:brightness-110 transition shadow-lg shadow-lime-300/20"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- STEP COMPONENTS ---------- */

interface StepProps {
  data: FormState;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function Input({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-xs text-slate-300">
      {label}
      {required && <span className="text-rose-300 ml-0.5">*</span>}
      <input
        {...props}
        className={`mt-1 w-full rounded-md bg-[#050814] border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#a4bf3b]/70 focus:border-transparent`}
      />
    </label>
  );
}

function TextArea({
  label,
  required,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block text-xs text-slate-300">
      {label}
      {required && <span className="text-rose-300 ml-0.5">*</span>}
      <textarea
        {...props}
        className="mt-1 w-full rounded-md bg-[#050814] border border-slate-700/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#a4bf3b]/70 focus:border-transparent min-h-[80px]"
      />
    </label>
  );
}

function Select({
  label,
  required,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="block text-xs text-slate-300">
      {label}
      {required && <span className="text-rose-300 ml-0.5">*</span>}
      <select
        {...props}
        className="mt-1 w-full rounded-md bg-[#050814] border border-slate-700/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#a4bf3b]/70 focus:border-transparent"
      >
        {children}
      </select>
    </label>
  );
}

function StepPersonal({ data, updateField }: StepProps) {
  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Full Name"
          required
          value={data.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          placeholder="First & last name"
        />
        <Input
          label="Preferred Name (optional)"
          value={data.preferredName}
          onChange={(e) => updateField("preferredName", e.target.value)}
          placeholder="What do you prefer to be called?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Input
          label="Date of Birth"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => updateField("dateOfBirth", e.target.value)}
        />
        <Select
          label="Gender"
          value={data.gender}
          onChange={(e) =>
            updateField(
              "gender",
              e.target.value as FormState["gender"]
            )
          }
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="nonbinary">Non-binary</option>
          <option value="prefer-not">Prefer not to say</option>
        </Select>
        <Input
          label="Phone"
          required
          value={data.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          placeholder="Best contact number"
        />
      </div>

      <Input
        label="Email"
        required
        type="email"
        value={data.email}
        onChange={(e) => updateField("email", e.target.value)}
        placeholder="you@example.com"
      />

      <TextArea
        label="Home Address"
        value={data.address}
        onChange={(e) => updateField("address", e.target.value)}
        placeholder="Street, city, state, zip"
      />
    </div>
  );
}

function StepChurch({ data, updateField }: StepProps) {
  return (
    <div className="grid gap-3">
      <Select
        label="Are you connected to Freedom Worship Center?"
        required
        value={data.fwcMember}
        onChange={(e) =>
          updateField("fwcMember", e.target.value as FormState["fwcMember"])
        }
      >
        <option value="">Select</option>
        <option value="yes">Yes, I&#39;m a member.</option>
        <option value="attend">I attend regularly.</option>
        <option value="interested">Interested in joining.</option>
        <option value="other-church">I attend another church.</option>
      </Select>

      {data.fwcMember === "other-church" && (
        <Input
          label="Church Name"
          value={data.churchName}
          onChange={(e) => updateField("churchName", e.target.value)}
          placeholder="Enter church name"
        />
      )}

      <Select
        label="Have you participated in any discipleship or growth programs before?"
        required
        value={data.previousPrograms}
        onChange={(e) =>
          updateField(
            "previousPrograms",
            e.target.value as FormState["previousPrograms"]
          )
        }
      >
        <option value="">Select</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>

      {data.previousPrograms === "yes" && (
        <TextArea
          label="Share a little about that experience"
          value={data.previousProgramsDescription}
          onChange={(e) =>
            updateField("previousProgramsDescription", e.target.value)
          }
          placeholder="Where was it? What did you learn?"
        />
      )}
    </div>
  );
}

function StepInterest({ data, updateField }: StepProps) {
  return (
    <div className="grid gap-3">
      <Select
        label="Which Pathways phase are you interested in?"
        required
        value={data.phase}
        onChange={(e) =>
          updateField("phase", e.target.value as FormState["phase"])
        }
      >
        <option value="">Select</option>
        <option value="restore">Phase 1: Restore</option>
        <option value="root">Phase 2: Root</option>
        <option value="rise">Phase 3: Rise</option>
        <option value="release">Phase 4: Release</option>
        <option value="unsure">Not sure yet</option>
      </Select>

      <TextArea
        label="Why do you want to join Pathways?"
        required
        value={data.whyJoin}
        onChange={(e) => updateField("whyJoin", e.target.value)}
        placeholder="Tell us your heart behind joining the program"
      />

      <TextArea
        label="What are your spiritual or personal growth goals?"
        value={data.spiritualGoals}
        onChange={(e) => updateField("spiritualGoals", e.target.value)}
        placeholder="What do you hope to learn, grow, or heal?"
      />
    </div>
  );
}

function StepAvailability({ data, updateField }: StepProps) {
  return (
    <div className="grid gap-3">
      <Select
        label="Preferred meeting time"
        required
        value={data.preferredMeetingTime}
        onChange={(e) =>
          updateField(
            "preferredMeetingTime",
            e.target.value as FormState["preferredMeetingTime"]
          )
        }
      >
        <option value="">Select</option>
        <option value="weeknights">Weeknights</option>
        <option value="saturday">Saturday</option>
        <option value="sunday">Sunday</option>
        <option value="any">Any time works</option>
      </Select>

      <Select
        label="How often can you meet?"
        required
        value={data.meetingFrequency}
        onChange={(e) =>
          updateField(
            "meetingFrequency",
            e.target.value as FormState["meetingFrequency"]
          )
        }
      >
        <option value="">Select</option>
        <option value="weekly">Weekly</option>
        <option value="biweekly">Bi-weekly</option>
        <option value="monthly">Monthly</option>
        <option value="unsure">Not sure</option>
      </Select>
    </div>
  );
}

interface StepSupportProps extends StepProps {
  toggleSupportNeed: (value: SupportNeed) => void;
}

function StepSupport({ data, updateField, toggleSupportNeed }: StepSupportProps) {
  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-300">Do you need any support or accommodations?</p>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.supportNeeds.includes("virtual")}
            onChange={() => toggleSupportNeed("virtual")}
          />
          Virtual / hybrid option
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.supportNeeds.includes("accessibility")}
            onChange={() => toggleSupportNeed("accessibility")}
          />
          Accessibility accommodations
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={data.supportNeeds.includes("other")}
            onChange={() => toggleSupportNeed("other")}
          />
          Other support needs
        </label>

        {data.supportNeeds.includes("other") && (
          <TextArea
            label="Please describe"
            value={data.otherSupport}
            onChange={(e) => updateField("otherSupport", e.target.value)}
            placeholder="Tell us what support you may need"
          />
        )}
      </div>
    </div>
  );
}

function StepCommitment({ data, updateField }: StepProps) {
  return (
    <div className="grid gap-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.agreement}
          onChange={(e) => updateField("agreement", e.target.checked)}
        />
        I agree to commit to participation, communication, and growth.
      </label>

      <Input
        label="Full name (signature)"
        required
        value={data.signature}
        onChange={(e) => updateField("signature", e.target.value)}
        placeholder="Type your full name"
      />

      <Input
        label="Date"
        type="date"
        required
        value={data.signatureDate}
        onChange={(e) => updateField("signatureDate", e.target.value)}
      />
    </div>
  );
}
