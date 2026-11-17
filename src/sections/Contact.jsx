import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { SmartLink } from '../components/Placeholder';
import { site } from '../data/site';

const projectTypes = ['Website', 'WordPress', 'Framer', 'Shopify', 'Interactive / 3D', 'Other'];

const encode = (data) => new URLSearchParams(data).toString();

/*
  CONTACT: uses Netlify Forms (free). After you deploy to Netlify,
  messages appear in Netlify → your site → Forms, and you can turn on
  email notifications there. Locally (npm run dev) sending can't work,
  so the form shows a friendly message with the email fallback.
*/
export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', projectType: 'Website', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const update = (e) => setValues({ ...values, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...values }),
      });
      if (!res.ok) throw new Error(res.status);
      setStatus('sent');
      setValues({ name: '', email: '', projectType: 'Website', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent('Project enquiry')}`;

  return (
    <section className="block contact" id="contact" aria-labelledby="contact-h">
      <div className="wrap contact-grid">
        <div className="contact-l">
          <SectionHeading index="09" label="Contact" id="contact-h" title="Let's create something" accent="extraordinary.">
            <p>Have an idea, project or opportunity? Let's turn it into a meaningful digital experience.</p>
          </SectionHeading>
          <a className="big-mail" href={mailto}>
            {site.email}
            {site.emailIsPlaceholder && <span className="ph-tag">placeholder</span>}
          </a>
          <ul className="contact-socials">
            {site.socials.map((s) => (
              <li key={s.label}><SmartLink href={s.url}>{s.label}</SmartLink></li>
            ))}
          </ul>
        </div>

        <form className="cform" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit} data-reveal>
          <input type="hidden" name="form-name" value="contact" />
          <p className="hp" aria-hidden="true">
            <label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
          </p>

          <div className="field">
            <label htmlFor="cf-name">Name</label>
            <input id="cf-name" name="name" required autoComplete="name" value={values.name} onChange={update} />
          </div>
          <div className="field">
            <label htmlFor="cf-email">Email</label>
            <input id="cf-email" name="email" type="email" required autoComplete="email" value={values.email} onChange={update} />
          </div>
          <fieldset className="field types">
            <legend>Project type</legend>
            <div className="chips">
              {projectTypes.map((t) => (
                <label key={t} className={`chip ${values.projectType === t ? 'on' : ''}`}>
                  <input type="radio" name="projectType" value={t} checked={values.projectType === t} onChange={update} />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="cf-msg">Message</label>
            <textarea id="cf-msg" name="message" rows={5} required value={values.message} onChange={update} />
          </div>

          <button className="btn solid submit" type="submit" disabled={status === 'sending'}>
            <span>{status === 'sending' ? 'Sending…' : 'Send message'}</span>
            <span className="arr" aria-hidden="true">→</span>
          </button>

          <p className="form-status" role="status" aria-live="polite">
            {status === 'sent' && 'Thank you! Your message has been sent. I’ll reply soon.'}
            {status === 'error' && (
              <>The form couldn't send right now. Please email me directly at <a href={mailto}>{site.email}</a>.</>
            )}
          </p>
        </form>
      </div>
    </section>
  );
}
