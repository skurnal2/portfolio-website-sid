import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { ANIMATION_OK } from "../common/motion";
import { onLeave, track, trackOnce } from "../../lib/analytics";
import "../../css/contact.scss";

gsap.registerPlugin(ScrollTrigger);

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mldekqky";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const DIRECT = [
  { icon: faEnvelope, label: "Email", value: "contact@siddharthkurnal.com", href: "mailto:contact@siddharthkurnal.com" },
  { icon: faLinkedin, label: "LinkedIn", value: "in/siddharth-kurnal", href: "https://www.linkedin.com/in/siddharth-kurnal", external: true },
  { icon: faGithub, label: "GitHub", value: "skurnal2", href: "https://github.com/skurnal2", external: true },
];

const FIELDS = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel" },
  { name: "subject", label: "Subject", type: "text" },
];

// The last section: no pin (nothing follows it), just everything rising out
// of the page as it arrives.
const Contact = () => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    const mm = gsap.matchMedia();
    mm.add(ANIMATION_OK, () => {
      gsap.fromTo(root.querySelectorAll(".ct-item"),
        { y: 70, z: -300, rotateX: 22, opacity: 0, transformPerspective: 1200 },
        { y: 0, z: 0, rotateX: 0, opacity: 1, stagger: 0.12, ease: "power3.out",
          // Finish by the time the page can't scroll any further: this is the
          // last section, so "top 25%" is never reached on a tall screen and
          // the form was left slightly tilted.
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            end: () => Math.min(
              root.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3,
              ScrollTrigger.maxScroll(window) - 2,
            ),
            scrub: 0.6,
            invalidateOnRefresh: true,
          } });
    });
    return () => mm.revert();
  }, []);

  const [formData, setFormData] = useState(emptyForm);
  // 'idle' | 'sending' | 'success' | 'error'
  const [status, setStatus] = useState('idle');

  // Analytics: someone started the form and left without sending it. Only how
  // many fields had something in them is sent, never what was typed.
  const formRef = useRef({ started: false, sent: false, data: emptyForm });
  formRef.current.data = formData;
  useEffect(() => onLeave(() => {
      const f = formRef.current;
      if (!f.started || f.sent) return;
      const filled = Object.values(f.data).filter((v) => String(v).trim()).length;
      if (filled) track('form_abandon', { form: 'contact', fields_filled: filled });
      f.started = false; // once per start
  }), []);

  const handleInputChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
      });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      // guards against a double-tap firing two submissions
      if (status === 'sending') return;
      setStatus('sending');

      try {
          const response = await fetch(FORMSPREE_ENDPOINT, {
              method: 'POST',
              headers: {
                  'Accept': 'application/json'
              },
              body: new FormData(e.target)
          });

          if (response.ok) {
              setFormData(emptyForm);
              setStatus('success');
              track('generate_lead', { form: 'contact' });
              formRef.current.sent = true;
          } else {
              setStatus('error');
              track('form_error', { form: 'contact', reason: `http_${response.status}` });
          }
      } catch {
          // offline, blocked, DNS failure — previously this rejected and the
          // form just sat there looking like nothing had happened
          setStatus('error');
          track('form_error', { form: 'contact', reason: 'network' });
      }
  };

  const statusMessage = {
      sending: 'Sending…',
      success: 'Thanks! Your message is on its way. I will get back to you soon.',
      error: 'Something went wrong sending that. Please try again, or email contact@siddharthkurnal.com directly.'
  }[status];

  return (
    <section id="contact" className="ct" ref={ref} aria-labelledby="contact-title">
      <h4 id="contact-title" className="sec-head">
        <span className="sec-ring" aria-hidden="true" />
        <span className="sec-num" aria-hidden="true">04</span>
        <span className="sec-title">Contact</span>
        <span className="sec-sub" aria-hidden="true">Say hello</span>
        <span className="sec-rule" aria-hidden="true" />
      </h4>
      <div className="ct-layout">
        <div className="ct-intro">
          <h2 className="ct-item ct-heading">
            <span>Let&rsquo;s build</span>
            <span className="ct-heading-accent">something.</span>
          </h2>
          <p className="ct-item ct-lead">Send a message here, or reach me directly.</p>
          <ul className="ct-direct">
            {DIRECT.map((d) => (
              <li className="ct-item" key={d.label}>
                <a href={d.href} data-track={`contact_${d.label.toLowerCase()}`} {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <span className="ct-direct-icon"><FontAwesomeIcon icon={d.icon} /></span>
                  <span className="ct-direct-text"><small>{d.label}</small><span>{d.value}</span></span>
                  <FontAwesomeIcon className="ct-direct-arrow" icon={faArrowRight} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="ct-item ct-form"
          onSubmit={handleSubmit}
          noValidate={false}
          // someone started writing (what they type is never sent to analytics)
          onFocus={() => { formRef.current.started = true; trackOnce('form_start', 'form_start', { form: 'contact' }); }}
        >
          <div className="ct-form-head">
            <span className="ct-form-icon"><FontAwesomeIcon icon={faPaperPlane} /></span>
            <div>
              <b>Send a message</b>
              <span>Name, email and a few words are all it needs.</span>
            </div>
          </div>
          <div className="ct-form-grid">
            {FIELDS.map((f) => (
              <label className="ct-field" key={f.name}>
                <input
                  type={f.type}
                  name={f.name}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  placeholder=" "
                  value={formData[f.name]}
                  onChange={handleInputChange}
                />
                <span>{f.label}</span>
              </label>
            ))}
            <label className="ct-field ct-field-wide">
              <textarea name="message" required placeholder=" " value={formData.message} onChange={handleInputChange} />
              <span>Message</span>
            </label>
          </div>

          {/* Formspree honeypot: bots fill it, people never see it */}
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="_gotcha">Leave this field empty</label>
            <input type="text" id="_gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="ct-form-foot">
            <p
              className={`ct-status${status === "error" ? " is-error" : ""}${status === "success" ? " is-success" : ""}`}
              role="status"
              aria-live="polite"
            >
              {statusMessage}
            </p>
            <button type="submit" className={`ct-send${status === "success" ? " is-sent" : ""}`} disabled={status === "sending"}>
              <span>{status === "sending" ? "Sending…" : "Send message"}</span>
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
