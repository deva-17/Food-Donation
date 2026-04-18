from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Donation, NGO, Notification, Profile,DeliveryPerson
from .serializers import DonationSerializer
from .ai import check_freshness, recommend_ngo, check_image_freshness
from datetime import datetime
from django.contrib.auth.models import User
import uuid


# 🔔 NOTIFICATION FUNCTION
def notify_user(message, user_type):
    Notification.objects.create(message=message, user_type=user_type)


@api_view(['POST'])
def add_donation(request):
    data = request.data.copy()

    try:
        prep_time = datetime.strptime(data.get('prep_time'), "%Y-%m-%dT%H:%M")
    except:
        return Response({"error": "Invalid prep_time format"})

    # 🧠 AI LOGIC
    data['freshness'] = check_freshness(prep_time)
    location = data.get('location') or "chennai"
    data['recommended_ngo'] = recommend_ngo(location)

    # 🔥 GET USER (DONOR)
    user_email = request.data.get("email")
    user = User.objects.filter(email=user_email).first()

    # 🔥 SERIALIZE DATA
    serializer = DonationSerializer(data=data)

    if serializer.is_valid():
        donation = serializer.save()

        # ✅ SAVE DONOR AFTER CREATION
        donation.donor = user
        donation.save()

        # 🔔 NOTIFICATIONS
        notify_user("Your donation has been successfully submitted", "donor")
        notify_user("New donation available near you", "ngo")

        # 🧠 IMAGE AI
        try:
            image_path = donation.photo.path
            image_freshness = check_image_freshness(image_path)

            donation.freshness = image_freshness
            donation.save()

        except Exception as e:
            print("Image error:", e)

        return Response(DonationSerializer(donation, context={'request': request}).data)

    else:
        return Response(serializer.errors)


@api_view(['GET'])
def get_donations(request):
    donations = Donation.objects.all()
    serializer = DonationSerializer(
        donations,
        many=True,
        context={'request': request}   # 🔥 ADD THIS
    )
    return Response(serializer.data)



# 👉 COMPLETE DONATION
@api_view(['POST'])
def complete_donation(request, id):
    try:
        donation = Donation.objects.get(id=id)
        donation.status = "Completed"
        donation.save()

        notify_user("Your donation has been successfully delivered", "donor")

        return Response({"message": "Completed"})

    except Donation.DoesNotExist:
        return Response({"error": "Not found"})

@api_view(['GET'])
def my_donations(request):
    donations = Donation.objects.all()
    serializer = DonationSerializer(
        donations,
        many=True,
        context={'request': request}   # 🔥 ADD THIS
    )
    return Response(serializer.data)

@api_view(['GET'])
def admin_stats(request):
    donations = Donation.objects.all()

    total_donations = donations.count()

    total_food = sum([
        d.quantity for d in donations if d.quantity
    ])

    completed = Donation.objects.filter(status="Completed").count()

    return Response({
        "total_donations": total_donations,
        "total_food": total_food,
        "completed": completed
    })



@api_view(['GET'])
def get_notifications(request):
    user_type = request.GET.get('type', 'donor')

    notifications = Notification.objects.filter(
        user_type=user_type
    ).order_by('-created_at')

    # 🔥 FIX HERE
    data = [
        {
            "message": n.message,
            "is_read": n.is_read
        }
        for n in notifications
    ]

    return Response(data)

# ✅ REGISTER USER (FINAL)
@api_view(['POST'])
def register_user(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role') or "donor"
        phone = request.data.get('phone') or "0000000000"

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"})

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # 🔥 GENERATE ID HERE (FINAL FIX)
        register_id = "FD" + uuid.uuid4().hex[:6].upper()

        Profile.objects.create(
            user=user,
            role=role,
            phone=phone,
            register_id=register_id
        )

        return Response({
            "message": "Registered successfully",
            "register_id": register_id   # ✅ ALWAYS RETURN THIS
        })

    except Exception as e:
        return Response({"error": str(e)})
        

@api_view(['POST'])
def login_user(request):
    login_input = request.data.get('login')
    password = request.data.get('password')

    # ❌ check empty
    if not login_input or not password:
        return Response({"error": "Please enter credentials"})

    # 🔍 EMAIL LOGIN ONLY
    if "@" in login_input:
        user = User.objects.filter(email=login_input).first()

        if not user:
            return Response({"error": "Email not found"})

        if not user.check_password(password):
            return Response({"error": "Incorrect password"})

        # 👑 ADMIN
        if user.is_superuser:
            return Response({
                "message": "Admin login success",
                "role": "admin"
            })

        # 👤 NORMAL USER
        profile = Profile.objects.get(user=user)

        return Response({
            "message": "Login success",
            "role": profile.role,
            "email": user.email   # 🔥 ADD THIS
        })

    # 🔍 REGISTER ID LOGIN
    else:
        try:
            profile = Profile.objects.get(register_id=login_input)
            user = profile.user
        except Profile.DoesNotExist:
            return Response({"error": "Register ID not found"})

        if not user.check_password(password):
            return Response({"error": "Incorrect password"})

        return Response({
            "message": "Login success",
            "role": profile.role
        })
@api_view(['POST'])
def accept_donation(request, id):
    try:
        donation = Donation.objects.get(id=id)

        # 🔥 GET NGO (SAFE FIX)
        ngo_input = request.data.get("ngo_name")

        # try matching by name
        ngo = NGO.objects.filter(name__iexact=ngo_input).first()

        # 🔥 fallback (important)
        if not ngo:
            ngo = NGO.objects.first()

        # ✅ UPDATE DONATION
        donation.status = "Accepted"
        donation.accepted_by = ngo
        donation.save()

        # 🔥 GET NAMES
        donor_name = donation.donor.username if donation.donor else "Unknown"
        ngo_name = ngo.name if ngo else "Unknown"

        # 🔔 NOTIFICATIONS
        notify_user(f"Your donation has been accepted by {ngo_name}", "donor")
        notify_user(f"You accepted donation from {donor_name}", "ngo")

        notify_user(
            f"Donation accepted by {ngo_name} from {donor_name} ({donation.location})",
            "admin"
        )

        return Response({"message": "Donation Accepted"})

    except Donation.DoesNotExist:
        return Response({"error": "Not found"})


@api_view(['POST'])
def mark_notifications_read(request):
    user_type = request.data.get('type')

    Notification.objects.filter(
        user_type=user_type,
        is_read=False
    ).update(is_read=True)

    return Response({"message": "Marked as read"})





@api_view(['GET'])
def admin_full_data(request):
    try:
        # 👤 USERS
        users = Profile.objects.all()
        user_data = [
            {
                "username": u.user.username,
                "email": u.user.email,
                "role": u.role,
                "phone": u.phone
            }
            for u in users
        ]

        # 🍱 DONATIONS
        donations = Donation.objects.all()
        donation_data = [
        {
            "food_type": d.food_type,
            "quantity": d.quantity,
            "location": d.location,
            "status": d.status,
            "donor": d.donor.username if d.donor else "Unknown",

        # 🔥 ADD THIS
            "photo": d.photo.url if d.photo else None
        }
        for d in donations
        ]

        # 🤝 ACCEPTED
        accepted = Donation.objects.filter(status="Accepted")
        accepted_data = [
            {
                "food_type": d.food_type,
                "location": d.location,
                "ngo": d.accepted_by.name if d.accepted_by else "Unknown"
            }
            for d in accepted
        ]

        return Response({
            "users": user_data,
            "donations": donation_data,
            "accepted": accepted_data
        })

    except Exception as e:
        print("ERROR:", e)
        return Response({"error": str(e)})