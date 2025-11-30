document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const uaTextInput = document.getElementById('uaText');
    const targetLangSelect = document.getElementById('targetLang');
    const levelSelect = document.getElementById('level');
    const errorMsg = document.getElementById('errorMsg');
    const resultsSection = document.getElementById('resultsSection');
    const loader = document.querySelector('.loader');
    const btnText = document.querySelector('.btn-text');

    generateBtn.addEventListener('click', async () => {
        const text = uaTextInput.value.trim();
        const targetLang = targetLangSelect.value;
        const level = levelSelect.value;

        if (!text) {
            showError('Please enter some Ukrainian text.');
            return;
        }

        // Reset state
        hideError();
        setLoading(true);
        resultsSection.classList.add('hidden');

        try {
            const response = await fetch('https://masters-backend-teef.onrender.com/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    target_language: targetLang,
                    level: level
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to generate materials');
            }

            const data = await response.json();
            displayResults(data);

        } catch (error) {
            showError(error.message);
        } finally {
            setLoading(false);
        }
    });

    function displayResults(data) {
        document.getElementById('uaAdapted').textContent = data.ua_adapted;
        document.getElementById('translated').textContent = data.translated;
        
        const questionsUaList = document.getElementById('questionsUa');
        questionsUaList.innerHTML = '';
        data.questions_ua.forEach(q => {
            const li = document.createElement('li');
            li.textContent = q;
            questionsUaList.appendChild(li);
        });

        const questionsTargetList = document.getElementById('questionsTarget');
        questionsTargetList.innerHTML = '';
        data.questions_target.forEach(q => {
            const li = document.createElement('li');
            li.textContent = q;
            questionsTargetList.appendChild(li);
        });

        resultsSection.classList.remove('hidden');
    }

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
    }

    function hideError() {
        errorMsg.classList.add('hidden');
    }

    function setLoading(isLoading) {
        generateBtn.disabled = isLoading;
        if (isLoading) {
            loader.classList.remove('hidden');
            btnText.textContent = 'Generating...';
        } else {
            loader.classList.add('hidden');
            btnText.textContent = 'Generate Materials';
        }
    }
});



