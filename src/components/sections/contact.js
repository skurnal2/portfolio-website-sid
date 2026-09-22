import React, { useState, useLayoutEffect } from 'react';
import "../../css/contact.scss";
import { gsap, ScrollTrigger } from 'gsap/all';

import { SCROLL_EFFECTS_OK } from "../common/motion";

gsap.registerPlugin(ScrollTrigger);

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mldekqky";

const emptyForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
};

const Contact = (props) => {

    useLayoutEffect(() => {
        // Same gating as #projects: pinned + scrubbed only where there is room
        // for it and the visitor has not asked for reduced motion.
        const mm = gsap.matchMedia();

        mm.add(SCROLL_EFFECTS_OK, () => {
            animateContactBackdrop();
            animateContactCard();
        });

        return () => mm.revert();
    }, []);

    const animateContactBackdrop = () => {
        gsap.to("#contact", {
            scrollTrigger: {
                trigger: "#contact",
                start: "top-=120 top",
                end: `+=${1 * 200 + 300}`,
                pin: true,
                scrub: 1.5
            },
            width: "100vw",
            opacity: 1
        });
    };

    const animateContactCard = () => {
        const contactSlides = document.querySelectorAll('.contact-content-right');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#contact',
                start: 'top-=120 top',
                end: `+=${1 * 200}`,
                scrub: 1.5
            }
        });

        contactSlides.forEach((slide, index) => {
            const slidePush = `${20 * index}px`;

            tl.fromTo(
                slide,
                {
                    y: '100%',
                    scale: 0.2,
                    rotateY: 45,
                    x: index % 2 ? '-90%' : '90%',
                    rotateZ: index % 2 ? -55 : 55
                },
                {
                    y: index * -10,
                    scale: 1,
                    rotateY: 0,
                    x: slidePush,
                    rotateZ: index * -0.8,
                    width: `calc(100% - ${slidePush} - 40px)`
                }
            );
        });
    };

    const [formData, setFormData] = useState(emptyForm);
    // 'idle' | 'sending' | 'success' | 'error'
    const [status, setStatus] = useState('idle');

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
            } else {
                setStatus('error');
            }
        } catch {
            // offline, blocked, DNS failure — previously this rejected and the
            // form just sat there looking like nothing had happened
            setStatus('error');
        }
    };

    const statusMessage = {
        sending: 'Sending…',
        success: 'Thanks! Your message is on its way. I will get back to you soon.',
        error: 'Something went wrong sending that. Please try again, or email contact@siddharthkurnal.com directly.'
    }[status];

    return(
        <div id="contact" className="contact" {...props}>
            <h4>Contact</h4>
            <div className="contact-content">
                <div className="contact-content-left">
                    <div className="contact-content-left-content">
                        <div className="contact-content-left-content-text">
                            <span>Lets</span>
                            <span>Get</span>
                            <span>In</span>
                            <span>Touch</span>
                        </div>
                    </div>
                </div>
                <div className="contact-content-right">
                    <span className="item-heading">Form</span>
                    <div className="contact-content-right-content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" autoComplete="name" required value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone <span className="optional">(optional)</span></label>
                                <input type="tel" id="phone" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} />
                            </div>
                            <div className="form-group is-message">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" required value={formData.message} onChange={handleInputChange}></textarea>
                            </div>

                            {/* Formspree honeypot: bots fill it, people never see it */}
                            <div className="contact-honeypot" aria-hidden="true">
                                <label htmlFor="_gotcha">Leave this field empty</label>
                                <input type="text" id="_gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" />
                            </div>

                            {/* status sits beside Send so the form needs one less line */}
                            <div className="submit-button-container">
                                <p
                                    className={`form-status${status === 'error' ? ' is-error' : ''}${status === 'success' ? ' is-success' : ''}`}
                                    role="status"
                                    aria-live="polite"
                                >
                                    {statusMessage}
                                </p>
                                <button type="submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? 'Sending…' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
