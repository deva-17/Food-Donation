from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_donation),
    path('all/', views.get_donations),
    path('accept/<int:id>/', views.accept_donation),
    path('complete/<int:id>/', views.complete_donation),
    path('my/', views.my_donations),
    path('admin-stats/', views.admin_stats),  
    path('notifications/', views.get_notifications),
    path('register/', views.register_user), # ✅ FIXED
    path('login/', views.login_user),
    path('notifications/read/', views.mark_notifications_read),
    path('admin-data/',views.admin_full_data),
]   