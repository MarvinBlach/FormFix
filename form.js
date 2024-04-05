document.addEventListener("DOMContentLoaded", function() {
    const swiperInstance = document.querySelector('#form-swiper').swiper;

     // Email validation function
     function isValidEmail(email) {
        const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Simple email pattern
        return pattern.test(email);

        
    }

    function toggleNextButtonOnLastSlide() {
        const nextButton = document.querySelector('[next]');
        // Check if the active slide is the last slide
        if (swiperInstance.isEnd) {
            nextButton.style.display = 'none'; // Hide the 'Next' button
        } else {
            nextButton.style.display = ''; // Show the 'Next' button if it's not the last slide
        }
    }

    function checkRequiredFieldsInActiveSlide() {
        const activeSlide = document.querySelector('#form-swiper .is-active');
        const requiredElements = activeSlide.querySelectorAll('[pflicht]');
        const nextButton = document.querySelector('[next]');

        let allFieldsFilled = true;

        // Check radio buttons and group them by name
        const radioGroups = {};
        requiredElements.forEach(element => {
            if (element.type.toLowerCase() === 'radio') {
                const name = element.name;
                radioGroups[name] = radioGroups[name] || [];
                radioGroups[name].push(element);
            }
        });

        // Ensure at least one radio button in each group is checked
        Object.values(radioGroups).forEach(group => {
            if (!group.some(radio => radio.checked)) {
                allFieldsFilled = false;
            }
        });

        // Validate other inputs, including text and select fields
        requiredElements.forEach(element => {
            if (element.tagName.toLowerCase() === 'select' && element.value === 'Auswahl') { // Assuming 'Auswahl' is your placeholder value
                allFieldsFilled = false;
            } else if (element.tagName.toLowerCase() !== 'select' && element.value.trim() === '') {
                allFieldsFilled = false;
            }
        });

        requiredElements.forEach(element => {
            if (element.type.toLowerCase() === 'email' && !isValidEmail(element.value)) {
                allFieldsFilled = false; // Mark as invalid if the email is not correctly formatted
            }
        });

        // Apply or remove 'is-off' based on field validation
        if (allFieldsFilled) {
            nextButton.classList.remove('is-off');
            nextButton.removeAttribute('aria-disabled');
        } else {
            nextButton.classList.add('is-off');
            nextButton.setAttribute('aria-disabled', 'true');
        }
    }

    function skipSlideIfNeeded() {
        const rechnungsadresseSelect = document.querySelector('#Rechnungsadresse-3');
        if(rechnungsadresseSelect && rechnungsadresseSelect.value === 'gleiche-adresse') {
            const canSkipElements = document.querySelectorAll('[can-skip]');
            canSkipElements.forEach(element => {
                element.removeAttribute('pflicht');
            });
            // Force check after modification to ensure the next button is clickable.
            checkRequiredFieldsInActiveSlide();
            // Automatically click the next button to skip
            const nextButton = document.querySelector('[next]:not(.is-off)');
            if(nextButton) {
                nextButton.click();
            }
        }
    }

    // Re-validate fields when the slide changes and possibly skip slide
    swiperInstance.on('slideChange', function () {
        checkRequiredFieldsInActiveSlide();
        skipSlideIfNeeded(); // Call skip function on slide change if conditions are met
        toggleNextButtonOnLastSlide();
    });

    // Attach event listeners for real-time field validation
    document.querySelectorAll('#form-swiper [pflicht]').forEach(input => {
        input.addEventListener('change', checkRequiredFieldsInActiveSlide);
        // Include 'keyup' event listener for text inputs for real-time feedback
        if (input.tagName.toLowerCase() !== 'select') {
            input.addEventListener('keyup', checkRequiredFieldsInActiveSlide);
        }
    });

    // Listener for 'Rechnungsadresse-3' select field change
    const rechnungsadresseSelect = document.querySelector('#Rechnungsadresse-3');
    if(rechnungsadresseSelect) {
        rechnungsadresseSelect.addEventListener('change', function() {
            if(this.value === 'gleiche-adresse') {
                const nextButton = document.querySelector('[next]');
                nextButton.addEventListener('click', skipSlideIfNeeded, {once: true});
            }
        });
    }

    // Perform an initial validation check
    checkRequiredFieldsInActiveSlide();
});
