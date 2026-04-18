from django.db import models
from django.contrib.auth.models import User
import uuid


class Donation(models.Model):
    FOOD_TYPES = [
        ('cooked', 'Cooked Meal'),
        ('dry', 'Dry Food'),
        ('fruits', 'Fruits'),
        ('packaged', 'Packaged Food'),
    ]

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Completed', 'Completed'),
    ]

    # 🍱 Food Details
    food_type = models.CharField(max_length=20, choices=FOOD_TYPES)
    description = models.TextField()
    quantity = models.FloatField()

    prep_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    location = models.CharField(max_length=255)
    photo = models.ImageField(upload_to='donations/')

    # 📊 Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    # 🤖 AI Fields
    recommended_ngo = models.CharField(max_length=100, blank=True)
    freshness = models.CharField(max_length=50, blank=True)

    # 👤 DONOR (who created donation)
    donor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="donations"
    )

    # 🏢 NGO (who accepted donation)
    accepted_by = models.ForeignKey(
        'api.NGO',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    

    def __str__(self):
        return f"{self.food_type} - {self.location}"

class NGO(models.Model):
    name = models.CharField(max_length=100)
    area = models.CharField(max_length=100)   # Chennai area
    distance = models.FloatField()

    def __str__(self):
        return self.name


# 👉 NOTIFICATION MODEL
class Notification(models.Model):
    message = models.TextField()
    user_type = models.CharField(max_length=10, default="donor")
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.message


# 👉 PROFILE MODEL (AUTH SYSTEM)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10)
    phone = models.CharField(max_length=15)
    register_id = models.CharField(max_length=20, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.register_id:
            self.register_id = "FD" + str(uuid.uuid4().hex[:6]).upper()
        super().save(*args, **kwargs)
           # 🔥 distance from city center (km)


class DeliveryPerson(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    area = models.CharField(max_length=100)   # Chennai area

    def __str__(self):
        return self.name