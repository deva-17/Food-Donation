from datetime import datetime
import cv2
import numpy as np
from .models import NGO
import math

def check_freshness(prep_time):
    now = datetime.now()
    diff = now - prep_time

    hours = diff.total_seconds() / 3600

    if hours < 4:
        return "Fresh"
    elif hours < 6:
        return "Use Soon"
    else:
        return "Expired"



# 🔥 predefined distance map (Chennai areas)
area_distance = {
    "t nagar": 2,
    "nungambakkam": 3,
    "kodambakkam": 4,
    "mylapore": 4,
    "triplicane": 3,
    "adyar": 5,
    "besant nagar": 6,
    "thiruvanmiyur": 7,
    "velachery": 8,
    "guindy": 6,
    "porur": 10,
    "ambattur": 14,
    "anna nagar": 7,
    "mogappair": 9,
    "padi": 10,
    "avadi": 22,
    "tambaram": 20,
    "chromepet": 18,
    "pallavaram": 16,
    "medavakkam": 12,
    "sholinganallur": 15,
    "navalur": 18,
    "perungudi": 10,
    "thoraipakkam": 11,
    "injambakkam": 13,
    "egmore": 3,
    "chetpet": 4,
    "kilpauk": 5,
    "royapettah": 3,
    "saidapet": 5,
    "alwarpet": 4,
    "mandaveli": 5,
    "kotturpuram": 6,
    "ashok nagar": 4,
    "kk nagar": 6,
    "vadapalani": 5,
    "west mambalam": 3,
    "perambur": 8,
    "vysarpadi": 9,
    "tondiarpet": 10,
    "washermanpet": 9,
    "george town": 4,
    "parrys": 4,
    "redhills": 25,
    "minjur": 30
} 

def recommend_ngo(user_location):
    user_location = user_location.lower().strip()

    # get user distance
    user_dist = area_distance.get(user_location, 10)

    nearest_ngo = None
    min_diff = float('inf')

    for ngo in NGO.objects.all():
        diff = abs(ngo.distance - user_dist)

        if diff < min_diff:
            min_diff = diff
            nearest_ngo = ngo.name

    return nearest_ngo if nearest_ngo else "No NGO found"

def check_image_freshness(image_path):
    try:
        img = cv2.imread(image_path)

        if img is None:
            return "Unknown"

        # convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # calculate brightness
        brightness = np.mean(gray)

        # simple logic
        if brightness > 130:
            return "Fresh"
        elif brightness > 90:
            return "Use Soon"
        else:
            return "Expired"

    except:
        return "Unknown"


