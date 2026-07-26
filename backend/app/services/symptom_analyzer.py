from typing import List, Dict, Any

class SymptomAnalyzer:
    @staticmethod
    def analyze(symptoms: List[str], duration_days: int, age: int, gender: str, notes: str = None) -> Dict[str, Any]:
        # Normalize symptoms for matching
        normalized = [s.strip().lower() for s in symptoms]
        
        diagnosis = "General Wellness Consultation Recommended"
        severity = "Low"
        recommendations = [
            "Monitor symptoms closely over the next 48 hours.",
            "Stay well-hydrated and ensure adequate rest.",
            "If symptoms persist or worsen, schedule a visit with your primary care provider."
        ]
        possible_causes = ["Mild fatigue", "Environmental factors", "Sub-clinical viral activity"]
        triage_category = "Self-care"
        urgency_level = "Routine"

        # Define symptom conditions
        has_chest_pain = any("chest" in s or "heart" in s for s in normalized)
        has_shortness_breath = any("breath" in s or "breathing" in s or "dyspnea" in s for s in normalized)
        has_fever = any("fever" in s or "temp" in s or "chills" in s for s in normalized)
        has_cough = any("cough" in s or "congestion" in s for s in normalized)
        has_headache = any("headache" in s or "migraine" in s or "head" in s for s in normalized)
        has_fatigue = any("fatigue" in s or "tired" in s or "weakness" in s for s in normalized)
        has_stomach_pain = any("stomach" in s or "abdominal" in s or "nausea" in s or "vomit" in s or "diarrhea" in s for s in normalized)
        has_sore_throat = any("throat" in s or "pharyngitis" in s for s in normalized)
        has_stiff_neck = any("neck" in s or "stiff" in s for s in normalized)
        has_dizziness = any("dizzy" in s or "dizziness" in s or "lightheaded" in s for s in normalized)
        has_urinary = any("urin" in s or "pee" in s for s in normalized)
        has_joint_pain = any("joint" in s or "arthr" in s or "knee" in s or "back" in s for s in normalized)

        # Let's perform heuristic evaluation
        if has_chest_pain and (has_shortness_breath or has_dizziness):
            diagnosis = "Cardiovascular Concern (Potential Angina or Cardiac Event)"
            severity = "Critical"
            possible_causes = ["Myocardial Infarction (Heart Attack)", "Angina Pectoris", "Severe Arrhythmia"]
            recommendations = [
                "URGENT: Call emergency services (911 or your local emergency number) immediately.",
                "Chew an aspirin if you are not allergic and have it available.",
                "Sit down, stay calm, and avoid physical exertion.",
                "Do NOT attempt to drive yourself to the emergency department."
            ]
            triage_category = "Emergency Room"
            urgency_level = "Immediate"

        elif has_fever and has_stiff_neck and has_headache:
            diagnosis = "Neurological / Systemic Infection Warning (Possible Meningitis)"
            severity = "Critical"
            possible_causes = ["Bacterial Meningitis", "Viral Meningitis", "Severe Encephalitis"]
            recommendations = [
                "Seek immediate emergency medical attention.",
                "Avoid delay, as meningitis can progress extremely rapidly.",
                "Prepare to undergo diagnostic testing, including a lumbar puncture."
            ]
            triage_category = "Emergency Room"
            urgency_level = "Immediate"

        elif has_fever and has_cough and has_shortness_breath:
            diagnosis = "Lower Respiratory Tract Infection (Possible Pneumonia or Bronchitis)"
            severity = "High"
            possible_causes = ["Pneumonia (Viral or Bacterial)", "COVID-19", "Acute Bronchitis"]
            recommendations = [
                "Schedule an urgent checkup with a healthcare professional today.",
                "Check blood oxygen levels using a pulse oximeter if available. Seek immediate care if below 92%.",
                "Rest, stay isolated, and drink plenty of warm fluids.",
                "Use over-the-counter fever reducers (like acetaminophen) as directed."
            ]
            triage_category = "Urgent Care"
            urgency_level = "Within 12-24 Hours"

        elif has_fever and has_cough and has_sore_throat:
            diagnosis = "Upper Respiratory Tract Infection"
            severity = "Medium"
            possible_causes = ["Influenza (Flu)", "Common Cold", "Streptococcal Pharyngitis (Strep Throat)", "Mild COVID-19"]
            recommendations = [
                "Get plenty of rest and stay well-hydrated.",
                "Gargle with warm salt water to relieve sore throat symptoms.",
                "Consider taking a rapid COVID-19 test at home.",
                "Consult a clinic if symptoms persist beyond 7-10 days or worsen significantly."
            ]
            triage_category = "Primary Care Clinic"
            urgency_level = "Within 2-3 Days"

        elif has_stomach_pain and (has_stomach_pain or has_fatigue):
            # Check for severity based on duration or notes
            if duration_days > 5 or "severe" in (notes or "").lower():
                diagnosis = "Persistent Gastrointestinal Disorder"
                severity = "Medium"
                possible_causes = ["Irritable Bowel Syndrome (IBS)", "Gastritis", "Food Intolerance", "Inflammatory Bowel Disease"]
                recommendations = [
                    "Consult a gastroenterologist or primary care physician.",
                    "Keep a detailed food and symptom diary to identify potential triggers.",
                    "Eat small, frequent meals and avoid fatty, spicy, or processed foods.",
                    "Seek immediate care if you notice blood in stool or experience persistent vomiting."
                ]
                triage_category = "Primary Care Clinic"
                urgency_level = "Within 3-5 Days"
            else:
                diagnosis = "Acute Gastroenteritis or Indigestion"
                severity = "Low"
                possible_causes = ["Food Poisoning", "Viral Gastroenteritis (Stomach Flu)", "Dyspepsia"]
                recommendations = [
                    "Maintain hydration by sipping clear fluids (water, broth, electrolyte solutions).",
                    "Follow a bland diet (BRAT diet: Bananas, Rice, Applesauce, Toast).",
                    "Avoid dairy, caffeine, and alcohol until symptoms resolve completely."
                ]
                triage_category = "Self-care"
                urgency_level = "Routine"

        elif has_headache and has_fatigue:
            diagnosis = "Tension-Type Headache or Chronic Fatigue"
            severity = "Low"
            possible_causes = ["Lack of sleep", "Dehydration", "High stress levels", "Eye strain"]
            recommendations = [
                "Ensure you get at least 7-8 hours of quality sleep.",
                "Increase daily water intake to at least 2-2.5 liters.",
                "Practice stress-relief techniques (deep breathing, meditation, walks).",
                "Limit screen time and take regular breaks using the 20-20-20 rule."
            ]
            triage_category = "Self-care"
            urgency_level = "Routine"

        elif has_urinary:
            diagnosis = "Potential Urinary Tract Infection (UTI)"
            severity = "Medium"
            possible_causes = ["Cystitis (UTI)", "Urethritis", "Bladder irritation"]
            recommendations = [
                "Consult a healthcare provider for a urinalysis and possible antibiotics.",
                "Drink plenty of water to help flush bacteria from your urinary tract.",
                "Avoid bladder irritants like caffeine, alcohol, and carbonated beverages.",
                "Take over-the-counter urinary pain relief medication if needed, but do not delay medical evaluation."
            ]
            triage_category = "Primary Care Clinic"
            urgency_level = "Within 24-48 Hours"

        elif has_joint_pain:
            diagnosis = "Musculoskeletal or Joint Inflammation"
            severity = "Medium"
            possible_causes = ["Osteoarthritis", "Rheumatoid Arthritis", "Muscle Strain", "Repetitive Strain Injury"]
            recommendations = [
                "Apply gentle heat or ice packs to the affected joints.",
                "Incorporate low-impact exercises like swimming or walking.",
                "Consult a physician or physical therapist for joint assessment.",
                "If stiffness is worst in the morning and lasts over 30 minutes, mention it to your doctor."
            ]
            triage_category = "Primary Care Clinic"
            urgency_level = "Within 1-2 Weeks"

        # Apply specific age factors
        if age > 65 and severity in ["Medium", "High"]:
            severity = "High" if severity == "Medium" else "Critical"
            recommendations.append("IMPORTANT: Given your age group, symptoms can escalate quickly. Proactive contact with a physician is highly advised.")
        
        if age < 12 and has_fever:
            severity = "High"
            recommendations.append("Pediatric Fever: Children should be evaluated by a pediatrician if high fever persists for more than 24 hours.")

        return {
            "symptoms": ", ".join(symptoms),
            "duration_days": duration_days,
            "severity": severity,
            "diagnosis": diagnosis,
            "recommendations": recommendations,
            "additional_info": {
                "possible_causes": possible_causes,
                "triage_category": triage_category,
                "urgency_level": urgency_level,
                "age_group_warning": age > 65 or age < 12
            }
        }
