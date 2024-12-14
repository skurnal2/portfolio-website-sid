import React, { useState, useEffect } from 'react';
import "../../css/contact.scss";
import gsap from 'gsap';

const Contact = (props) => {

    useEffect(() => {
        animateContactBackdrop();
        animateContactCard();
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

    const emptyForm = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    };

    const [formData, setFormData] = useState(emptyForm);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('subject', formData.subject);
        data.append('message', formData.message);
        const response = await fetch("https://formspree.io/f/mldekqky", {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: data
        });

        if(response.ok) {
            alert("Thanks for your submission!");
            setFormData(emptyForm);
        }
    };

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
                                <input type="text" id="name" name="name" required onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" required onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone</label>
                                <input type="tel" id="phone" name="phone" required onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" name="subject" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" required onChange={handleInputChange}></textarea>
                            </div>
                            <div className="submit-button-container">
                                <button type="submit">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;