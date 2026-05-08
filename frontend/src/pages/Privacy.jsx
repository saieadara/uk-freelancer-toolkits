export default function Privacy() {
  return (
    <div className="page narrow-page" data-testid="privacy-page">
      <section className="tool-intro" data-testid="privacy-intro">
        <div>
          <p className="eyebrow" data-testid="privacy-eyebrow">Privacy policy</p>
          <h1 data-testid="privacy-title">We keep the toolkit simple and privacy-conscious.</h1>
          <p data-testid="privacy-description">
            This page explains how UK Freelancer Toolkit handles information when you use the website,
            contact us, or register interest in future services.
          </p>
        </div>
      </section>

      <section className="policy-copy" data-testid="privacy-content">
        <h2>Information we collect</h2>
        <p>
          Most tools run in your browser and use local storage so your draft information can remain on
          your device. If you submit a contact form, waitlist form, or enquiry, we may collect your name,
          email address, message, business details, and the page or service you asked about.
        </p>

        <h2>How we use information</h2>
        <p>
          We use submitted information to respond to enquiries, provide requested services, improve the
          toolkit, manage customer interest, and prepare custom web app or automation proposals.
        </p>

        <h2>Documents and generated content</h2>
        <p>
          Document generators are intended to help you create draft business documents. You are
          responsible for reviewing generated content before using it. Legal, tax, funding, and business
          outputs are guidance only and are not professional advice.
        </p>

        <h2>Storage and third parties</h2>
        <p>
          Browser-saved drafts may stay on your own device until you clear site data. If online forms,
          hosting, analytics, payments, or email tools are added, relevant providers may process data on
          our behalf to operate the service.
        </p>

        <h2>Your choices</h2>
        <p>
          You can avoid submitting personal information by using the free tools without contacting us.
          You can also clear your browser storage at any time. For questions or deletion requests, use
          the contact page.
        </p>

        <p className="policy-updated">Last updated: 8 May 2026</p>
      </section>
    </div>
  );
}
