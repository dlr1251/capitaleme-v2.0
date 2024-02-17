import sgMail from '@sendgrid/mail';

sgMail.setApiKey(
    import.meta.env.SENDGRID_API_KEY
); 

export default async function(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;
      
      const content = {
        to: 'info@capitaleme.com', // Your email where you want to receive messages
        from: 'daniel.luqx@gmail.com', // Verify this sender in SendGrid
        subject: `New Contact Message from ${name}`,
        text: message,
        html: `<p>${message}</p>`,
      };

      await sgMail.send(content);
      res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('SendGrid error:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      res.status(500).json({ status: 'error', message: 'Email could not be sent' });
    }
  } else {
    // Handle any requests that aren't POST
    res.status(405).json({ error: 'Method not allowed' });
  }
}
