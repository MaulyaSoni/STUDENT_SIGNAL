from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from app.config import SENDGRID_API_KEY, FROM_EMAIL

def send_alert(to_email, student_id, risk_level, student_name="Unknown"):
    """Send email alert for at-risk students"""
    try:
        # Create more detailed email content
        subject = f"⚠️ Alert: Student {student_name} ({student_id}) at {risk_level.upper()} Risk"
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2 style="color: #dc2626;">Student Risk Alert</h2>
                <p>This is an automated alert from the EarlySignal.AI system.</p>
                
                <div style="background-color: #fee2e2; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
                    <h3>Student Information</h3>
                    <p><strong>Name:</strong> {student_name}</p>
                    <p><strong>Student ID:</strong> {student_id}</p>
                    <p><strong>Risk Level:</strong> <span style="color: #dc2626; font-weight: bold;">{risk_level.upper()}</span></p>
                </div>
                
                <p><strong>Recommended Actions:</strong></p>
                <ul>
                    <li>Schedule immediate counseling session</li>
                    <li>Review attendance and academic performance</li>
                    <li>Contact student and parents/guardians</li>
                    <li>Develop intervention plan</li>
                </ul>
                
                <p style="margin-top: 30px; color: #666;">
                    <small>This is an automated message from EarlySignal.AI Student Dropout Prediction System.</small>
                </p>
            </body>
        </html>
        """
        
        plain_text = f"""
        STUDENT RISK ALERT
        
        Student Name: {student_name}
        Student ID: {student_id}
        Risk Level: {risk_level.upper()}
        
        Recommended Actions:
        - Schedule immediate counseling session
        - Review attendance and academic performance
        - Contact student and parents/guardians
        - Develop intervention plan
        
        This is an automated message from EarlySignal.AI Student Dropout Prediction System.
        """
        
        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=subject,
            plain_text_content=plain_text,
            html_content=html_content
        )
        
        # Check if API key is configured
        if not SENDGRID_API_KEY or SENDGRID_API_KEY.startswith("SG_xxx"):
            print(f"⚠️ SendGrid not configured. Would send: {subject} to {to_email}")
            return {"status": "skipped", "reason": "SendGrid not configured"}
        
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        response = sg.send(message)
        
        return {"status": "sent", "status_code": response.status_code}
    
    except Exception as e:
        print(f"Error sending email alert: {str(e)}")
        return {"status": "failed", "error": str(e)}
