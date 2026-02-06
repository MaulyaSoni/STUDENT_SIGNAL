from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.config import SENDGRID_API_KEY, FROM_EMAIL

def send_alert(to_email, student_id, risk):
    message = Mail(
        from_email=FROM_EMAIL,
        to_emails=to_email,
        subject=f"Alert: Student {student_id} at {risk} Risk",
        plain_text_content=f"Student {student_id} is classified as {risk} risk."
    )

    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(message)
