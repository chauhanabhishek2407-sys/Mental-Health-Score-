const API_URL = "http://127.0.0.1:8000/predict";

const form = document.getElementById("predictForm");
const submitBtn = document.getElementById("submitBtn");
const loadingOverlay = document.getElementById("loadingOverlay");
const resultCard = document.getElementById("resultCard");
const errorMsg = document.getElementById("errorMsg");
const closeResult = document.getElementById("closeResult");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const scoreValue = document.getElementById("scoreValue");
const scoreLabel = document.getElementById("scoreLabel");
const resultIcon = document.getElementById("resultIcon");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const payload = {
    age: Number(form.age.value),
    gender: form.gender.value,
    country: form.country.value.trim(),
    academic_level: form.academic_level.value,
    most_used_platform: form.most_used_platform.value,
    purpose_of_use: form.purpose_of_use.value,
    avg_daily_usage_hours: Number(form.avg_daily_usage_hours.value),
    daily_unlocks: Number(form.daily_unlocks.value),
    study_hours: Number(form.study_hours.value),
    physical_activity_hours: Number(form.physical_activity_hours.value),
    sleep_hours_per_night: Number(form.sleep_hours_per_night.value),
    stress_level: form.stress_level.value,
  };

  showLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      const detail = errData?.detail
        ? Array.isArray(errData.detail)
          ? errData.detail.map((d) => d.msg).join(", ")
          : errData.detail
        : `Request failed with status ${response.status}`;
      throw new Error(detail);
    }

    const data = await response.json();
    showResult(data.predicted_mental_health_score);
  } catch (err) {
    showError(
      err.message.includes("Failed to fetch")
        ? "Could not reach the API. Make sure the FastAPI server is running on http://127.0.0.1:8000"
        : err.message
    );
  } finally {
    showLoading(false);
  }
});

function showLoading(state) {
  loadingOverlay.classList.toggle("hidden", !state);
  submitBtn.disabled = state;
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
  errorMsg.textContent = "";
}

function showResult(score) {
  scoreValue.textContent = score;

  let label = "Balanced";
  let icon = "🙂";

  if (score >= 8) {
    label = "Excellent";
    icon = "🌟";
  } else if (score >= 6) {
    label = "Good";
    icon = "🙂";
  } else if (score >= 4) {
    label = "Moderate";
    icon = "😐";
  } else {
    label = "Needs Attention";
    icon = "⚠️";
  }

  scoreLabel.textContent = label;
  resultIcon.textContent = icon;
  resultCard.classList.remove("hidden");
}

function hideResult() {
  resultCard.classList.add("hidden");
}

closeResult.addEventListener("click", hideResult);
tryAgainBtn.addEventListener("click", hideResult);
