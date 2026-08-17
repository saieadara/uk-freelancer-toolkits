import { useState } from "react";
import axios from "axios";
import { LockKeyhole } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const PremiumCapture = ({ source = "premium-teaser" }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post(`${API}/waitlist`, { email, source });
      setMessage("You’re on the list. We’ll send premium updates when they’re ready.");
      setEmail("");
    } catch (_error) {
      setMessage("Please enter a valid email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="premium-band" data-testid={`premium-capture-${source}`}>
      <div data-testid={`premium-copy-${source}`}>
        <p className="eyebrow" data-testid={`premium-eyebrow-${source}`}><LockKeyhole size={14} /> Pro features coming soon</p>
        <h2 data-testid={`premium-title-${source}`}>Save history and unlock premium templates.</h2>
        <p data-testid={`premium-description-${source}`}>Join the early interest list for client records, recurring documents, and branded exports.</p>
      </div>
      <form className="email-capture" onSubmit={submit} data-testid={`premium-email-form-${source}`}>
        <input value={email} type="email" placeholder="you@example.co.uk" onChange={(event) => setEmail(event.target.value)} data-testid={`premium-email-input-${source}`} required />
        <button type="submit" data-testid={`premium-email-submit-${source}`}>{loading ? "Saving..." : "Notify me"}</button>
        {message && <span className="form-message" data-testid={`premium-email-message-${source}`}>{message}</span>}
      </form>
    </section>
  );
};