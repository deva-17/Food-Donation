from django.contrib import admin
from .models import Donation, Notification, NGO,DeliveryPerson


# ✅ Register models
admin.site.register(Donation)
admin.site.register(Notification)
admin.site.register(NGO)
admin.site.register(DeliveryPerson)
