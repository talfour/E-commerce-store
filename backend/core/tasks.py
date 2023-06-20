from celery import shared_task
from core.models import Order
from django.core.mail import send_mail


@shared_task()
def order_created(order_id):
    """Task that send notification via email after creating a new order."""
    order = Order.objects.get(id=order_id)
    subject = f"Order number: {order.id}"
    message = f"Hello {order.first_name}. You have ordered items in our shop.\
        order ID number is: {order.id}"
    mail_sent = send_mail(subject, message, "admin@vapemate.com", [order.email])
    return mail_sent
