from typing import Dict, Any

class HealthCalculator:
    @staticmethod
    def calculate(
        sleep_hours: float,
        exercise_mins: int,
        water_ml: int,
        systolic_bp: int,
        diastolic_bp: int,
        heart_rate: int,
        weight_kg: float,
        height_cm: float,
        diet_quality: str,
        smoking_alcohol: str
    ) -> Dict[str, Any]:
        
        # Calculate BMI
        height_m = height_cm / 100.0
        bmi = round(weight_kg / (height_m * height_m), 1)
        
        # Base score starts at 100
        score = 100
        breakdown = {}
        tips = []

        # 1. Sleep Evaluation (Max score component: -15)
        sleep_deduction = 0
        if sleep_hours < 6.0:
            sleep_deduction = 15 if sleep_hours < 5.0 else 8
            tips.append(f"Your sleep duration ({sleep_hours} hrs) is below the recommended 7-9 hours. Aim for consistent rest.")
        elif sleep_hours > 9.5:
            sleep_deduction = 5
            tips.append(f"Your sleep duration ({sleep_hours} hrs) is slightly excessive. Aim for 7-9 hours of consistent rest.")
        score -= sleep_deduction
        breakdown["sleep"] = 15 - sleep_deduction

        # 2. Exercise Evaluation (Max score component: -15)
        exercise_deduction = 0
        if exercise_mins < 15:
            exercise_deduction = 15
            tips.append("Sedentary lifestyle warning. Try adding at least 15-30 minutes of moderate cardiovascular activity daily.")
        elif exercise_mins < 30:
            exercise_deduction = 8
            tips.append("Good start on physical activity, but increasing daily exercise to 30+ minutes yields higher health benefits.")
        score -= exercise_deduction
        breakdown["exercise"] = 15 - exercise_deduction

        # 3. Water Intake Evaluation (Max score component: -10)
        water_deduction = 0
        if water_ml < 1500:
            water_deduction = 10 if water_ml < 1000 else 5
            tips.append(f"Water intake ({water_ml} ml) is low. Try keeping a water bottle nearby and aim for 2000-3000 ml daily.")
        score -= water_deduction
        breakdown["water"] = 10 - water_deduction

        # 4. Blood Pressure Evaluation (Max score component: -20)
        bp_deduction = 0
        # High BP (Hypertension)
        if systolic_bp >= 140 or diastolic_bp >= 90:
            bp_deduction = 20
            tips.append(f"Elevated blood pressure detected ({systolic_bp}/{diastolic_bp} mmHg). Consult a physician regarding hypertension risks.")
        elif systolic_bp >= 130 or diastolic_bp >= 80:
            bp_deduction = 10
            tips.append(f"Pre-hypertensive blood pressure range ({systolic_bp}/{diastolic_bp} mmHg). Consider reducing sodium intake and managing stress.")
        # Low BP (Hypotension)
        elif systolic_bp < 90 or diastolic_bp < 60:
            bp_deduction = 12
            tips.append(f"Low blood pressure range detected ({systolic_bp}/{diastolic_bp} mmHg). Ensure adequate hydration and mineral intake.")
        score -= bp_deduction
        breakdown["blood_pressure"] = 20 - bp_deduction

        # 5. Heart Rate Evaluation (Max score component: -10)
        hr_deduction = 0
        if heart_rate > 100:
            hr_deduction = 10
            tips.append(f"Tachycardia warning: Fast resting heart rate ({heart_rate} bpm). Limit stimulants and manage stress.")
        elif heart_rate < 55:
            # Assume healthy if active, else tag deduction
            if exercise_mins < 30:
                hr_deduction = 5
                tips.append(f"Bradycardia warning: Low resting heart rate ({heart_rate} bpm) combined with lower exercise activity.")
        score -= hr_deduction
        breakdown["heart_rate"] = 10 - hr_deduction

        # 6. BMI Evaluation (Max score component: -15)
        bmi_deduction = 0
        if bmi < 18.5:
            bmi_deduction = 10
            tips.append(f"Underweight range (BMI: {bmi}). Ensure high-nutrient caloric intake and muscle building exercises.")
        elif 25.0 <= bmi < 29.9:
            bmi_deduction = 8
            tips.append(f"Overweight range (BMI: {bmi}). Modest diet corrections and steady exercise can return you to normal weight.")
        elif bmi >= 30.0:
            bmi_deduction = 15
            tips.append(f"Obese range (BMI: {bmi}). Reducing processed carbs and seeking clinical nutritional counseling is advised.")
        score -= bmi_deduction
        breakdown["bmi"] = 15 - bmi_deduction

        # 7. Lifestyle Evaluation (Max score component: -15)
        lifestyle_deduction = 0
        
        # Diet
        if diet_quality == "Poor":
            lifestyle_deduction += 7
            tips.append("Diet quality is poor. Try replacing processed foods and sugars with whole grains, leafy greens, and lean proteins.")
        elif diet_quality == "Average":
            lifestyle_deduction += 3
            
        # Smoking & Alcohol
        if smoking_alcohol == "Frequent":
            lifestyle_deduction += 8
            tips.append("Frequent smoking/alcohol consumption significantly affects long-term health. Seek quit-support programs.")
        elif smoking_alcohol == "Occasional":
            lifestyle_deduction += 4
            tips.append("Limit occasional alcohol/smoking to minimize toxic burden on liver and cardiovascular vessels.")
            
        score -= lifestyle_deduction
        breakdown["lifestyle"] = 15 - lifestyle_deduction

        # Ensure bounds
        score = max(10, min(100, score))
        
        if score > 85:
            status = "Excellent"
        elif score > 70:
            status = "Good"
        elif score > 50:
            status = "Fair"
        else:
            status = "Poor"

        # If everything is perfect
        if not tips:
            tips.append("Outstanding metrics! Continue maintaining your current lifestyle and activity patterns.")

        return {
            "score": score,
            "bmi": bmi,
            "status": status,
            "breakdown": breakdown,
            "tips": tips
        }
