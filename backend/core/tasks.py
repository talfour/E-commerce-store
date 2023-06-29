from celery import shared_task
from core.models import Order
from django.core.mail import send_mail


@shared_task()
def order_created(order_id):
    """Task that send notification via email after creating a new order."""
    order = Order.objects.get(id=order_id)
    subject = f"Numer zamówienia: {order.id}"
    message = f"Witaj {order.first_name}! Informujemy Cię, że otrzymaliśmy twoje zamówienie\
        i jest ono w trakcie realizacji.\
        order ID number is: {order.id}"
    mail_sent = send_mail(subject, message, "no-reply@vapemate.com", [order.email])
    return mail_sent
