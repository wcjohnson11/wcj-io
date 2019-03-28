import React from 'react';
import styled from 'styled-components';

const ContactWrapper = styled.section`
	padding: 2rem 4rem;
	display: flex;
	flex-direction: column;
	text-align: center;
	background-color: ${(props) => props.theme.colorBackground};
	@media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
		padding: 3rem 16rem;
	}
	@media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
		padding: 2rem 1.5rem;
	}
	form {
		margin: 0 auto;
		max-width: ${(props) => props.theme.maxWidth};
		p {
      margin-bottom: .5em;
			label,
			input,
			textarea {
				display: block;
			}
			input {
				min-width: 320px;
				margin-top: 0.5rem;
				border: 1px ${(props) => props.theme.colorBorder} solid;
				border-radius: 10px;
				:focus {
					outline: ${(props) => props.theme.colorPrimary} auto 5px;
				}
			}
			textarea {
				resize: vertical;
				min-height: 150px;
				width: 100%;
				margin-top: 0.5rem;
				border: 1px ${(props) => props.theme.colorBorder} solid;
				border-radius: 10px;
				:focus {
					outline: ${(props) => props.theme.colorPrimary} auto 5px;
				}
			}
			button {
				border-radius: 10px;
				border: 1px ${(props) => props.theme.colorBorder} solid;
				:focus {
					outline: none;
					background-color: ${(props) => props.theme.colorPrimary};
					box-shadow: 0 0 0 2pt ${(props) => props.theme.colorPrimary};
				}
			}
		}
	}
`;

const netlifyForm = () => (
	<ContactWrapper id="contact">
		<h3>Get in touch and I'll get back to you soon!</h3>
		<form name="contact" method="post" action="/success" data-netlify="true" data-netlify-honeypot="bot-field">
			<p>
				<label htmlFor="contact-name">
					Your Name
					<input name="name" id="contact-name" type="text" required />
				</label>
			</p>
			<p>
				<label htmlFor="contact-email">
					Your E-Mail <input name="email" id="contact-email" type="email" required />
				</label>
			</p>
			<p>
				<label htmlFor="contact-message">
					Your Message <textarea name="message" id="contact-message" required />
				</label>
			</p>
			<p>
				<button>Send it!</button>
			</p>
			<input type="hidden" name="form-name" value="contact-form" />
		</form>
	</ContactWrapper>
);

export default netlifyForm;
