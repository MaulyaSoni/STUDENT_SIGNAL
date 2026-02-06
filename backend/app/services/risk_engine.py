def calculate_risk(student):
    score = 0

    if student["attendance"] < 75:
        score += 1
    if student["consecutive_absences"] >= 5:
        score += 1

    for sub in student["academics"]:
        if sub["attempts_used"] >= 2:
            score += 1

    return score
