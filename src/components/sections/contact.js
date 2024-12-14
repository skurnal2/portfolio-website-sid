import React, { useState } from 'react';
import "../../css/contact.scss";

const Contact = (props) => {

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
        <div className="contact" {...props}>
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