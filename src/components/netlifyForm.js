import React from 'react';
import styled from 'styled-components';

const ContactWrapper = styled.div`
  border-radius: 1rem;
  padding: 2rem 4rem;
  background-color: ${props => props.theme.colorBackground};
  margin-top: -3rem;
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 3rem 3rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.phone}) {
    padding: 2rem 1.5rem;
  }
  form {
    p {
      label,
      input {
        display: block;
      }
      input {
        min-width: 275px;
        margin-top: 0.5rem;
      }
      textarea {
        resize: vertical;
        min-height: 150px;
        width: 100%;
        margin-top: 0.5rem;
      }
    }
  }
`

const netlifyForm = () => (
    <ContactWrapper>
        <form
            name="contact"
            method="post"
            action="/success"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
        >
            <p>
            <label htmlFor="contact-name">
                Name
                <input name="name" id="contact-name" type="text" required />
            </label>
            </p>
            <p>
            <label htmlFor="contact-email">
                E-Mail <input name="email" id="contact-email" type="email" required />
            </label>
            </p>
            <p>
            <label htmlFor="contact-message">
                Your Message <textarea name="message" id="contact-message" required />
            </label>
            </p>
            <p>
                <button>Send</button>
            </p>
            <input type="hidden" name="form-name" value="contact-form" />
        </form>
    </ContactWrapper>
);

export default netlifyForm;
